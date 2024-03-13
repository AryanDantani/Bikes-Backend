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
    return this.rewardModel.create(createRewardDto);
  }

  async findById(id: string) {
    try {
      const rewardData = await this.rewardModel.findById({ _id: id });
      if (!rewardData) {
        throw new NotFoundException('RewardCard not found for the user');
      }
      return {
        status: true,
        message: 'Get Reward by Id SuccessFully',
        rewardData,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async findRewardsByUserId(userId: string) {
    try {
      const rewardData = await this.rewardModel.find({ user: userId });

      if (!rewardData || rewardData.length === 0) {
        return {
          message: 'Not found any Reward card for this user',
        };
      }

      return {
        status: true,
        message: 'Reward Genrated Successfully',
        rewardData,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async DeleteReward(id: string, userId: string) {
    try {
      const reward = await this.rewardModel.findById(id);

      if (!reward) {
        return {
          message: 'Reward Card is not found',
        };
      }
      const user = await this.usersService.findOne(userId);
      if (!user) {
        return {
          message: 'User data not found',
        };
      }
      const RewardData = reward as unknown as { reward: number };
      Object(user.user).coins += RewardData.reward;
      Object(user.user).markModified('user');
      await Object(user.user).save();
      await this.rewardModel.findByIdAndDelete(id);
      return {
        _id: id,
        message: 'Reward Card Is Claimed Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
