import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email-service/email-service.service';
import { OtpService } from 'src/otp/otp.service';
import { JwtService } from '@nestjs/jwt';
// import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [],
  controllers: [CloudinaryController],
  providers: [
    CloudinaryService,
    UsersService,
    EmailService,
    OtpService,
    JwtService,
  ],
})
export class CloudinaryModule {}
