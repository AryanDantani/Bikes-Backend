import { IsNumber, IsString } from 'class-validator';

export class CreateRewardDto {
  @IsNumber()
  reward: number;

  @IsString()
  user: string;

  @IsString()
  expiredDate: Date;
}
