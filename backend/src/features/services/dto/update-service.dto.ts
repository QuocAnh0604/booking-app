// service/dto/update-service.dto.ts
//
// Mọi field đều optional (PartialType), validation kế thừa từ CreateServiceDto.
// Không có `status`: ẩn/hiện service đi qua DELETE :id và PATCH :id/activate.

import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  declare description?: string;
}
