import { Injectable } from '@nestjs/common';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InMemoryArtistStorage } from './storage/artist.storage';

@Injectable()
export class ArtistsService {
  constructor(private storage: InMemoryArtistStorage) {}

  create(dto: CreateArtistDto) {
    return this.storage.create(dto);
  }

  findAll() {
    return this.storage.findAll();
  }

  findOne(id: string) {
    return this.storage.findOne(id);
  }

  update(id: string, dto: UpdateArtistDto) {
    return this.storage.update(id, dto);
  }

  remove(id: string) {
    this.storage.remove(id);
  }
}
