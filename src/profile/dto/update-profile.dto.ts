import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'https://example.com/imageurl',
  })
  @ApiProperty({
    example: 'John Doe',
  })
  readonly name: string;
  @ApiProperty({
    example: '01 01 2001',
  })
  readonly birthday: string;
  @ApiProperty({
    example: 'Male',
  })
  readonly gender: string;
  @ApiProperty({
    example: 'Aries',
  })
  readonly horoscope: string;
  @ApiProperty({
    example: 'Boar',
  })
  readonly zodiac: string;
  @ApiProperty({
    example: 185,
  })
  readonly height: number;
  @ApiProperty({
    example: 75,
  })
  readonly weight: number;
  @ApiProperty({
    example: ['string'],
  })
  readonly interests: string[];
}
