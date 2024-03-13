import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Bikes {
  @Prop()
  date: string;

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
  userId: string;

  @Prop({ default: false })
  isRented: boolean;

  @Prop()
  mileage: string;

  @Prop()
  km: string;

  @Prop()
  status: string;

  @Prop({ type: Number })
  stock: number;
}

export type BikeDocument = Bikes & Document;

export const schema = SchemaFactory.createForClass(Bikes);

export const BikeSchema = schema;

export const BIKE_MODEL = Bikes.name;
