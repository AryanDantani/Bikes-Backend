import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BIKE_MODEL, BikeDocument } from 'src/schemas/bike/bike.schema';
import { Bike, CreateBikeDto, EmptyBike } from './dto/create-bike.dto';

@Injectable()
export class BikeService {
  constructor(
    @InjectModel(BIKE_MODEL)
    private readonly bikeModel: Model<BikeDocument>,
  ) {}

  async findOne(id: string): Promise<Bike | EmptyBike> {
    try {
      const bikeData = await this.bikeModel.findById(id);
      if (!bikeData) {
        throw new NotFoundException('Bike Not found');
      }

      return {
        status: true,
        bikeData: bikeData,
        message: '',
      };
    } catch (error) {
      return {
        status: true,
        bikeData: {},
        message: error.message || 'Internal server error',
      };
    }
  }

  async addBike(createBikeDto: CreateBikeDto) {
    try {
      const bikeData = await this.bikeModel.create(createBikeDto);
      return {
        status: true,
        bikeData: bikeData,
        message: '',
      };
    } catch (error) {
      return {
        status: true,
        bikeData: {},
        message: error.message || 'Internal server error',
      };
    }
  }

  async deleteById(id: string) {
    try {
      const bikeData = await this.bikeModel.findByIdAndDelete(id);
      if (!bikeData) {
        throw new NotFoundException('Bike not found');
      }
      return {
        status: true,
        bikeData: bikeData,
        message: '',
      };
    } catch (error) {
      return {
        status: true,
        bikeData: {},
        message: error.message || 'Internal server error',
      };
    }
  }
}
