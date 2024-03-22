import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddRentalService, IDesiredStatus } from './add-rental.service';
import { CreateAddRentalDto } from './dto/create-add-rental.dto';

@Controller('add-rental')
export class AddRentalController {
  constructor(private readonly addRentalService: AddRentalService) {}

  @Get('user/:userId')
  @Header('Cache-Control', 'GET')
  findByUser(@Param('userId') userId: string) {
    return this.addRentalService.findByUser(userId);
  }

  @Get(':Id')
  @Header('Cache-Control', 'GET')
  findById(@Param('Id') Id: string) {
    return this.addRentalService.findById(Id);
  }

  @Post()
  async addBikeForRent(@Body() createAddRentalDto: CreateAddRentalDto) {
    await this.addRentalService.AddBikeForRent(createAddRentalDto);
  }

  @Put(':Id/:bikeId')
  async UpdateStatus(
    @Param('bikeId') bikeId: string,
    @Param('Id') Id: string,
    @Body() desiredStatus: IDesiredStatus,
  ) {
    // console.log(typeof desiredStatus);
    // console.log(desiredStatus, 'status');
    await this.addRentalService.UpdateStatus(Id, bikeId, desiredStatus);
  }

  @Delete(':Id/:bikeId')
  async deleteRentalData(
    @Param('Id') Id: string,
    @Param('bikeId') bikeId: string,
  ) {
    const result = await this.addRentalService.deleteRentalData(Id, bikeId);

    if (result.status) {
      return {
        message: result.message,
      };
    } else {
      return {
        error: result.message,
      };
    }
  }
}
