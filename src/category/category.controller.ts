import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Header('Cache-Control', 'GET')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Header('Cache-Control', 'GETBYID')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get('bike/booked/:bikeId')
  async decrementStock(@Param('bikeId') bikeId: string) {
    try {
      await this.categoryService.decrementStock(bikeId);
      return { message: 'Stock decremented successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error('Failed to decrement stock');
      }
    }
  }

  @Get('bike/:bikeId')
  @Header('Cache-Control', 'GETBYID')
  async findBike(@Param('bikeId') bikeId: string) {
    try {
      return this.categoryService.findBike(bikeId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error('Failed to Find bike by id');
      }
    }
  }

  @Put('bikes/cancel/:bikeId')
  async incrementStock(@Param('bikeId') bikeId: string) {
    try {
      await this.categoryService.incrementStock(bikeId);
      return { message: 'Stock Incremented successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error('Failed to Increment stock');
      }
    }
  }
}
