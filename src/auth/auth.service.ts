import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from 'src/dto/login.dto';
import { IUser } from 'src/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
export type User = any;
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}
  async login(loginUserDto: LoginDto) {
    const { email, username, password } = loginUserDto;
    const existingUser = await this.userModel
      .findOne({
        $or: [{ email: email }, { username: username }],
      })
      .exec();
    if (existingUser == null) {
      throw new UnauthorizedException('Username, email or password is invalid');
    }
    // Check if the provided password matches the stored hash
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username, email or password is invalid');
    }

    // Generate JWT token
    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    };

    return {
      message: 'User has been logged in successfully',
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: RegisterDto): Promise<any> {
    const { username, email, password } = createUserDto;

    // Check if the username or email already exists
    const existingUser = await this.userModel
      .findOne({ $or: [{ username }, { email }] })
      .exec();
    if (existingUser) {
      return {
        message: 'User already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user with MongoDB-generated userId
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const user = await newUser.save();
    if (user) {
      return {
        message: 'User has been created successfully',
      };
    } else {
      throw new ConflictException('Registration failed');
    }
  }
}
