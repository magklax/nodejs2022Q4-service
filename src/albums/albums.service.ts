import { Injectable } from '@nestjs/common';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InMemoryAlbumsStorage } from './storage/albums.storage';

@Injectable()
export class AlbumsService {
  constructor(private storage: InMemoryAlbumsStorage) {}

  create(dto: CreateAlbumDto) {
    return this.storage.create(dto);
  }

  findAll() {
    return this.storage.findAll();
  }

  findOne(id: string) {
    return this.storage.findOne(id);
  }

  update(id: string, dto: UpdateAlbumDto) {
    return this.storage.update(id, dto);
  }

  remove(id: string) {
    this.storage.remove(id);
  }

  resetArtistIds(artistId: string) {
    this.storage.resetArtistIds(artistId);
  }
}
