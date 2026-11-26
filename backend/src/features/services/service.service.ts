// service/service.service.ts
//
// Đặt tên ServiceService cho khớp quy ước UserService của bạn (entity là `Service`).
// Quy ước kiểm tra quyền:
//  - create / update / activate / remove: route đã có @Can(ServicePolicy, ...), service không authorize lại.
//  - findAll / findOne: route là @Can.Anyone(), service tự hỏi policy 'viewInactive'.

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthorizationService } from '@nestjs/authorization';
import type { User } from '../users/entities/user.entity';
import { Service, ServiceStatus } from './entities/service.entity';
import { ServiceRepository } from './repositories/service.repository';
import { ServicePolicy } from './service.policy';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { ProviderRepository } from '../providers/repositories/provider.repository';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ServiceService {
  constructor(
    private readonly authz: AuthorizationService,
    private readonly serviceRepo: ServiceRepository,
    private readonly providerRepo: ProviderRepository,
  ) {}

  // ---------- Đọc ----------

  async findAll(actor: User, filter: FilterServiceDto): Promise<Paginated<Service>> {
    // STAFF/ADMIN thấy cả INACTIVE, khách chỉ thấy ACTIVE
    const canViewInactive = await this.authz.can(ServicePolicy, 'viewInactive', actor);

    const [items, total] = await this.serviceRepo.search({
      ...filter,
      onlyActive: !canViewInactive,
    });
    return { items, total, page: filter.page, limit: filter.limit };
  }

  async findOne(actor: User, id: string): Promise<Service> {
    const service = await this.getOrFail(id);

    if (service.status === ServiceStatus.INACTIVE) {
      const canViewInactive = await this.authz.can(ServicePolicy, 'viewInactive', actor);
      // 404 thay vì 403 để khách không biết service ẩn có tồn tại
      if (!canViewInactive) throw new NotFoundException('Service not found');
    }
    return service;
  }

  // ---------- Ghi (STAFF/ADMIN, đã chặn ở route) ----------

  async create(dto: CreateServiceDto): Promise<Service> {
    const name = this.normalizeName(dto.name);
    this.assertPrice(dto.price);
    this.assertCapacity(dto.capacity);

    await this.assertProviderExists(dto.providerId);
    await this.assertNameAvailable(dto.providerId, name);

    try {
      return await this.serviceRepo.create({
        name,
        description: dto.description?.trim() || null,
        price: dto.price ?? 0,
        capacity: dto.capacity ?? 1,
        providerId: dto.providerId,
        status: ServiceStatus.ACTIVE,
      });
    } catch (e) {
      this.rethrowIfDuplicate(e); // hai request tạo cùng lúc vẫn lọt qua check ở trên
    }
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const current = await this.getOrFail(id);
    const data: Partial<Service> = {};

    if (dto.name !== undefined) data.name = this.normalizeName(dto.name);

    if (dto.description !== undefined) {
      data.description = dto.description?.trim() || null;
    }

    if (dto.price !== undefined) {
      this.assertPrice(dto.price);
      data.price = dto.price;
    }

    if (dto.capacity !== undefined) {
      this.assertCapacity(dto.capacity);
      data.capacity = dto.capacity;
    }

    if (dto.providerId !== undefined && dto.providerId !== current.providerId) {
      await this.assertProviderExists(dto.providerId);
      data.providerId = dto.providerId;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('At least one field is required');
    }

    // Đổi tên hoặc đổi provider thì phải kiểm tra lại unique (providerId, name)
    if (data.name !== undefined || data.providerId !== undefined) {
      await this.assertNameAvailable(
        data.providerId ?? current.providerId,
        data.name ?? current.name,
        id,
      );
    }

    try {
      const updated = await this.serviceRepo.update(id, data);
      return updated ?? current;
    } catch (e) {
      this.rethrowIfDuplicate(e);
    }
  }

  /** DELETE /services/:id thực chất là ẩn service (INACTIVE), không xóa cứng. */
  async hide(id: string): Promise<Service> {
    const service = await this.getOrFail(id);
    if (service.status === ServiceStatus.INACTIVE) return service;

    // TODO(booking): khi có BookingRepository, chặn nếu còn booking đang giữ chỗ:
    // const active = await this.bookingRepo.countActiveByService(id); // PENDING + CONFIRMED
    // if (active > 0) throw new ConflictException('Service still has active bookings');

    return (await this.serviceRepo.update(id, { status: ServiceStatus.INACTIVE })) ?? service;
  }

  async activate(id: string): Promise<Service> {
    const service = await this.getOrFail(id);
    if (service.status === ServiceStatus.ACTIVE) return service;

    return (await this.serviceRepo.update(id, { status: ServiceStatus.ACTIVE })) ?? service;
  }

  // ---------- Helper nội bộ ----------

  /** Entity thô, dùng cho module khác (ví dụ BookingService kiểm tra service tồn tại và ACTIVE). */
  async findById(id: string): Promise<Service | null> {
    return this.serviceRepo.findById(id);
  }

  private async getOrFail(id: string): Promise<Service> {
    const service = await this.serviceRepo.findById(id);
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  private normalizeName(raw: string): string {
    const name = raw.trim();
    if (name.length < 1 || name.length > 255) {
      throw new BadRequestException('Name must be between 1 and 255 characters');
    }
    return name;
  }

  private assertPrice(price?: number) {
    if (price === undefined) return;
    if (!Number.isInteger(price) || price < 0) {
      throw new BadRequestException('Price must be a non-negative integer (VND)');
    }
  }

  private assertCapacity(capacity?: number) {
    if (capacity === undefined) return;
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new BadRequestException('Capacity must be an integer >= 1');
    }
  }

  private async assertProviderExists(providerId: string) {
    const provider = await this.providerRepo.findById(providerId);
    if (!provider) throw new BadRequestException('Provider does not exist');
  }

  private async assertNameAvailable(providerId: string, name: string, excludeId?: string) {
    const existing = await this.serviceRepo.findByProviderAndName(providerId, name);
    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Service name already exists for this provider');
    }
  }

  private rethrowIfDuplicate(e: unknown): never {
    const err = e as { code?: string; driverError?: { code?: string } };
    if ((err?.code ?? err?.driverError?.code) === '23505') {
      throw new ConflictException('Service name already exists for this provider');
    }
    throw e;
  }
}
