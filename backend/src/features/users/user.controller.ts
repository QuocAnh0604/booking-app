import {
  Body,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPolicy } from './policies/user.policy';
import type { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Can(UserPolicy, 'list')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Can(UserPolicy, 'access', (context: ExecutionContext) => [
    context.switchToHttp().getRequest().params.id,
  ])
  findOne(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.userService.findOne(user, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Can(UserPolicy, 'access', (context: ExecutionContext) => [
    context.switchToHttp().getRequest().params.id,
  ])
  update(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user, id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Can(UserPolicy, 'remove')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
