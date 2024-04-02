import {
  BadRequestException,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { IProfile } from 'src/interface/profile.interface';
export type Profile = any;
@Injectable()
export class ProfileService {
  constructor(
    @InjectModel('Profile') private profileModel: Model<IProfile>,
    private jwtService: JwtService,
  ) {}
  async isTokenExpired(expiryTime: number): Promise<boolean> {
    const currentTime: number = Math.floor(Date.now() / 1000);
    return currentTime > expiryTime;
  }
  async createProfile(
    createProfileDto: CreateProfileDto,
    token: string,
  ): Promise<any> {
    const user = await this.jwtService.decode(token);
    // const isExpired = await this.isTokenExpired(user.exp);
    // if (isExpired) {
    //   throw new UnauthorizedException(
    //     'Session has expired please log in again',
    //   );
    // }
    const existingProfile = await this.profileModel
      .findOne({
        $or: [{ userId: user.id }],
      })
      .exec();
    if (existingProfile) {
      return {
        message: 'Profile has been created successfully',
        data: {
          imageUrl: existingProfile.imageUrl,
          email: user.email,
          username: user.username,
          name: existingProfile.name,
          birthday: existingProfile.birthday,
          gender: existingProfile.gender,
          horoscope: existingProfile.horoscope,
          zodiac: existingProfile.zodiac,
          height: existingProfile.height,
          weight: existingProfile.weight,
          interests: existingProfile.interests,
        },
      };
    }
    const newProfile = await new this.profileModel({
      ...createProfileDto,
      userId: user.id,
    });
    await newProfile.save();
    return {
      message: 'Profile has been created successfully',
      data: {
        imageUrl: newProfile.imageUrl,
        email: user.email,
        username: user.username,
        name: newProfile.name,
        gender: newProfile.gender,
        birthday: newProfile.birthday,
        horoscope: newProfile.horoscope,
        zodiac: newProfile.zodiac,
        height: newProfile.height,
        weight: newProfile.weight,
        interests: newProfile.interests,
      },
    };
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    token: string,
    imgUrl: string,
  ): Promise<any> {
    const user = await this.jwtService.decode(token);
    // const isExpired = await this.isTokenExpired(user.exp);
    // if (isExpired) {
    //   throw new UnauthorizedException(
    //     'Session has expired please log in again',
    //   );
    // }
    const existingProfile = await this.profileModel
      .findOne({
        $or: [{ userId: user.id }],
      })
      .exec();
    if (existingProfile == null) {
      throw new BadRequestException('No existing user');
    }
    await existingProfile.updateOne({
      imageUrl:
        imgUrl == null || imgUrl == '' ? existingProfile.imageUrl : imgUrl,
      userId: existingProfile.userId,
      name: updateProfileDto.name ?? existingProfile.name,
      birthday: updateProfileDto.birthday ?? existingProfile.birthday,
      gender: updateProfileDto.gender ?? existingProfile.gender,
      horoscope: updateProfileDto.horoscope ?? existingProfile.horoscope,
      zodiac: updateProfileDto.zodiac ?? existingProfile.zodiac,
      height: updateProfileDto.height ?? existingProfile.height,
      weight: updateProfileDto.weight ?? existingProfile.weight,
      interests: updateProfileDto.interests ?? existingProfile.interests,
    });
    const refetchedProfile = await this.profileModel
      .findOne({
        $or: [{ userId: user.id }],
      })
      .exec();
    return {
      message: 'Profile has been updated successfully',
      data: {
        imageUrl: refetchedProfile.imageUrl,
        email: user.email,
        username: user.username,
        userId: refetchedProfile.userId,
        name: refetchedProfile.name,
        gender: refetchedProfile.gender,
        birthday: refetchedProfile.birthday,
        horoscope: refetchedProfile.horoscope,
        zodiac: refetchedProfile.zodiac,
        height: refetchedProfile.height,
        weight: refetchedProfile.weight,
        interests: refetchedProfile.interests,
      },
    };
  }

  async getProfile(token: string): Promise<any> {
    const user = await this.jwtService.decode(token);
    // const isExpired = await this.isTokenExpired(user.exp);
    // if (isExpired) {
    //   throw new UnauthorizedException(
    //     'Session has expired please log in again',
    //   );
    // }
    const existingProfile = await this.profileModel
      .findOne({
        $or: [{ userId: user.id }],
      })
      .exec();
    if (existingProfile == null) {
      throw new BadRequestException('No existing user');
    }
    return {
      message: 'Profile has been found successfully',
      data: {
        imageUrl: existingProfile.imageUrl,
        email: user.email,
        username: user.username,
        name: existingProfile.name,
        birthday: existingProfile.birthday,
        gender: existingProfile.gender,
        horoscope: existingProfile.horoscope,
        zodiac: existingProfile.zodiac,
        height: existingProfile.height,
        weight: existingProfile.weight,
        interests: existingProfile.interests,
      },
    };
  }
}
