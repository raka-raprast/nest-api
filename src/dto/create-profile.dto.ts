import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, Min } from 'class-validator';

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
  @IsArray()
  @IsString({ each: true })
  readonly interests: string[];
}
