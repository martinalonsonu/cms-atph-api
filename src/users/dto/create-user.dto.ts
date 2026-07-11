import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username!: string;

  @IsOptional()
  @IsIn(['ADMIN', 'WRITER'])
  role?: 'ADMIN' | 'WRITER';
}
