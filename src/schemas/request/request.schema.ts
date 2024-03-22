import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User, USER_MODEL } from '../user/user.schema';

@Schema({
  timestamps: true,
})
export class Request {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  userId: Types.ObjectId | User;

  @Prop()
  email: string;

  @Prop()
  status: string;

  @Prop()
  description: string;
}

export type RequestDocument = Request & Document;

export const schema = SchemaFactory.createForClass(Request);

export const RequestSchema = schema;

export const REQUEST_MODEL = Request.name;
