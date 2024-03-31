import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
export class LoginDto {
  @IsString()
  @ApiProperty({
    example: 'string@email.com',
  })
  readonly email: string;
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  readonly username: string;
  @ApiProperty({
    example: 'stri1234',
  })
  @IsString()
  @MinLength(8)
  readonly password: string;
}
