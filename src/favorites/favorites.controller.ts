import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Inject(AlbumsService)
  private readonly albumsService: AlbumsService;
  @Inject(ArtistsService)
  private readonly artistsService: ArtistsService;
  @Inject(TracksService)
  private readonly tracksService: AlbumsService;

  @Post('track/:id')
  @HttpCode(201)
  insertTrack(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const track = this.tracksService.findOne(id);

    if (!track) {
      throw new UnprocessableEntityException();
    }

    this.favoritesService.insert(id, 'tracks');

    return track;
  }

  @Post('album/:id')
  @HttpCode(201)
  insertAlbum(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const album = this.albumsService.findOne(id);

    if (!album) {
      throw new UnprocessableEntityException();
    }

    this.favoritesService.insert(id, 'albums');

    return album;
  }

  @Post('artist/:id')
  @HttpCode(201)
  insertArtist(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const artist = this.artistsService.findOne(id);

    if (!artist) {
      throw new UnprocessableEntityException();
    }

    this.favoritesService.insert(id, 'artists');
    return artist;
  }

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const track = this.tracksService.findOne(id);

    if (!track) {
      throw new UnprocessableEntityException();
    }

    return this.favoritesService.remove(id, 'tracks');
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const album = this.albumsService.findOne(id);

    if (!album) {
      throw new UnprocessableEntityException();
    }

    return this.favoritesService.remove(id, 'albums');
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const artist = this.artistsService.findOne(id);

    if (!artist) {
      throw new UnprocessableEntityException();
    }

    return this.favoritesService.remove(id, 'artists');
  }
}
