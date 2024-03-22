import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Bike, USER_MODEL, UserDocument } from '../user/user.schema';
import { BIKE_MODEL } from '../bike/bike.schema';

export interface User extends UserDocument {
  _id: Types.ObjectId;
}

@Schema({
  timestamps: true,
})
export class AddRental {
  @Prop()
  userName: string;

  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  userId: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: BIKE_MODEL, required: true })
  bikeId: Types.ObjectId | Bike;

  @Prop()
  email: string;

  @Prop()
  contact: string;

  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop()
  owner: string;

  @Prop()
  rent: string;

  @Prop()
  mileage: string;

  @Prop()
  km: string;

  @Prop()
  engine: string;

  @Prop({ default: false })
  status: boolean;

  @Prop()
  date: string;

  @Prop()
  image: string;
}

export type AddRentalDocument = AddRental & Document;

export const schema = SchemaFactory.createForClass(AddRental);

export const AddRentalSchema = schema;

export const ADDRENTAL_MODEL = AddRental.name;
