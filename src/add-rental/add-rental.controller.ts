import { Body, Controller, Post } from '@nestjs/common';
import { AddRentalService } from './add-rental.service';
import { CreateAddRentalDto } from './dto/create-add-rental.dto';

@Controller('add-rental')
export class AddRentalController {
  constructor(private readonly addRentalService: AddRentalService) {}

  @Post()
  async addBikeForRent(@Body() createAddRentalDto: CreateAddRentalDto) {
    await this.addRentalService.AddBikeForRent(createAddRentalDto);
  }
}
