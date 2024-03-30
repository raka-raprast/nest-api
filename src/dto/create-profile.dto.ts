import { IsArray, IsNumber, IsString, Min } from 'class-validator';

export class CreateProfileDto {
  readonly userId: string;
  @IsString()
  readonly name: string;
  @IsString()
  readonly birthday: string;
  @IsNumber()
  @Min(0)
  readonly height: number;
  @IsNumber()
  @Min(0)
  readonly weight: number;
  @IsArray()
  @IsString({ each: true })
  readonly interests: string[];
}
