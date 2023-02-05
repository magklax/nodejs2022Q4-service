import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DB } from '../../common/db.interface';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { TrackEntity } from '../entities/track.entity';

@Injectable()
export class InMemoryTrackStorage
  implements DB<TrackEntity, CreateTrackDto, UpdateTrackDto>
{
  private tracks: TrackEntity[] = [];

  create(dto: CreateTrackDto) {
    const track = {
      ...dto,
      id: uuidv4(),
    };

    this.tracks.push(track);

    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  update(id: string, dto: UpdateTrackDto) {
    const index = this.tracks.findIndex((track) => track.id === id);

    const track = {
      ...dto,
      ...this.tracks[index],
    };

    this.tracks[index] = track;

    return track;
  }

  remove(id: string) {
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }

  resetArtistIds(artistId: string) {
    this.tracks = this.tracks.map((track) =>
      track.artistId === artistId ? { ...track, artistId: null } : track,
    );
  }

  resetAlbumIds(albumId: string) {
    this.tracks = this.tracks.map((track) =>
      track.albumId === albumId ? { ...track, albumId: null } : track,
    );
  }
}
