import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';

@Injectable()
export class HotelRepository {
  constructor(
    @InjectRepository(Hotel)
    private readonly repository: Repository<Hotel>,
  ) {}

  create(data: DeepPartial<Hotel>): Promise<Hotel> {
    return this.repository.save(this.repository.create(data));
  }

  findAll(): Promise<Hotel[]> {
    return this.repository.find({ relations: { rooms: true } });
  }

  findById(id: string): Promise<Hotel | null> {
    return this.repository.findOne({ where: { id }, relations: { rooms: true } });
  }

  async update(id: string, data: DeepPartial<Hotel>): Promise<Hotel | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
