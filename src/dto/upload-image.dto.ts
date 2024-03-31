import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
  @IsNotEmpty()
  readonly userId: string;
  @IsNotEmpty()
  @IsString()
  readonly image: string;
}
