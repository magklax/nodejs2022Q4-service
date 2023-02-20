import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from '../typeorm';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
  ) {}

  async create(dto: CreateTrackDto) {
    const track = this.trackRepository.create(dto);

    await this.trackRepository.save(track);

    return track;
  }

  async findAll() {
    const tracks = await this.trackRepository.find();

    return tracks;
  }

  async findOne(id: string) {
    const track = await this.trackRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new NotFoundException(`Track with ID "${id}" not found`);
      });

    return track;
  }

  async update(id: string, dto: UpdateTrackDto) {
    const track = await this.trackRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new NotFoundException(`Track with ID "${id}" not found`);
      });

    await this.trackRepository.update(id, dto);

    const updatedTrack = await this.trackRepository.save({ ...track, ...dto });

    return updatedTrack;
  }

  async remove(id: string) {
    const track = await this.trackRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new NotFoundException(`Track with ID "${id}" not found`);
      });

    return this.trackRepository.remove(track);
  }
}
