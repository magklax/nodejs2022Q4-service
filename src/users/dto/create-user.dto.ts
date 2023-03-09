import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString({ message: 'Login must be a string' })
  login: string;

  @ApiProperty({ example: 'P@ssword' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
