import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProfileDto {
  readonly userId: string;
  @ApiProperty({
    example: 'John Doe',
  })
  readonly imageUrl: string;
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  readonly name: string;
  @ApiProperty({
    example: '01 01 2001',
  })
  @IsString()
  readonly birthday: string;
  @ApiProperty({
    example: 'Male',
  })
  @IsString()
  readonly gender: string;
  @ApiProperty({
    example: 'Aries',
  })
  @IsString()
  readonly horoscope: string;
  @ApiProperty({
    example: 'Boar',
  })
  @IsString()
  readonly zodiac: string;
  @ApiProperty({
    example: 185,
  })
  @IsNumber()
  @Min(0)
  readonly height: number;
  @ApiProperty({
    example: 75,
  })
  @IsNumber()
  @Min(0)
  readonly weight: number;
  @ApiProperty({
    example: ['string'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly interests: string[];
}
