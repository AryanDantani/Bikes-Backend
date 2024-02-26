import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  // Delete,
} from '@nestjs/common';
import { BikeService } from './bike.service';

@Controller('bike')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bikeService.findOne(id);
  }
}
