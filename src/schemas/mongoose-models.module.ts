import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from './user/user.schema';
import { RentalSchema, Rental_MODEL } from './rental/rental.schema';
import { CategorySchema, Category_MODEL } from './category/category.schema';
import { BIKE_MODEL, BikeSchema } from './bike/bike.schema';
import { OTP_MODEL, OtpSchema } from './Otp/oneTimepass.schema';
import { REWARD_MODEL, RewardSchema } from './rewards/rewards.schema';

const MODELS = [
  { name: USER_MODEL, schema: UserSchema },
  { name: Rental_MODEL, schema: RentalSchema },
  { name: Category_MODEL, schema: CategorySchema },
  { name: BIKE_MODEL, schema: BikeSchema },
  { name: OTP_MODEL, schema: OtpSchema },
  { name: REWARD_MODEL, schema: RewardSchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class MongooseModelsModule {}
