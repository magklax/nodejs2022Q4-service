import { ApiProperty } from '@nestjs/swagger';
import { AlbumEntity } from '../../albums/entities/album.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { TrackEntity } from '../../tracks/entities/track.entity';

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
