import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { EmailService } from 'src/email-service/email-service.service';
import { OtpService } from 'src/otp/otp.service';
// import { EmailService } from 'src/EmailService/email.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<number | string>('JWT_EXPIRE'),
          },
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService, OtpService],
  exports: [UsersService],
})
export class UsersModule {}
