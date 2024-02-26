import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { OTP_MODEL, OtpDocument } from 'src/schemas/Otp/oneTimepass.schema';
// import { CreateOtpDto } from './dto/create-otp.dto';
// import { UpdateOtpDto } from './dto/update-otp.dto';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OTP_MODEL) private readonly otpModel: Model<OtpDocument>,
  ) {}

  async generateOtp(email: string): Promise<string> {
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create OTP document with expiration time
    const expirationTime = moment().add(15, 'minutes').toDate();
    const otpDoc = new this.otpModel({ otp, email, expiresAt: expirationTime });
    await otpDoc.save();

    // Schedule a task to remove the OTP after 15 minutes
    setTimeout(
      () => {
        this.remove(otpDoc._id.toString());
      },
      15 * 60 * 1000,
    );

    return otp;
  }

  async remove(otpId: string) {
    await this.otpModel.findByIdAndDelete(otpId).exec();
  }

  async verifyOtp(otp: number) {
    // Find the OTP document that matches the provided OTP
    const otpDoc = await this.otpModel.findOne({ otp }).exec();
    if (!otpDoc) {
      return false; // No matching OTP found
    }

    // If a matching OTP is found, delete the OTP document
    await this.otpModel.deleteOne({ _id: otpDoc._id }).exec();

    return true;
  }
}
