import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  /** VND, số nguyên. Bỏ trống = 0 (miễn phí). */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2_000_000_000)
  price?: number;

  /** Số chỗ tối đa mỗi lượt. Bỏ trống = 1. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100_000)
  capacity?: number;

  @IsUUID()
  providerId!: string;
}