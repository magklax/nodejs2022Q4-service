import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from '../typeorm';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  async create(dto: CreateAlbumDto) {
    const album = this.albumRepository.create(dto);

    await this.albumRepository.save(album);

    return album;
  }

  async findAll() {
    const albums = await this.albumRepository.find();

    return albums;
  }

  async findOne(id: string) {
    const album = await this.albumRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new NotFoundException(`Album with ID "${id}" not found`);
      });

    return album;
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const album = await this.albumRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new NotFoundException(`Album with ID "${id}" not found`);
      });

    const updatedAlbum = await this.albumRepository.save({ ...album, ...dto });

    return updatedAlbum;
  }

  async remove(id: string) {
    await this.albumRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    });

    return this.albumRepository.delete(id);
  }
}
