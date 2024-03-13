import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBikeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsString()
  engine: string;

  @IsNotEmpty()
  @IsString()
  rent: string;

  @IsNotEmpty()
  @IsString()
  mileage: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  km: string;
}

export class Bike extends CreateBikeDto {
  status: boolean;
  message: string;
  bikeData: CreateBikeDto;
}

export interface EmptyBike {
  status: boolean;
  message: string;
  bikeData: unknown;
}
