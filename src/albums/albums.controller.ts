import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ValidationPipe,
  UsePipes,
  NotFoundException,
  Inject,
  HttpStatus,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Inject(ArtistsService)
  private readonly artistsService: ArtistsService;
  @Inject(TracksService)
  public tracksService: TracksService;
  @Inject(FavoritesService)
  private readonly favoritesService: FavoritesService;

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createAlbumDto: CreateAlbumDto) {
    const { artistId } = createAlbumDto;

    if (artistId) {
      const artist = this.artistsService.findOne(artistId);

      if (!artist) {
        throw new NotFoundException(`Artist with ID "${artistId}" not found`);
      }
    }

    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const album = this.albumsService.findOne(id);

    if (!album) {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    }

    return album;
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const album = this.albumsService.findOne(id);

    if (!album) {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    }

    const { artistId } = updateAlbumDto;

    if (artistId) {
      const artist = this.artistsService.findOne(artistId);

      if (!artist) {
        throw new NotFoundException(`Artist with ID "${artistId}" not found`);
      }
    }

    return this.albumsService.update(id, updateAlbumDto);
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
    const album = this.albumsService.findOne(id);

    if (!album) {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    }

    this.tracksService.resetAlbumIds(album.id);

    this.favoritesService.remove(id, 'albums');

    return this.albumsService.remove(id);
  }
}
