import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  bookings: number;

  @Prop({ default: 0 })
  coins: number;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ required: true, default: 'Active' })
  status: string;
}

export type UserDocument = User & Document;

export const schema = SchemaFactory.createForClass(User);

export const UserSchema = schema;

export const USER_MODEL = User.name;
