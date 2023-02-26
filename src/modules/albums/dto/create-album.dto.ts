import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Innuendo' })
  @IsNotEmpty()
  @IsString({ message: 'Album name must be a string' })
  name: string;

  @ApiProperty({ example: 1991 })
  @IsInt({ message: 'Album year duration must be a number' })
  year: number;

  @ApiProperty({ format: 'uuid', example: null })
  @IsUUID(4, { message: 'Artist ID must be an uuid string or null' })
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null;
}
