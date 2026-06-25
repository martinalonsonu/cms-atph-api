import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(3)
  username!: string;

  @IsOptional()
  @IsIn(['ADMIN', 'WRITER'])
  role?: 'ADMIN' | 'WRITER';
}
