import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'P@ssword' })
  @IsString({ message: 'Old password must be a string' })
  oldPassword: string;

  @ApiProperty({ example: 'NewP@ssword' })
  @IsString({ message: 'New password must be a string' })
  newPassword: string;
}
