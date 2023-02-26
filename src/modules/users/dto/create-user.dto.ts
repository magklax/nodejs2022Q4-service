import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString({ message: 'Login must be a string' })
  login: string;

  @ApiProperty({ example: 'P@ssword' })
  @IsNotEmpty()
  @MinLength(8)
  @IsString({ message: 'Password must be a string' })
  password: string;
}
