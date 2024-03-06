import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async getImageUrl(publicId: string) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    return {
      status: true,
      URL: `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`,
    };
  }

  // async uploadImage(imagePath: any) {
  //   console.log(imagePath, 'imagePath');
  //   try {
  //     const result = await cloudinary.v2.uploader.upload(imagePath);
  //     console.log(result, 'result');
  //     return {
  //       status: true,
  //       data: result.public_id,
  //     };
  //   } catch (error) {
  //     console.error('Error uploading image to Cloudinary:', error);
  //     throw new Error('Failed to upload image to Cloudinary');
  //   }
  // }

  async uploadImage(imageData) {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ resource_type: 'image' }, async (error, result) => {
            if (error) {
              console.error('Error uploading image to Cloudinary:', error);
              reject(new Error('Failed to upload image to Cloudinary'));
            } else {
              console.log(result, 'result');
              resolve({
                status: true,
                data: result.public_id,
                url: result.url,
              });
            }
          })
          .end(imageData.buffer);
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }
}
