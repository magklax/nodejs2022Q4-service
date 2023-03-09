import { Injectable } from '@nestjs/common';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InMemoryTrackStorage } from './storage/tracks.storage';

@Injectable()
export class TracksService {
  constructor(private storage: InMemoryTrackStorage) {}

  create(dto: CreateTrackDto) {
    return this.storage.create(dto);
  }

  findAll() {
    return this.storage.findAll();
  }

  findOne(id: string) {
    return this.storage.findOne(id);
  }

  update(id: string, dto: UpdateTrackDto) {
    return this.storage.update(id, dto);
  }

  remove(id: string) {
    this.storage.remove(id);
  }

  resetArtistIds(artistId: string) {
    this.storage.resetArtistIds(artistId);
  }

  resetAlbumIds(albumId: string) {
    this.storage.resetAlbumIds(albumId);
  }
}
