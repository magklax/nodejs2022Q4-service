import { ApiProperty } from '@nestjs/swagger';
import { AlbumEntity, ArtistEntity, TrackEntity } from '../../../typeorm';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favorites')
export class FavoriteEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', { array: true, default: [] })
  albumsIds: string[];

  @ApiProperty()
  @Column('text', { array: true, default: [] })
  artistsId: string[];

  @ApiProperty()
  @Column('text', { array: true, default: [] })
  tracksIds: string[];

  @ManyToMany(() => AlbumEntity, (album) => album.favoriteAlbums)
  @JoinTable()
  albums: AlbumEntity[];

  @ManyToMany(() => ArtistEntity, (artist) => artist.favoriteArtists)
  @JoinTable()
  artists: ArtistEntity[];

  @ManyToMany(() => TrackEntity, (track) => track.favoriteTracks)
  @JoinTable()
  tracks: TrackEntity[];
}
