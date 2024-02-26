import {
  Controller,
  Body,
  ValidationPipe,
  Header,
  Get,
  Param,
  Delete,
  Put,
  Post,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get()
  @Header('Cache-Control', 'GET')
  findAll() {
    return this.rentalService.findAll();
  }

  @Post()
  @Header('Cache-Control', 'POST')
  async create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.create(createRentalDto);
  }

  @Get(':userId')
  @Header('Cache-Control', 'GET')
  findOne(@Param('userId') userId: string) {
    return this.rentalService.findOne(userId);
  }

  @Put(':id')
  @Header('Cache-Control', 'UPDATE')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateRentalDto: UpdateRentalDto,
  ) {
    return this.rentalService.update(id, updateRentalDto);
  }

  @Delete(':id')
  @Header('Cache-Control', 'POST')
  Delete(@Param('id') id: string) {
    return this.rentalService.Delete(id);
  }
}
