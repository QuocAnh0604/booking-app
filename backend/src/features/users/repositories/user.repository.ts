import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(data: DeepPartial<User>): Promise<User> {
    return this.repository.save(this.repository.create(data));
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({email})
  }
  async update(id: string, data: DeepPartial<User>): Promise<User | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
