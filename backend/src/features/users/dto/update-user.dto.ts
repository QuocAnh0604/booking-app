import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { Role } from "src/common/enums/role.enum";
export class UpdateUserDto {
    @IsOptional()
    @Length(2, 255)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    fullName?: string;
    @IsEmail()
    @IsString()
    email?: string;
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}