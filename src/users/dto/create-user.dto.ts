import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  role: string;
}

export class User extends CreateUserDto {
  status: boolean;
  message: string;
  user: CreateUserDto;
}

export interface EmptyUser {
  status: boolean;
  message: string;
  user: unknown;
}
