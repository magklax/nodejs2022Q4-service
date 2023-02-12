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
  @ManyToMany(() => AlbumEntity, (akbum) => akbum.id, { onDelete: 'SET NULL' })
  @JoinTable()
  albums: string[];

  @ApiProperty()
  @ManyToMany(() => ArtistEntity, (artist) => artist.id, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  artists: string[];

  @ApiProperty()
  @ManyToMany(() => TrackEntity, (track) => track.id, { onDelete: 'SET NULL' })
  @JoinTable()
  tracks: string[];

  constructor(entity: Partial<FavoriteEntity>) {
    Object.assign(this, entity);
  }
}
