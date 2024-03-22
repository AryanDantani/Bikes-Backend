import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import {
  REQUEST_MODEL,
  RequestDocument,
} from 'src/schemas/request/request.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(REQUEST_MODEL)
    private readonly requestModel: Model<RequestDocument>,
    private readonly userservice: UsersService,
  ) {}

  async findAll() {
    try {
      const RequestData = await this.requestModel.find();

      if (!RequestData) {
        throw new NotFoundException('Request Not Found');
      }

      return {
        status: true,
        message: 'Get All Requests SuccessFully',
        RequestData,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async create(createRequestDto: CreateRequestDto) {
    try {
      const UserId = createRequestDto.userId?.toString();
      if (!UserId) {
        throw new Error('userId is undefined or not in the expected format');
      }

      const RequestData = await this.requestModel.create({
        ...createRequestDto,
        userId: UserId,
        status: 'Pandding',
      });

      if (!RequestData) {
        return {
          status: false,
          message: 'Bike or Category Data Not found',
        };
      }

      return {
        status: true,
        message: 'Request Send successfully',
        RequestData,
      };
    } catch (error) {
      console.error('Error occurred:', error);
      throw error;
    }
  }

  async delete(Id: string) {
    try {
      const RentedData = await this.requestModel.findById(Id);
      RentedData.status = 'Approved';
      RentedData.markModified('status');
      await RentedData.save();

      const userId = RentedData.userId.toString();
      const UserData = await this.userservice.findOne(userId);
      Object(UserData.user).role = 'owner';
      Object(UserData.user).markModified('user');
      await Object(UserData.user).save();

      if (!UserData) {
        return {
          status: false,
          message: 'User Data Not found',
        };
      }

      return {
        status: true,
        message: 'Request Updated Successfully',
      };
    } catch (error) {
      console.error('Error occurred:', error);
      throw error;
    }
  }
}
