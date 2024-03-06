import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class AddRental {
  @Prop()
  userName: string;

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

  @Prop()
  date: string;

  @Prop()
  image: string;
}

export type AddRentalDocument = AddRental & Document;

export const schema = SchemaFactory.createForClass(AddRental);

export const AddRentalSchema = schema;

export const ADDRENTAL_MODEL = AddRental.name;
