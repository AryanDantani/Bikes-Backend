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

export interface IDesiredStatus {
  isActive: boolean;
}
@Injectable()
export class AddRentalService {
  constructor(
    @InjectModel(ADDRENTAL_MODEL)
    private readonly addRentalModel: Model<AddRentalDocument>,
    private readonly categoryService: CategoryService,
    private readonly bikeService: BikeService,
  ) {}

  async findById(Id: string) {
    try {
      const RentedData = await this.addRentalModel.findById(Id);

      if (!RentedData) {
        return {
          status: false,
          message: 'RentedData Is Not Found',
        };
      }

      return RentedData;
    } catch (error) {
      console.error('Error fetching RentedData:', error);
      return {
        status: false,
        message: 'Error fetching RentedData',
      };
    }
  }

  async findByUser(userId: string) {
    const RentalData = await this.addRentalModel.find({ userId: userId });

    if (!RentalData || RentalData.length === 0) {
      return {
        status: true,
        message: 'Not found',
      };
    }

    return RentalData;
  }

  async AddBikeForRent(createAddRentalDto: CreateAddRentalDto) {
    try {
      const UserId = createAddRentalDto.userId.toString();

      const newvbikeData = {
        name: createAddRentalDto.name,
        owner: createAddRentalDto.owner,
        engine: createAddRentalDto.engine,
        rent: createAddRentalDto.rent,
        mileage: createAddRentalDto.mileage,
        date: createAddRentalDto.date,
        image: createAddRentalDto.image,
        status: 'Deactivate',
        km: createAddRentalDto.km,
        userId: UserId,
        stock: 1,
      };

      const BikeData = await this.bikeService.addBike(newvbikeData);
      const bikeId = Object(BikeData)._id.toString();
      const bike = await this.bikeService.findOne(bikeId);

      const RentalData = await this.addRentalModel.create({
        ...createAddRentalDto,
        userId: createAddRentalDto.userId,
        bikeId: bikeId,
        status: 'Deactivate',
      });

      const CategoryType = RentalData.type;
      const CatData = await this.categoryService.findByType(CategoryType);

      const categoryId = CatData[0]._id.toString();
      await this.categoryService.addBikeToCategory(categoryId, bike);
    } catch (error) {
      console.error('Error occurred:', error);
      throw error;
    }
  }

  async UpdateStatus(
    Id: string,
    bikeId: string,
    desiredStatus: IDesiredStatus,
  ) {
    try {
      const RentedData = await this.addRentalModel.findById(Id);
      console.log(RentedData);

      const BikeData = await this.bikeService.findOne(bikeId);
      const CategoryData = await this.categoryService.findBikeUpdate(bikeId);

      // console.log(CategoryData);

      if (!BikeData || !CategoryData) {
        return {
          status: false,
          message: 'Bike or Category Data Not found',
        };
      }

      // console.log(desiredStatus.isActive);
      debugger;
      if (desiredStatus.isActive) {
        Object(BikeData).status = 'Deactivate';
        Object(BikeData).markModified('bike');
      } else {
        Object(BikeData).status = 'Active';
        Object(BikeData).markModified('bike');
      }
      await Object(BikeData).save();
    } catch (error) {
      return {
        status: false,
        message: 'An error occurred while updating status',
        error: error.message,
      };
    }
  }

  async deleteRentalData(Id: string, bikeId: string) {
    try {
      const rental = await this.addRentalModel.findById(Id);
      if (!rental) {
        return {
          status: false,
          message: 'RentalData not found',
        };
      }

      await this.bikeService.deleteById(bikeId);

      await this.categoryService.deleteBike(bikeId);

      await this.addRentalModel.findByIdAndDelete(Id);

      return {
        status: true,
        message: 'RentalData deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting rental data:', error);
      return {
        status: false,
        message: 'Error deleting rental data',
      };
    }
  }
}
