import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import type { User } from '../users/entities/user.entity';
import { ServiceService } from './service.service';
import { ServicePolicy } from './service.policy';
import { CreateServiceDto } from './dto/create-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Can(ServicePolicy, 'create')
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Can.Anyone()
  findAll(@CurrentUser() user: User, @Query() filter: FilterServiceDto) {
    return this.serviceService.findAll(user, filter);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Can.Anyone()
  findOne(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.serviceService.findOne(user, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Can(ServicePolicy, 'update')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, dto);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @Can(ServicePolicy, 'update')
  activate(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.serviceService.activate(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Can(ServicePolicy, 'remove')
  patch(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.serviceService.hide(id);
  }
}
