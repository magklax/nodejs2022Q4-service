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
  async create() {
    const [favorites] = await this.favoriteRepository.find();

    if (!favorites) {
      return;
    }

    const favorite = this.favoriteRepository.create({
      albumsIds: [],
      artistsId: [],
      tracksIds: [],
    });

    await this.favoriteRepository.save(favorite);
  }

  async insertAlbum(id: string) {
    await this.albumRepository.findOneByOrFail({ id }).catch(() => {
      throw new UnprocessableEntityException();
    });

    const [favorites] = await this.favoriteRepository.find();

    favorites.albumsIds.push(id);

    await this.favoriteRepository.update(favorites.id, favorites);
  }

  async insertArtist(id: string) {
    await this.artistRepository.findOneByOrFail({ id }).catch(() => {
      throw new UnprocessableEntityException();
    });

    const [favorites] = await this.favoriteRepository.find();

    favorites.artistsId.push(id);

    await this.favoriteRepository.update(favorites.id, favorites);
  }

  async insertTrack(id: string) {
    await this.trackRepository.findOneByOrFail({ id }).catch(() => {
      throw new UnprocessableEntityException();
    });

    const [favorites] = await this.favoriteRepository.find();

    favorites.tracksIds.push(id);

    await this.favoriteRepository.update(favorites.id, favorites);
  }

  async removeAlbum(id: string) {
    const [favorites] = await this.favoriteRepository.find();

    const index = favorites.albumsIds.indexOf(id);

    if (index < 0) {
      throw new UnprocessableEntityException();
    }

    favorites.albumsIds.splice(index, 1);

    await this.favoriteRepository.update(favorites.id, favorites);
  }

  async removeArtist(id: string) {
    const [favorites] = await this.favoriteRepository.find();

    const index = favorites.artistsId.indexOf(id);

    if (index < 0) {
      throw new UnprocessableEntityException();
    }

    favorites.artistsId.splice(index, 1);

    await this.favoriteRepository.update(favorites.id, favorites);
  }

  async removeTrack(id: string) {
    const [favorites] = await this.favoriteRepository.find();

    const index = favorites.tracksIds.indexOf(id);

    if (index < 0) {
      throw new UnprocessableEntityException();
    }

    favorites.tracksIds.splice(index, 1);

    await this.favoriteRepository.update(favorites.id, favorites);
  }

  async findAll() {
    const [favorites] = await this.favoriteRepository.find();

    const albums = await this.albumRepository.findBy({
      id: In(favorites.albumsIds),
    });

    const artists = await this.artistRepository.findBy({
      id: In(favorites.artistsId),
    });

    const tracks = await this.trackRepository.findBy({
      id: In(favorites.tracksIds),
    });

    const res = new FavoritesRepsonse({
      tracks,
      albums,
      artists,
    });

    return res;
  }
}
