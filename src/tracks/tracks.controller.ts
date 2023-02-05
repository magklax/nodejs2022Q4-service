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
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

import { TracksService } from './tracks.service';

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
  @UsePipes(new ValidationPipe({ whitelist: true }))
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

    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
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

    return track;
  }

  @Put(':id')
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

    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
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
