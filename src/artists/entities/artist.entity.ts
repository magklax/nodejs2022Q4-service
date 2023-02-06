import { ApiProperty } from '@nestjs/swagger';

export class ArtistEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Freddie Mercury' })
  name: string;

  @ApiProperty({ example: false })
  grammy: boolean;

  constructor(entity: ArtistEntity) {
    Object.assign(this, entity);
  }
}
