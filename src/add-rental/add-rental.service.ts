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
      // Check if userId is defined and convert it to string
      const UserId = createAddRentalDto.userId?.toString();
      if (!UserId) {
        throw new Error('userId is undefined or not in the expected format');
      }

      // Construct new rental data object
      const newRentalData = {
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

      // Add bike data
      const BikeData = await this.bikeService.addBike(newRentalData);

      const bikeId = Object(BikeData.bikeData)._id.toString();

      console.log(bikeId);

      // Retrieve added bike data
      const bike = await this.bikeService.findOne(bikeId);

      // Create new rental data
      const RentalData = await this.addRentalModel.create({
        ...createAddRentalDto,
        userId: UserId,
        bikeId: bikeId,
      });

      // Retrieve category data based on rental type
      const CategoryType = RentalData.type;
      const CatData = await this.categoryService.findByType(CategoryType);

      const BikesData = bike.bikeData;

      // Add bike to category
      const categoryId = CatData[0]._id.toString();
      await this.categoryService.addBikeToCategory(categoryId, BikesData);
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
      const BikeData = await this.bikeService.findOne(bikeId);
      const CategoryData = await this.categoryService.findBikeUpdate(bikeId);

      if (!BikeData || !CategoryData || !RentedData) {
        return {
          status: false,
          message: 'Bike or Category Data Not found',
        };
      }

      // Update bike status based on RentedData.status
      const newStatus = RentedData.status ? 'Deactivate' : 'Active';
      Object(BikeData.bikeData).status === newStatus;
      Object(BikeData.bikeData).markModified('status');
      await Object(BikeData.bikeData).save();

      RentedData.status = desiredStatus.isActive;
      await RentedData.save();

      console.log(RentedData);

      return {
        status: true,
        message: `status updated to successfully`,
      };
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
      // Find the rental data by Id
      const rental = await this.addRentalModel.findById(Id);
      if (!rental) {
        return {
          status: false,
          message: 'Rental data not found',
        };
      }

      // Delete the bike associated with the rental
      await this.bikeService.deleteById(bikeId);

      // Delete the bike from its category
      await this.categoryService.deleteBike(bikeId);

      // Delete the rental data
      await this.addRentalModel.findByIdAndDelete(Id);

      return {
        status: true,
        message: 'Rental data deleted successfully',
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
