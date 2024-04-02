import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'src/auth/constants';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ProfileSchema } from 'src/schemas/profile.schema';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    CacheModule.register(),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, JwtStrategy, CloudinaryService],
  exports: [ProfileService],
})
export class ProfileModule {}
