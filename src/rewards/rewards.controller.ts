import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get(':userId')
  async findRewardsByUserId(@Param('userId') userId: string) {
    return await this.rewardsService.findRewardsByUserId(userId);
  }

  @Post()
  createReward(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.createReward(createRewardDto);
  }

  @Delete(':id/:userId')
  DeleteReward(@Param('id') id: string, @Param('userId') userId: string) {
    return this.rewardsService.DeleteReward(id, userId);
  }
}
