import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<any> {
    return v2.uploader.upload(file.path, {
      folder: 'profileImage',
    });
  }
}
