import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DB } from '../../common/db.interface';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { AlbumEntity } from '../entities/album.entity';

@Injectable()
export class InMemoryAlbumsStorage
  implements DB<AlbumEntity, CreateAlbumDto, UpdateAlbumDto>
{
  public albums: AlbumEntity[] = [];

  create(dto: CreateAlbumDto) {
    const album = {
      ...dto,
      id: uuidv4(),
    };

    this.albums.push(album);

    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  update(id: string, dto: UpdateAlbumDto) {
    const index = this.albums.findIndex((album) => album.id === id);

    const album = {
      ...this.albums[index],
      ...dto,
    };

    this.albums[index] = album;

    return album;
  }

  remove(id: string) {
    this.albums = this.albums.filter((album) => album.id !== id);
  }

  resetArtistIds(artistId: string) {
    this.albums = this.albums.map((album) =>
      album.artistId === artistId ? { ...album, artistId: null } : album,
    );
  }
}
