import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { MatchField } from 'src/common/decorators/match.decorator';
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one number',
  })
  password!: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @MatchField('password', {message: 'Confirm password must match password'})
  confirmPassword!: string;
}
