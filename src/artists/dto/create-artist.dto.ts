import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ example: 'Freddie Mercury' })
  @IsString({ message: 'Artist name must be a string' })
  name: string;

  @ApiProperty({ example: false })
  @IsBoolean({ message: 'Artist grammy must be a boolean' })
  grammy: boolean;
}
