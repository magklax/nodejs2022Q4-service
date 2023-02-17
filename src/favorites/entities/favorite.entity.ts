import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AlbumEntity, ArtistEntity, TrackEntity } from '../../typorm';

@Entity()
export class FavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', { array: true })
  albumsIds: string[];

  @ApiProperty()
  @Column('text', { array: true })
  artistsId: string[];

  @ApiProperty()
  @Column('text', { array: true })
  tracksIds: string[];

  @ApiProperty()
  @ManyToMany(() => AlbumEntity, (album) => album.id, { onDelete: 'SET NULL' })
  @JoinTable({ inverseJoinColumn: { name: 'albumId' } })
  albums: AlbumEntity[];

  @ApiProperty()
  @ManyToMany(() => ArtistEntity, (artist) => artist.id, {
    onDelete: 'SET NULL',
  })
  @JoinTable({ inverseJoinColumn: { name: 'artistId' } })
  artists: ArtistEntity[];

  @ApiProperty()
  @ManyToMany(() => TrackEntity, (track) => track.id, { onDelete: 'SET NULL' })
  @JoinTable({ inverseJoinColumn: { name: 'trackId' } })
  tracks: TrackEntity[];

  constructor(entity: Partial<FavoriteEntity>) {
    Object.assign(this, entity);
  }
}
