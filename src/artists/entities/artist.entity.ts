import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AlbumEntity, TrackEntity } from '../../typeorm';

@Entity({ name: 'artists' })
export class ArtistEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Freddie Mercury' })
  @Column()
  name: string;

  @ApiProperty({ example: false })
  @Column()
  grammy: boolean;

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  @JoinColumn({ referencedColumnName: 'artistId' })
  albums: AlbumEntity[];

  @OneToMany(() => TrackEntity, (track) => track.artist)
  @JoinColumn({ referencedColumnName: 'artistId' })
  tracks: TrackEntity[];

  constructor(entity: ArtistEntity) {
    Object.assign(this, entity);
  }
}
