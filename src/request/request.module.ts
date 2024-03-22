import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email-service/email-service.service';
import { OtpService } from 'src/otp/otp.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RequestController],
  providers: [
    RequestService,
    UsersService,
    EmailService,
    OtpService,
    JwtService,
  ],
  exports: [RequestService],
})
export class RequestModule {}
