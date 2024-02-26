import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';

@Schema({
  timestamps: true,
})
export class OTP {
  @Prop()
  otp: number;

  @Prop({ type: String, ref: 'User' })
  email: string | User;
}

export type OtpDocument = OTP & Document;

export const OtpSchema = SchemaFactory.createForClass(OTP);

export const OTP_MODEL = OTP.name;
