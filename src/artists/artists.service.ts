import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from '../typorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  async create(dto: CreateArtistDto) {
    const artist = this.artistRepository.create(dto);

    await this.artistRepository.save(artist);

    return artist;
  }

  async findAll() {
    const artists = await this.artistRepository.find();

    return artists;
  }

  async findOne(id: string) {
    const artist = await this.artistRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new NotFoundException(`Artist with ID "${id}" not found`);
      });

    return artist;
  }

  async update(id: string, dto: UpdateArtistDto) {
    const artist = await this.artistRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new NotFoundException(`Artist with ID "${id}" not found`);
      });

    await this.artistRepository.update(id, dto);

    const updatedArtist = new ArtistEntity({ ...artist, ...dto });

    return updatedArtist;
  }

  async remove(id: string) {
    await this.artistRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    });

    this.artistRepository.delete(id);
  }
}
