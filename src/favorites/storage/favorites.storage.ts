import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';

import { FavoriteEntity } from '../entities/favorite.entity';
import { FavoritesRepsonse } from '../interfaces/favorite-responce.interface';
import { FavoritesStorage } from '../interfaces/favorite-storage.interface';

@Injectable()
export class InMemoryFavoritesStorage implements FavoritesStorage {
  private favorites = new FavoriteEntity();

  @Inject(forwardRef(() => TracksService))
  public tracksService: TracksService;
  @Inject(forwardRef(() => AlbumsService))
  public albumsService: AlbumsService;
  @Inject(forwardRef(() => ArtistsService))
  public artistsService: ArtistsService;

  findAll(): FavoritesRepsonse {
    const artists = this.artistsService.findAll();
    const albums = this.albumsService.findAll();
    const tracks = this.tracksService.findAll();

    return {
      artists: artists.filter((artist) =>
        this.favorites.artists.includes(artist.id),
      ),
      albums: albums.filter((album) =>
        this.favorites.albums.includes(album.id),
      ),
      tracks: tracks.filter((track) =>
        this.favorites.tracks.includes(track.id),
      ),
    };
  }

  insert(id: string, key: string) {
    this.favorites[key].push(id);
  }

  remove(id: string, key: string) {
    this.favorites[key] = this.favorites[key].filter(
      (itemId: string) => itemId !== id,
    );
  }
}
