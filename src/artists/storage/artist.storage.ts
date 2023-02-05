import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DB } from '../../common/db.interface';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { ArtistEntity } from '../entities/artist.entity';

@Injectable()
export class InMemoryArtistStorage
  implements DB<ArtistEntity, CreateArtistDto, UpdateArtistDto>
{
  public artists: ArtistEntity[] = [];

  create(dto: CreateArtistDto) {
    const artist = {
      ...dto,
      id: uuidv4(),
    };

    this.artists.push(artist);

    return artist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    return this.artists.find((artist) => artist.id === id);
  }

  update(id: string, dto: UpdateArtistDto) {
    const index = this.artists.findIndex((artist) => artist.id === id);

    const artist = {
      ...this.artists[index],
      ...dto,
    };

    this.artists[index] = artist;

    return artist;
  }

  remove(id: string) {
    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}
