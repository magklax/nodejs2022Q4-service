import { ArtistEntity } from '../artists/entities/artist.entity';
import { AlbumEntity } from '../albums/entities/album.entity';
import { FavoriteEntity } from '../favorites/entities/favorite.entity';
import { TrackEntity } from '../tracks/entities/track.entity';
import { UserEntity } from '../users/entities/user.entity';

const entities = [
  UserEntity,
  AlbumEntity,
  ArtistEntity,
  TrackEntity,
  FavoriteEntity,
];

export { UserEntity, AlbumEntity, ArtistEntity, TrackEntity, FavoriteEntity };

export default entities;
