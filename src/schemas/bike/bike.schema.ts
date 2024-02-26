import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
// import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Bikes {
  // @Prop({ type: Types.ObjectId })
  // _id: Types.ObjectId;
  // id: Types.ObjectId;

  @Prop()
  available: string;

  @Prop()
  engine: string;

  @Prop()
  image: string;

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

  @Prop({ type: Number })
  stock: number;
}

export type BikeDocument = Bikes & Document;

export const schema = SchemaFactory.createForClass(Bikes);

export const BikeSchema = schema;

export const BIKE_MODEL = Bikes.name;
