import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { RoomType } from '../entities/room-type.entity';

@Injectable()
export class RoomTypeRepository {
  constructor(
    @InjectRepository(RoomType)
    private readonly repository: Repository<RoomType>,
  ) {}

  create(data: DeepPartial<RoomType>): Promise<RoomType> {
    return this.repository.save(this.repository.create(data));
  }

  findAll(): Promise<RoomType[]> {
    return this.repository.find({ relations: { rooms: true } });
  }

  findById(id: string): Promise<RoomType | null> {
    return this.repository.findOne({ where: { id }, relations: { rooms: true } });
  }

  async update(id: string, data: DeepPartial<RoomType>): Promise<RoomType | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
