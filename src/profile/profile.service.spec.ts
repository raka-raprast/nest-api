import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';

// Mock Profile model
const mockProfileModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
};

// Mock JwtService
const mockJwtService = {
  decode: jest.fn(),
};

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken('Profile'),
          useValue: mockProfileModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfile', () => {
    it('should throw UnauthorizedException if token is expired', async () => {
      mockJwtService.decode.mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 3600,
      }); // Token expired 1 hour ago

      await expect(
        service.createProfile(
          {
            imageUrl: '',
            userId: '',
            name: '',
            birthday: '',
            height: 0,
            weight: 0,
            interests: [],
          },
          'token',
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockJwtService.decode).toBeCalledWith('token');
    });

    // Add more test cases for createProfile method as needed
  });

  describe('updateProfile', () => {
    it('should throw UnauthorizedException if token is expired', async () => {
      mockJwtService.decode.mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 3600,
      }); // Token expired 1 hour ago

      await expect(
        service.updateProfile(
          {
            imageUrl: '',
            name: '',
            birthday: '',
            height: 0,
            weight: 0,
            interests: [''],
          },
          'token',
          '',
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockJwtService.decode).toBeCalledWith('token');
    });

    // Add more test cases for updateProfile method as needed
  });

  describe('getProfile', () => {
    it('should throw UnauthorizedException if token is expired', async () => {
      mockJwtService.decode.mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 3600,
      }); // Token expired 1 hour ago

      await expect(service.getProfile('token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.decode).toBeCalledWith('token');
    });

    // Add more test cases for getProfile method as needed
  });
});
