import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  AlbumEntity,
  ArtistEntity,
  FavoriteEntity,
  TrackEntity,
} from '../typeorm';
import { FavoritesRepsonse } from './interfaces/favorite-responce.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private favoriteRepository: Repository<FavoriteEntity>,
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
  ) {}
  async insertAlbum(id: string) {
    await this.albumRepository.findOneByOrFail({ id }).catch(() => {
      throw new UnprocessableEntityException();
    });

    const [favorite] = await this.favoriteRepository.find();

    favorite.albumsIds.push(id);

    await this.favoriteRepository.update(favorite.id, favorite);
  }

  async insertArtist(id: string) {
    await this.artistRepository.findOneByOrFail({ id }).catch(() => {
      throw new UnprocessableEntityException();
    });

    const [favorite] = await this.favoriteRepository.find();

    favorite.artistsId.push(id);

    await this.favoriteRepository.update(favorite.id, favorite);
  }

  async insertTrack(id: string) {
    await this.trackRepository.findOneByOrFail({ id }).catch(() => {
      throw new UnprocessableEntityException();
    });

    const [favorite] = await this.favoriteRepository.find();

    favorite.tracksIds.push(id);

    await this.favoriteRepository.update(favorite.id, favorite);
  }

  async removeAlbum(id: string) {
    const [favorite] = await this.favoriteRepository.find();

    const index = favorite.albumsIds.indexOf(id);

    if (index < 0) {
      throw new UnprocessableEntityException();
    }

    favorite.albumsIds.splice(index, 1);

    await this.favoriteRepository.update(favorite.id, favorite);
  }

  async removeArtist(id: string) {
    const [favorite] = await this.favoriteRepository.find();

    const index = favorite.artistsId.indexOf(id);

    if (index < 0) {
      throw new UnprocessableEntityException();
    }

    favorite.artistsId.splice(index, 1);

    await this.favoriteRepository.update(favorite.id, favorite);
  }

  async removeTrack(id: string) {
    const [favorite] = await this.favoriteRepository.find();

    const index = favorite.tracksIds.indexOf(id);

    if (index < 0) {
      throw new UnprocessableEntityException();
    }

    favorite.tracksIds.splice(index, 1);

    await this.favoriteRepository.update(favorite.id, favorite);
  }

  async findAll() {
    const [favorite] = await this.favoriteRepository.find();

    const albums = await this.albumRepository.findBy({
      id: In(favorite.albumsIds),
    });

    const artists = await this.artistRepository.findBy({
      id: In(favorite.artistsId),
    });

    const tracks = await this.trackRepository.findBy({
      id: In(favorite.tracksIds),
    });

    const res = new FavoritesRepsonse({
      tracks,
      albums,
      artists,
    });

    return res;
  }
}
