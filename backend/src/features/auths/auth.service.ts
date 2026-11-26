import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { UserService } from '../users/user.service';
import { LoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto) {
    const name = typeof dto?.fullName === 'string' ? dto.fullName.trim() : '';
    const email = typeof dto?.email === 'string' ? dto.email.trim().toLowerCase() : '';
    const password = typeof dto?.password === 'string' ? dto.password : '';

    if (name.length < 1 || name.length > 120) {
      throw new BadRequestException('Name must be between 1 and 120 characters');
    }
    if (password.length < 8 || password.length > 128) {
      throw new BadRequestException('Password must be between 8 and 128 characters');
    }
    if (await this.usersService.findByEmail(email)) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(password);
    return this.usersService.create({ name, email }, passwordHash);
  }

  async login(dto: LoginDto) {
    const email = typeof dto?.email === 'string' ? dto.email.trim().toLowerCase() : '';
    const password = typeof dto?.password === 'string' ? dto.password : '';
    if (!email || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.findByEmail(email);
    const valid = await this.passwordHasher.verify(password, user?.passwordHash);
    if (!user || !user.passwordHash || !valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.tokenService.issue(String(user.id), { method: 'password' });
  }

  refresh(refreshToken: string) {
    if (typeof refreshToken !== 'string' || !refreshToken.trim()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.tokenService.refresh(refreshToken);
  }

  logout(refreshToken: string) {
    if (typeof refreshToken !== 'string' || !refreshToken.trim()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.tokenService.revoke(refreshToken);
  }
}
