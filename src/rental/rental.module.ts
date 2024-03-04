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
import { RewardsService } from 'src/rewards/rewards.service';
import { RewardsModule } from 'src/rewards/rewards.module';

@Module({
  imports: [UsersModule, BikeModule, RewardsModule],
  controllers: [RentalController],
  providers: [
    RentalService,
    BikeService,
    UsersService,
    JwtService,
    EmailService,
    OtpService,
    CategoryService,
    RewardsService,
  ],
  exports: [RentalModule],
})
export class RentalModule {}
