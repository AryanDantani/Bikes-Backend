import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get(':publicId')
  getImageUrl(@Param('publicId') publicId: string) {
    return this.cloudinaryService.getImageUrl(publicId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    const result = await this.cloudinaryService.uploadImage(file);
    return result;
    // console.log(result);
  }
}
