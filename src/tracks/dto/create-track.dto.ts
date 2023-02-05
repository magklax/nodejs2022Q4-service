import { IsInt, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsString({ message: 'Track name must be a string' })
  name: string;

  @IsUUID(4, { message: 'Artist ID must be an uuid string or null' })
  @ValidateIf((_object, value) => value !== null)
  artistId: string;

  @IsUUID(4, { message: 'Album ID must be an uuid string or null' })
  @ValidateIf((_object, value) => value !== null)
  albumId: string;

  @IsInt({ message: 'Track duration must be a number' })
  duration: number;
}
