import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { REWARD_MODEL } from 'src/schemas/rewards/rewards.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Reward } from './entities/reward.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(REWARD_MODEL)
    private readonly rewardModel: Model<Reward>,
    private readonly usersService: UsersService,
  ) {}

  async createReward(createRewardDto: CreateRewardDto) {
    console.log(createRewardDto);
    return this.rewardModel.create(createRewardDto);
  }

  async findById(id: string) {
    const rewardData = await this.rewardModel.findById({ _id: id });
    if (!rewardData) {
      throw new NotFoundException('RewardCard not found for the user');
    }
    return rewardData;
  }

  async findRewardsByUserId(userId: string) {
    console.log(userId, 'service');
    try {
      const rewardData = await this.rewardModel.find({ user: userId });

      console.log(rewardData);

      if (!rewardData || rewardData.length === 0) {
        return {
          message: 'Not found any Reward card for this user',
        };
      }

      return rewardData;
    } catch (error) {
      console.error('Error finding rewards:', error);
      throw error;
    }
  }

  async DeleteReward(id: string, userId: string) {
    const reward = await this.rewardModel.findById(id);

    if (!reward) {
      return {
        message: 'Reward Card is not found',
      };
    }

    const user = await this.usersService.findOne(userId);

    const RewardData = reward as unknown as { reward: number };

    if (!user) {
      // Handle the case where the user is not found
      return {
        message: 'User data not found',
      };
    }

    user.coins += RewardData.reward;
    user.markModified('user');
    await user.save();

    await this.rewardModel.findByIdAndDelete(id);

    return {
      _id: id,
      message: 'Reward Card Is Claimed Successfully',
    };
  }
}
