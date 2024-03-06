import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ADDRENTAL_MODEL,
  AddRentalDocument,
} from 'src/schemas/addRental/addRental.schema';
import { CreateAddRentalDto } from './dto/create-add-rental.dto';
import { CategoryService } from 'src/category/category.service';
import { BikeService } from 'src/bike/bike.service';
// import { UpdateAddRentalDto } from './dto/update-add-rental.dto';

@Injectable()
export class AddRentalService {
  constructor(
    @InjectModel(ADDRENTAL_MODEL)
    private readonly addRentalModel: Model<AddRentalDocument>,
    private readonly categoryService: CategoryService,
    private readonly bikeService: BikeService,
  ) {}

  async AddBikeForRent(createAddRentalDto: CreateAddRentalDto) {
    const RentalData = await this.addRentalModel.create(createAddRentalDto);

    const CategoryType = RentalData.type;
    const CatData = await this.categoryService.findByType(CategoryType);

    const newvbikeData = {
      name: RentalData.name,
      owner: RentalData.owner,
      engine: RentalData.engine,
      rent: RentalData.rent,
      mileage: RentalData.mileage,
      date: RentalData.date,
      image: RentalData.image,
      km: RentalData.km,
      stock: 1,
    };

    const BikeData = await this.bikeService.addBike(newvbikeData);
    const bikeId = BikeData._id.toString();
    const bike = await this.bikeService.findOne(bikeId);

    console.log(bike);

    const categoryId = CatData[0]._id.toString();
    await this.categoryService.addBikeToCategory(categoryId, bike);

    // console.log(addBikebikeData, 'val😍😍');
  }
}
