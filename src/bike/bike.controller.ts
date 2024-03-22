import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Delete(':id')
  async DeleteBike(@Param('id') id: string) {
    return this.bikeService.deleteById(id);
  }
}
