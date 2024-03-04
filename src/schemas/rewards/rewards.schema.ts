import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL, User } from '../user/user.schema';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Rewards {
  @Prop({ type: Types.ObjectId, ref: USER_MODEL, required: true })
  user: Types.ObjectId | User;

  @Prop()
  reward: number;

  @Prop()
  expiredDate: Date;
}

export interface Reward extends Document {
  reward: number;
  expiredDate: Date;
}

export type RewardsDocument = Rewards & Document;

export const RewardSchema = SchemaFactory.createForClass(Rewards);

export const REWARD_MODEL = Rewards.name;
