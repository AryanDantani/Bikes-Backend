import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { UsersModule } from 'src/users/users.module';
import { BikeModule } from 'src/bike/bike.module';

@Module({
  imports: [UsersModule, BikeModule],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
