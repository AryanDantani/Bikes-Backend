import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CloudinaryService {
  constructor(private readonly usersService: UsersService) {
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
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async uploadProfile(imageData, userId) {
    const user = await this.usersService.findOne(userId);

    try {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ resource_type: 'image' }, async (error, result) => {
            if (error) {
              console.error('Error uploading image to Cloudinary:', error);
              reject(new Error('Failed to upload image to Cloudinary'));
            } else {
              console.log(result, 'result');

              if (user) {
                Object(user.user).image = result.url;
                Object(user.user).markModified('user');
                await Object(user.user).save();
              } else {
                return {
                  status: false,
                  message: 'User not found',
                };
              }
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
      return {
        status: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
