import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('verify')
  async verifyOtp(@Body('otp') otp: number) {
    const isOtpValid = await this.otpService.verifyOtp(otp);
    if (!isOtpValid) {
      return {
        message: 'Invalid OTP',
      };
    }
    return { message: 'OTP is valid' };
  }

  @Delete(':id')
  async removeOtp(@Param('id') otpId: string) {
    const isRemoved = await this.otpService.remove(otpId);
    console.log(isRemoved);
  }
}
