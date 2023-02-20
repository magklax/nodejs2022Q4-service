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
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ArtistEntity, FavoriteEntity, TrackEntity } from '../../typeorm';

@Entity('albums')
export class AlbumEntity extends BaseEntity {
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

  @ManyToMany(() => FavoriteEntity, (favorite) => favorite.albums, {
    cascade: true,
  })
  @JoinTable()
  favoriteAlbums: AlbumEntity[];

  @BeforeRemove()
  async removeTrackFromFavorites() {
    const [favorites] = await FavoriteEntity.find();

    const index = favorites.albumsIds.indexOf(this.id);

    if (index >= 0) {
      favorites.albumsIds.splice(index, 1);
      await favorites.save();
    }
  }
}
