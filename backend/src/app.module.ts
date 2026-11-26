import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './features/users/entities/user.entity';
import { Booking } from './features/bookings/entities/booking.entity';
import { Provider } from './features/providers/entities/provider.entity';
import { RoomType } from './features/room-types/entities/room-type.entity';
import { Room } from './features/rooms/entities/room.entity';
import { AuthenticationModule } from '@nestjs/authentication';
import { UserModule } from './features/users/user.module';
import { AuthModule } from './features/auths/auth.module';
import { ProvidersModule } from './features/providers/providers.module';
import { ServiceModule } from './features/services/service.module';
import type { Duration } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { BookingModule } from './features/bookings/booking.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        entities: [User, Provider, RoomType, Room, Booking],
        synchronize: true,
      }),
    }),
    AuthenticationModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        accessToken: {
          key: config.getOrThrow<string>('JWT_ACCESS_TOKEN'),
          ttl: config.get<string>('JWT_ACCESS_TTL', '15m') as Duration,
        },
        refreshToken: {
          key: config.getOrThrow<string>('JWT_REFRESH_TOKEN'),
          ttl: config.get<string>('JWT_REFRESH_TTL', '7d') as Duration,
        },
        allowInMemoryStorage: true,
      }),
    }),
    AuthorizationModule.forRoot(),
    UserModule, AuthModule, ProvidersModule, ServiceModule, BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
