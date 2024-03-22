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

  // @IsNotEmpty()
  @IsString()
  @IsOptional()
  startTime: string;

  // @IsNotEmpty()
  @IsString()
  @IsOptional()
  endTime: string;

  // @IsNotEmpty()
  @IsString()
  @IsOptional()
  startDate: string;

  // @IsNotEmpty()
  @IsString()
  @IsOptional()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  licenceNumber: string;

  @IsNotEmpty()
  @IsString()
  idProof: string;
}
