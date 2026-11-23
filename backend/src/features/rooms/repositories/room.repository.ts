import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(Room)
    private readonly repository: Repository<Room>,
  ) {}

  create(data: DeepPartial<Room>): Promise<Room> {
    return this.repository.save(this.repository.create(data));
  }

  findAll(): Promise<Room[]> {
    return this.repository.find({ relations: { hotel: true, roomType: true } });
  }

  findById(id: string): Promise<Room | null> {
    return this.repository.findOne({
      where: { id },
      relations: { hotel: true, roomType: true },
    });
  }

  async update(id: string, data: DeepPartial<Room>): Promise<Room | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
