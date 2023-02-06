import { ApiProperty } from '@nestjs/swagger';

export class TrackEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'The Show Must Go On' })
  name: string;

  @ApiProperty({ format: 'uuid', example: null })
  artistId: string | null;

  @ApiProperty({ format: 'uuid', example: null })
  albumId: string | null;

  @ApiProperty({ example: 262, description: 'In seconds' })
  duration: number;

  constructor(entity: TrackEntity) {
    Object.assign(this, entity);
  }
}
