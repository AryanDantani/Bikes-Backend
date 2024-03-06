import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
// import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
})
export class CloudinaryModule {}
