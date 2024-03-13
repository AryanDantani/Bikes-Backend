import { Module } from '@nestjs/common';
import { AddRentalService } from './add-rental.service';
import { AddRentalController } from './add-rental.controller';
import { CategoryService } from 'src/category/category.service';
import { BikeService } from 'src/bike/bike.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email-service/email-service.service';

@Module({
  controllers: [AddRentalController],
  providers: [
    AddRentalService,
    CategoryService,
    BikeService,
    JwtService,
    UsersService,
    OtpService,
    EmailService,
  ],
})
export class AddRentalModule {}
