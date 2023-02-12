import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ArtistEntity, TrackEntity } from '../../typorm';

@Entity()
export class AlbumEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Innuendo' })
  @Column()
  name: string;

  @ApiProperty({ example: 1991 })
  @Column()
  year: number;

  @ApiProperty({ format: 'uuid', example: null })
  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums, {
    onDelete: 'SET NULL',
  })
  artist: ArtistEntity;

  @OneToMany(() => TrackEntity, (album) => album.artist)
  tracks: TrackEntity[];

  constructor(entity: AlbumEntity) {
    Object.assign(this, entity);
  }
}
