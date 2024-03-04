import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  bikeId: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsString()
  licenceNumber: string;
}
