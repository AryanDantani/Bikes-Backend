import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email-service/email-service.service';
import { OtpService } from 'src/otp/otp.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [RewardsController],
  providers: [
    RewardsService,
    UsersService,
    EmailService,
    OtpService,
    JwtService,
  ],
})
export class RewardsModule {}
