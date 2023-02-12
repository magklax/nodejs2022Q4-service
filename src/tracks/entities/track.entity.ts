import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AlbumEntity, ArtistEntity } from '../../typorm';
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

  @ManyToOne(() => ArtistEntity, (artist) => artist.tracks, {
    onDelete: 'SET NULL',
  })
  artist: ArtistEntity[];

  @ManyToOne(() => AlbumEntity, (album) => album.tracks, {
    onDelete: 'SET NULL',
  })
  album: AlbumEntity[];

  constructor(entity: TrackEntity) {
    Object.assign(this, entity);
  }
}
