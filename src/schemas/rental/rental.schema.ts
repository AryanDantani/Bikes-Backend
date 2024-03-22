import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USER_MODEL, User } from '../user/user.schema';
import { BIKE_MODEL, Bikes } from '../bike/bike.schema';

@Schema({
  timestamps: true,
})
export class Rental {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  user: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: BIKE_MODEL, required: true })
  bike: Types.ObjectId | Bikes;

  @Prop()
  city: string;

  @Prop({ default: false })
  isCancel: boolean;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isDay: boolean;

  @Prop()
  status: string;

  @Prop()
  phone: string;

  @Prop()
  startTime: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop()
  UID: string;

  @Prop()
  endTime: string;

  @Prop()
  licenceNumber: string;

  @Prop()
  idProof: string;
}

export type RentalDocument = Rental & Document;

export const RentalSchema = SchemaFactory.createForClass(Rental);

export const Rental_MODEL = Rental.name;
