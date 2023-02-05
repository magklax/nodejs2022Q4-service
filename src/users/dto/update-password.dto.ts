import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Old password must be a string' })
  oldPassword: string;

  @IsString({ message: 'New password must be a string' })
  newPassword: string;
}
