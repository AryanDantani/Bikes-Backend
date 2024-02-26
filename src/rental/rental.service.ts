import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RentalDocument, Rental_MODEL } from 'src/schemas/rental/rental.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { BikeService } from 'src/bike/bike.service';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel(Rental_MODEL)
    private readonly rentalModel: Model<RentalDocument>,
    private readonly usersSevice: UsersService,
    private readonly bikeService: BikeService,
  ) {}

  async findAll() {
    const RentalData = await this.rentalModel.find().populate('bike');
    if (!RentalData) {
      throw new NotFoundException('RentalData Not Found');
    }

    return RentalData;
  }

  async create(createRentalDto: CreateRentalDto) {
    const user = await this.usersSevice.findOne(createRentalDto.userId);
    const bike = await this.bikeService.findOne(createRentalDto.bikeId);
    console.log(user, bike, 'bile');
    if (!user) {
      throw new NotFoundException('User not found');
    } else if (!bike) {
      throw new NotFoundException('Bike not found');
    } else if (createRentalDto.age > 17) {
      console.log(createRentalDto);
      return this.rentalModel.create({
        ...createRentalDto,
        user: createRentalDto.userId,
        bike: createRentalDto.bikeId,
      });
    } else {
      return {
        message: '18 or 18+ age is required',
      };
    }
  }

  async findOne(userId: string) {
    const RentalData = await this.rentalModel
      .find({ user: userId })
      .populate('bike');
    console.log(RentalData);
    if (!RentalData || RentalData.length === 0) {
      throw new NotFoundException('RentalData not found for the user');
    }
    return RentalData;
  }

  async update(id: string, updateRentalDto: UpdateRentalDto) {
    const UpdateRentalData = await this.rentalModel.findByIdAndUpdate(
      id,
      updateRentalDto,
      {
        new: true,
      },
    );

    if (!UpdateRentalData) {
      return {
        message: 'Rental Data not found',
      };
    }

    return UpdateRentalData;
  }

  async Delete(id: string) {
    const deletedUser = await this.rentalModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return {
        message: 'Rental data is not found',
      };
    }

    return {
      _id: id,
      message: 'Rental data is Deleted successfully',
    };
  }
}
