import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import {
  AlbumEntity,
  ArtistEntity,
  FavoriteEntity,
  TrackEntity,
} from '../typeorm';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [
    TypeOrmModule.forFeature([
      FavoriteEntity,
      AlbumEntity,
      ArtistEntity,
      TrackEntity,
    ]),
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
