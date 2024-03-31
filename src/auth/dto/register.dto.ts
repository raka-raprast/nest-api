import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;
  @ApiProperty({
    example: 'string@email.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly email: string;
  @ApiProperty({
    example: 'stri1234',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
