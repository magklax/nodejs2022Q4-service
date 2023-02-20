import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  BeforeRemove,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AlbumEntity, FavoriteEntity, TrackEntity } from '../../typeorm';

@Entity({ name: 'artists' })
export class ArtistEntity extends BaseEntity {
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

  @ManyToMany(() => FavoriteEntity, (favorite) => favorite.artists, {
    cascade: true,
  })
  @JoinTable()
  favoriteArtists: ArtistEntity[];

  @BeforeRemove()
  async removeTrackFromFavorites() {
    const [favorites] = await FavoriteEntity.find();

    const index = favorites.artistsId.indexOf(this.id);

    if (index >= 0) {
      favorites.artistsId.splice(index, 1);
      await favorites.save();
    }
  }
}
