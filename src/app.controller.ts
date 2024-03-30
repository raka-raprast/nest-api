import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile/profile.service';
import { HttpStatusCode } from 'axios';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  @Post('api/login')
  async login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('api/register')
  async register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }

  @Get('api/getProfile')
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
