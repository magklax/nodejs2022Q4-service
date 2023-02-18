import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AlbumEntity, ArtistEntity } from '../../typeorm';
@Entity()
export class TrackEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'The Show Must Go On' })
  @Column()
  name: string;

  @ApiProperty({ format: 'uuid', example: null })
  @Column({ nullable: true })
  artistId: string | null;

  @ApiProperty({ format: 'uuid', example: null })
  @Column({ nullable: true })
  albumId: string | null;

  @ApiProperty({ example: 262, description: 'In seconds' })
  @Column()
  duration: number;

  @ManyToOne(() => ArtistEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artist: ArtistEntity;

  @ManyToOne(() => AlbumEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'albumId', referencedColumnName: 'id' })
  album: AlbumEntity;

  constructor(entity: TrackEntity) {
    Object.assign(this, entity);
  }
}
