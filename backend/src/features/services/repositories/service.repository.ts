import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Service, ServiceStatus } from '../entities/service.entity';

export interface ServiceSearchOptions {
  page: number;
  limit: number;
  providerId?: string;
  search?: string;
  status?: ServiceStatus;
  onlyActive?: boolean;
}

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(Service)
    private readonly repository: Repository<Service>,
  ) {}

  create(data: DeepPartial<Service>): Promise<Service> {
    return this.repository.save(this.repository.create(data));
  }

  findById(id: string): Promise<Service | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByProviderAndName(providerId: string, name: string): Promise<Service | null> {
    return this.repository.findOne({ where: { providerId, name } });
  }

  async search(options: ServiceSearchOptions): Promise<[Service[], number]> {
    const query = this.repository.createQueryBuilder('service');

    if (options.providerId) {
      query.andWhere('service.providerId = :providerId', {
        providerId: options.providerId,
      });
    }
    if (options.search) {
      query.andWhere('service.name ILIKE :search', {
        search: `%${options.search}%`,
      });
    }
    if (options.status) {
      query.andWhere('service.status = :status', { status: options.status });
    }
    if (options.onlyActive) {
      query.andWhere('service.status = :activeStatus', {
        activeStatus: ServiceStatus.ACTIVE,
      });
    }

    query
      .orderBy('service.createdAt', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit);

    return query.getManyAndCount();
  }

  async update(id: string, data: DeepPartial<Service>): Promise<Service | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }
}
