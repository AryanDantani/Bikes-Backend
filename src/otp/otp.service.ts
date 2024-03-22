import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { OTP_MODEL, OtpDocument } from 'src/schemas/Otp/oneTimepass.schema';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OTP_MODEL) private readonly otpModel: Model<OtpDocument>,
  ) {}

  async generateOtp(email: string) {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      const expirationTime = moment().add(15, 'minutes').toDate();
      const otpDoc = new this.otpModel({
        otp,
        email,
        expiresAt: expirationTime,
      });
      await otpDoc.save();

      setTimeout(
        () => {
          this.remove(otpDoc._id.toString());
        },
        15 * 60 * 1000,
      );

      return otp;
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async remove(otpId: string) {
    try {
      return await this.otpModel.findByIdAndDelete(otpId).exec();
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async verifyOtp(otp: number) {
    try {
      const otpDoc = await this.otpModel.findOne({ otp }).exec();
      if (!otpDoc) {
        return {
          status: false,
          message: 'Otp is Not Found',
        };
      }

      await this.otpModel.deleteOne({ _id: otpDoc._id }).exec();

      return true;
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
