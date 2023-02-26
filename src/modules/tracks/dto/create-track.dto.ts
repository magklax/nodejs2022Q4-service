import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ example: 'The Show Must Go On' })
  @IsNotEmpty()
  @IsString({ message: 'Track name must be a string' })
  name: string;

  @ApiProperty({ format: 'uuid', example: null })
  @IsUUID(4, { message: 'Artist ID must be an uuid string or null' })
  @ValidateIf((_object, value) => value !== null)
  artistId: string;

  @ApiProperty({ format: 'uuid', example: null })
  @IsUUID(4, { message: 'Album ID must be an uuid string or null' })
  @ValidateIf((_object, value) => value !== null)
  albumId: string;

  @ApiProperty({ example: 262, description: 'In seconds' })
  @IsInt({ message: 'Track duration must be a number' })
  duration: number;
}
