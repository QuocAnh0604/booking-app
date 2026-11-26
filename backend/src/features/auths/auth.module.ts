import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { JwtAuth } from './dto/jwt.auth';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService,JwtAuth],
})
export class AuthModule {}
