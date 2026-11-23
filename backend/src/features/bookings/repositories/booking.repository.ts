import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
  ) {}

  create(data: DeepPartial<Booking>): Promise<Booking> {
    return this.repository.save(this.repository.create(data));
  }

  findAll(): Promise<Booking[]> {
    return this.repository.find({ relations: { user: true, room: true } });
  }

  findById(id: string): Promise<Booking | null> {
    return this.repository.findOne({
      where: { id },
      relations: { user: true, room: true },
    });
  }

  async update(id: string, data: DeepPartial<Booking>): Promise<Booking | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
