import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BIKE_MODEL, BikeDocument } from '../bike/bike.schema';
import { Types } from 'mongoose';
export interface Bike extends BikeDocument {
  _id: Types.ObjectId;
  // status: string;
  stock: number; // Assuming 'stock' is stored as a number in the database
  // Define other properties here if necessary
}

@Schema({
  timestamps: true,
})
export class Category {
  @Prop()
  title: string;

  @Prop()
  @Prop({ type: [Types.ObjectId], ref: BIKE_MODEL, required: true })
  bikes: Bike[];

  // @Prop({ type: [SchemaTypes.ObjectId], ref: BIKE_MODEL, required: true })
  // bikes: Bike[];

  @Prop()
  type: string;

  @Prop()
  image: string;
}

export type CategoryDocument = Category & Document;

// export interface ICategoryDocument extends Model<CategoryDocument> {
//   stock: number;
// }

export const CategorySchema = SchemaFactory.createForClass(Category);

export const Category_MODEL = Category.name;

// @Prop([{ type: { type: String }, ref: BIKE_MODEL }])
// bikes: { type: string, ref: Bike }[];
