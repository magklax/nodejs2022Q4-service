import { IsBoolean, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString({ message: 'Artist name must be a string' })
  name: string;

  @IsBoolean({ message: 'Artist grammy must be a boolean' })
  grammy: boolean;
}
