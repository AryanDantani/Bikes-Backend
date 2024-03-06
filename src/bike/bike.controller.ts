import {
  Body,
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  Post,
  // Delete,
} from '@nestjs/common';
import { BikeService } from './bike.service';
import { CreateBikeDto } from './dto/create-bike.dto';

@Controller('bike')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bikeService.findOne(id);
  }

  @Post()
  async addBike(@Body() createBikeDto: CreateBikeDto) {
    return this.bikeService.addBike(createBikeDto);
  }
}
