import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { CreateProfileDto } from 'src/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/dto/update-profile.dto';
import { ProfileService } from './profile.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeaders,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller()
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('api/getProfile')
  @ApiOkResponse({
    description: 'Profile has been found successfully',
  })
  @ApiTags('users')
  @ApiHeaders([{ name: 'x-access-token', description: 'Access Token' }])
  async getProfile(@Headers() header) {
    if (header['x-access-token'] == null) {
      return {
        auth: 'false',
        message: 'No token provided.',
        statusCode: HttpStatusCode.Unauthorized,
      };
    }
    return this.profileService.getProfile(header['x-access-token']);
  }

  @Post('api/createProfile')
  @ApiCreatedResponse({
    description: 'Profile has been created successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Session has expired please log in again',
  })
  @ApiTags('users')
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @Headers() header,
  ) {
    if (header['x-access-token'] == null) {
      return {
        auth: 'false',
        message: 'No token provided.',
        statusCode: HttpStatusCode.Unauthorized,
      };
    }
    return this.profileService.createProfile(
      { ...createProfileDto, userId: '' },
      header['x-access-token'],
    );
  }

  @Put('api/updateProfile')
  @ApiOkResponse({
    description: 'Profile has been updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Session has expired please log in again',
  })
  @ApiBadRequestResponse({
    description: 'No existing user',
  })
  @ApiTags('users')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Headers() header,
  ) {
    if (header['x-access-token'] == null) {
      return {
        auth: 'false',
        message: 'No token provided.',
        statusCode: HttpStatusCode.Unauthorized,
      };
    }
    return this.profileService.updateProfile(
      updateProfileDto,
      header['x-access-token'],
    );
  }
}
