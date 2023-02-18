import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ArtistEntity, TrackEntity } from '../../typeorm';

@Entity({ name: 'albums' })
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
  @Column({ nullable: true, default: null })
  artistId: string | null;

  @ManyToOne(() => ArtistEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artist: ArtistEntity;

  @OneToMany(() => TrackEntity, (album) => album.artist)
  @JoinColumn({ referencedColumnName: 'albumId' })
  tracks: TrackEntity[];

  constructor(entity: AlbumEntity) {
    Object.assign(this, entity);
  }
}
