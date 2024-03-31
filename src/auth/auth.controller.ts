import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('api/login')
  @ApiOkResponse({
    description: 'User has been logged in successfully',
  })
  @ApiTags('auth')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('api/register')
  @ApiCreatedResponse({
    description: 'User has been created successfully',
  })
  @ApiTags('auth')
  async register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }
}
