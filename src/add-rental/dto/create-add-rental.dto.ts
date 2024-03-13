import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddRentalDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsString()
  rent: string;

  @IsNotEmpty()
  @IsString()
  engine: string;

  @IsOptional()
  @IsString()
  mileage: string;

  @IsOptional()
  @IsString()
  km: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  bikeId: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
