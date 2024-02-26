import { Module } from '@nestjs/common';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';

@Module({
  controllers: [BikeController],
  providers: [BikeService],
  exports: [BikeService],
})
export class BikeModule {}
