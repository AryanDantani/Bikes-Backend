import { IsString } from 'class-validator';

export class CreateEmailServiceDto {
  @IsString()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;
}
