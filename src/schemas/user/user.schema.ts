import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BIKE_MODEL, BikeDocument } from '../bike/bike.schema';
export interface Bike extends BikeDocument {
  _id: Types.ObjectId;
  stock: number; // Assuming 'stock' is stored as a number in the database
  // Define other properties here if necessary
}

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

  @Prop()
  image: string;

  @Prop({ type: [Types.ObjectId], ref: BIKE_MODEL, required: true })
  bikes: Bike[];

  @Prop({ required: true, default: 'Active' })
  status: string;
}

export type UserDocument = User & Document;

export const schema = SchemaFactory.createForClass(User);

export const UserSchema = schema;

export const USER_MODEL = User.name;
