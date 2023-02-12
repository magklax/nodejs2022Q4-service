import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AlbumEntity, TrackEntity } from '../../typorm';

@Entity()
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
  albums: AlbumEntity[];

  @OneToMany(() => TrackEntity, (track) => track.artist)
  tracks: TrackEntity[];

  constructor(entity: ArtistEntity) {
    Object.assign(this, entity);
  }
}
