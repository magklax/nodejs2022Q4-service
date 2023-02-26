import { AlbumEntity } from '../modules/albums/entities/album.entity';
import { ArtistEntity } from '../modules/artists/entities/artist.entity';
import { FavoriteEntity } from '../modules/favorites/entities/favorite.entity';
import { TrackEntity } from '../modules/tracks/entities/track.entity';
import { UserEntity } from '../modules/users/entities/user.entity';

const entities = [
  UserEntity,
  AlbumEntity,
  ArtistEntity,
  TrackEntity,
  FavoriteEntity,
];

export { UserEntity, AlbumEntity, ArtistEntity, TrackEntity, FavoriteEntity };

export default entities;
