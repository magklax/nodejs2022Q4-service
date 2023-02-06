import { ApiProperty } from '@nestjs/swagger';

export class AlbumEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Innuendo' })
  name: string;

  @ApiProperty({ example: 1991 })
  year: number;

  @ApiProperty({ format: 'uuid', example: null })
  artistId: string | null;

  constructor(entity: AlbumEntity) {
    Object.assign(this, entity);
  }
}
