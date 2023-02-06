import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';

import { TracksService } from './tracks.service';

@ApiTags('Tracks')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Inject(ArtistsService)
  private readonly artistsService: ArtistsService;
  @Inject(AlbumsService)
  private readonly albumsService: AlbumsService;
  @Inject(FavoritesService)
  private readonly favoritesService: FavoritesService;

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  create(@Body() createTrackDto: CreateTrackDto) {
    const { artistId, albumId } = createTrackDto;

    if (artistId) {
      const artist = this.artistsService.findOne(artistId);

      if (!artist) {
        throw new NotFoundException(`Artist with ID "${artistId}" not found`);
      }
    }

    if (albumId) {
      const album = this.albumsService.findOne(albumId);

      if (!album) {
        throw new NotFoundException(`Album with ID "${artistId}" not found`);
      }
    }

    const track = this.tracksService.create(createTrackDto);

    return new TrackEntity(track);
  }

  @Get()
  findAll() {
    const tracks = this.tracksService
      .findAll()
      .map((track) => new TrackEntity(track));

    return tracks;
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const track = this.tracksService.findOne(id);

    if (!track) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }

    return new TrackEntity(track);
  }

  @Put(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @UsePipes(ValidationPipe)
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const { artistId } = updateTrackDto;

    if (artistId) {
      const artist = this.artistsService.findOne(artistId);

      if (!artist) {
        throw new NotFoundException(`Artist with ID "${artistId}" not found`);
      }
    }

    const track = this.tracksService.findOne(id);

    if (!track) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }

    const updatedTrack = this.tracksService.update(id, updateTrackDto);

    return new TrackEntity(updatedTrack);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ description: 'The track has been deleted' })
  @HttpCode(204)
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const track = this.tracksService.findOne(id);

    if (!track) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }

    this.favoritesService.remove(id, 'tracks');

    return this.tracksService.remove(id);
  }
}
