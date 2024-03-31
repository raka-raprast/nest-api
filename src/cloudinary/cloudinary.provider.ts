import { v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/auth/constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): void => {
    v2.config({
      cloud_name: 'dtb7tvlgu',
      api_key: '544718533339783',
      api_secret: 'mAhi4MaFs_S1O2xPFsWGtfvFOuI',
    });
  },
};
