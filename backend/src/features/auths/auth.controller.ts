import { Body, Controller, HttpCode, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from '@nestjs/authentication';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Can } from '@nestjs/authorization'
import { RefreshTokenDto } from './dto/refreshToken.dto';
import type { PublicUser } from '../users/user.service';
import type { User } from '../users/entities/user.entity';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Public()
  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() dto: RefreshTokenDto) { return this.authService.refresh(dto.refreshToken) }

  @Get('me')
  @Can.Anyone()
  me(@CurrentUser() user: User): PublicUser {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }
}
