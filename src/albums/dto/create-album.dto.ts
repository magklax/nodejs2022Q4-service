import { IsInt, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @IsString({ message: 'Album name must be a string' })
  name: string;

  @IsInt({ message: 'Album year duration must be a number' })
  year: number;

  @IsUUID(4, { message: 'Artist ID must be an uuid string or null' })
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null;
}
