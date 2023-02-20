import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  BeforeRemove,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AlbumEntity, ArtistEntity, FavoriteEntity } from '../../typeorm';
@Entity({ name: 'tracks' })
export class TrackEntity extends BaseEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'The Show Must Go On' })
  @Column()
  name: string;

  @ApiProperty({ format: 'uuid', example: null })
  @Column({ nullable: true, default: null })
  artistId: string | null;

  @ApiProperty({ format: 'uuid', example: null })
  @Column({ nullable: true, default: null })
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

  @ManyToMany(() => FavoriteEntity, (favorite) => favorite.tracks, {
    cascade: true,
  })
  @JoinTable()
  favoriteTracks: TrackEntity[];

  @BeforeRemove()
  async removeTrackFromFavorites() {
    const [favorites] = await FavoriteEntity.find();

    const index = favorites.tracksIds.indexOf(this.id);

    if (index >= 0) {
      favorites.tracksIds.splice(index, 1);
      await favorites.save();
    }
  }
}
