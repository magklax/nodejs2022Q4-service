import { ApiProperty } from '@nestjs/swagger';

import { AlbumEntity, ArtistEntity, TrackEntity } from '../../../typeorm';

export class FavoritesRepsonse {
  @ApiProperty({ type: ArtistEntity, isArray: true })
  artists: ArtistEntity[];

  @ApiProperty({ type: AlbumEntity, isArray: true })
  albums: AlbumEntity[];

  @ApiProperty({ type: TrackEntity, isArray: true })
  tracks: TrackEntity[];

  constructor(entity: FavoritesRepsonse) {
    Object.assign(this, entity);
  }
}
