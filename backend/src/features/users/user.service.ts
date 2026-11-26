import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auths/dto/auth.dto';
import { Role } from '../../common/enums/role.enum';
import { AuthorizationService } from '@nestjs/authorization';
export type PublicUser = Omit<User, 'passwordHash'>;
import { UserPolicy } from './policies/user.policy';

type CreateUserInput = CreateUserDto | RegisterDto;

@Injectable()
export class UserService {
  constructor(
    private readonly authz: AuthorizationService,
    private readonly userRepo: UserRepository) { }

  private toPublicUser(user: User): PublicUser {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }

  async create(
    newUser: CreateUserInput,
    passwordHash?: string,
  ): Promise<PublicUser> {
    const fullName = 'fullName' in newUser ? newUser.fullName.trim() : newUser.name.trim();
    const email = newUser.email.trim().toLowerCase();

    if (fullName.length < 1 || fullName.length > 255) {
      throw new BadRequestException(
        'Full name must be between 1 and 255 characters',
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      throw new BadRequestException('Invalid email');
    }

    if (await this.userRepo.findByEmail(email)) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userRepo.create({
      fullName,
      email,
      passwordHash: passwordHash ?? '',
      role: Role.CUSTOMER,
    });

    return this.toPublicUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email.trim().toLowerCase());
  }

  async findById(id: string): Promise<User | null> {
  return this.userRepo.findById(id);   
}

// Dành cho controller: kiểm tra quyền, ném 404, trả PublicUser
async findOne(actor: User, id: string): Promise<PublicUser> {
  await this.authz.authorize(UserPolicy, 'access', actor, id);

  const user = await this.userRepo.findById(id);
  if (!user) throw new NotFoundException('User not found');
  return this.toPublicUser(user);
}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepo.findAll();
    return users.map((user) => this.toPublicUser(user));
  }
  
  async update(user: User, id: string, updateUserDto: UpdateUserDto): Promise<PublicUser> {
    await this.authz.authorize(UserPolicy, 'access', user, id);
    const currentUser = await this.findById(id);
    if (!currentUser) throw new NotFoundException('User not found');

    const data: Partial<User> = {};
    if (updateUserDto.fullName !== undefined) {
      const fullName = updateUserDto.fullName.trim();
      if (fullName.length < 1 || fullName.length > 255) {
        throw new BadRequestException(
          'Full name must be between 1 and 255 characters',
        );
      }
      data.fullName = fullName;
    }

    if (updateUserDto.email !== undefined) {
      const email = updateUserDto.email.trim().toLowerCase();
      if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new BadRequestException('Invalid email');
      }

      const duplicate = await this.userRepo.findByEmail(email);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Email already exists');
      }
      data.email = email;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('At least one of name or email is required');
    }

    const updatedUser = await this.userRepo.update(id, data);
    return this.toPublicUser(updatedUser ?? currentUser);
  }

  async remove(id: string): Promise<PublicUser> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.remove(id);
    return this.toPublicUser(user);
  }
}
