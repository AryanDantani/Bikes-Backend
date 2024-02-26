import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BIKE_MODEL, BikeDocument } from 'src/schemas/bike/bike.schema';

@Injectable()
export class BikeService {
  constructor(
    @InjectModel(BIKE_MODEL)
    private readonly bikeModel: Model<BikeDocument>,
  ) {}

  async findOne(id: string) {
    // const bikeData = await this.bikeModel.findOne({ id: id });
    const bikeData = await this.bikeModel.findById(id);
    // console.log(id, 'bikeData', 'value');
    // console.log(bikeData, 'bikeData');
    if (!bikeData) {
      throw new NotFoundException('Job not found');
    }

    return 'bikeData';
  }
}
