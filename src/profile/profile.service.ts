import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatusCode } from 'axios';
import { Model } from 'mongoose';
import { CreateProfileDto } from 'src/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/dto/update-profile.dto';
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
    if (this.isTokenExpired(user.exp)) {
      return {
        message: 'Session has expired please log in again',
        statusCode: HttpStatusCode.Unauthorized,
      };
    }
    const existingProfile = await this.profileModel
      .findOne({
        $or: [{ userId: user.id }],
      })
      .exec();
    if (existingProfile) {
      return {
        message: 'Profile has been created successfully',
        data: existingProfile,
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
        email: user.email,
        username: user.username,
        name: newProfile.name,
        birthday: newProfile.birthday,
        height: newProfile.height,
        weight: newProfile.weight,
        interests: newProfile.interests,
      },
    };
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    token: string,
  ): Promise<any> {
    const user = await this.jwtService.decode(token);
    if (this.isTokenExpired(user.exp)) {
      return {
        message: 'Session has expired please log in again',
        statusCode: HttpStatusCode.Unauthorized,
      };
    }
    const existingProfile = await this.profileModel
      .findOne({
        $or: [{ userId: user.id }],
      })
      .exec();
    if (existingProfile == null) {
      return {
        message: 'No existing user',
        status: 'Bad Request',
        statusCode: HttpStatusCode.BadRequest,
      };
    }
    await existingProfile.updateOne({
      userId: existingProfile.userId,
      name: updateProfileDto.name ?? existingProfile.name,
      birthday: updateProfileDto.birthday ?? existingProfile.birthday,
      height: updateProfileDto.height ?? existingProfile.height,
      weight: updateProfileDto.weight ?? existingProfile.weight,
      interests: updateProfileDto.interests ?? existingProfile.interests,
    });
    return {
      message: 'Profile has been updated successfully',
      data: {
        email: user.email,
        username: user.username,
        userId: existingProfile.userId,
        name: updateProfileDto.name ?? existingProfile.name,
        birthday: updateProfileDto.birthday ?? existingProfile.birthday,
        height: updateProfileDto.height ?? existingProfile.height,
        weight: updateProfileDto.weight ?? existingProfile.weight,
        interests: updateProfileDto.interests ?? existingProfile.interests,
      },
    };
  }

  async getProfile(token: string): Promise<any> {
    const user = await this.jwtService.decode(token);
    if (this.isTokenExpired(user.exp)) {
      return {
        message: 'Session has expired please log in again',
        statusCode: HttpStatusCode.Unauthorized,
      };
    }
    const existingProfile = await this.profileModel
      .findOne({
        $or: [{ userId: user.id }],
      })
      .exec();
    if (existingProfile == null) {
      return {
        message: 'No existing user',
        status: 'Bad Request',
        statusCode: HttpStatusCode.BadRequest,
      };
    }
    return {
      message: 'Profile has been found successfully',
      data: {
        email: user.email,
        username: user.username,
        name: existingProfile.name,
        birthday: existingProfile.birthday,
        height: existingProfile.height,
        weight: existingProfile.weight,
        interests: existingProfile.interests,
      },
    };
  }
}
