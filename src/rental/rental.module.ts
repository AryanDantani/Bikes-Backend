import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { UsersModule } from 'src/users/users.module';
import { BikeModule } from 'src/bike/bike.module';
import { BikeService } from 'src/bike/bike.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email-service/email-service.service';
import { OtpService } from 'src/otp/otp.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [UsersModule, BikeModule],
  controllers: [RentalController],
  providers: [
    RentalService,
    BikeService,
    UsersService,
    JwtService,
    EmailService,
    OtpService,
    CategoryService,
  ],
})
export class RentalModule {}
