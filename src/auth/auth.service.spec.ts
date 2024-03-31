import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Mock User model
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

// Mock JwtService
const mockJwtService = {
  sign: jest.fn(() => 'fakeToken'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken('User'), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      mockUserModel.findOne.mockReturnValue(null);
      mockUserModel.create.mockResolvedValue({
        ...createUserDto,
        password: hashedPassword,
      });

      const result = await service.register(createUserDto);

      expect(result).toEqual({ message: 'User has been created successfully' });
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: RegisterDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password',
      };

      mockUserModel.findOne.mockReturnValue({});

      await expect(service.register(createUserDto)).rejects.toThrowError(
        ConflictException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should log in an existing user with correct credentials', async () => {
      const loginUserDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
        username: '',
      };

      // Mock user data
      const existingUser = {
        _id: 'userId',
        username: 'testuser',
        email: loginUserDto.email,
        password: await bcrypt.hash(loginUserDto.password, 10),
      };

      // Mock findOne method to return existing user
      mockUserModel.findOne.mockResolvedValue(existingUser);

      // Call the login method
      const result = await service.login(loginUserDto);

      // Assert the result
      expect(result.message).toEqual('User has been logged in');
      expect(result.access_token).toEqual('fakeToken');
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginUserDto.email,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginUserDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password',
        username: '',
      };

      mockUserModel.findOne.mockReturnValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginUserDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
        username: '',
      };

      const existingUser = {
        _id: 'userId',
        username: 'testuser',
        email: loginUserDto.email,
        password: 'correctpassword',
      };

      mockUserModel.findOne.mockReturnValue(existingUser);

      await expect(service.login(loginUserDto)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
