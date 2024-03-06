import { Module } from '@nestjs/common';
import { AddRentalService } from './add-rental.service';
import { AddRentalController } from './add-rental.controller';
import { CategoryService } from 'src/category/category.service';
import { BikeService } from 'src/bike/bike.service';

@Module({
  controllers: [AddRentalController],
  providers: [AddRentalService, CategoryService, BikeService],
})
export class AddRentalModule {}
