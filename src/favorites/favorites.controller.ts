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
  ConflictException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesService } from './favorites.service';
import { FavoritesRepsonse } from './interfaces/favorite-responce.interface';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Inject(AlbumsService)
  private readonly albumsService: AlbumsService;
  @Inject(ArtistsService)
  private readonly artistsService: ArtistsService;
  @Inject(TracksService)
  private readonly tracksService: TracksService;

  @Post('track/:id')
  @HttpCode(201)
  @ApiResponse({ description: 'Added succesfully' })
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

    if (this.favoritesService.isExist(id, 'tracks')) {
      throw new ConflictException(`Track ${track.name} is already favorite`);
    }

    return this.favoritesService.insert(id, 'tracks');
  }

  @Post('album/:id')
  @HttpCode(201)
  @ApiResponse({ description: 'Added succesfully' })
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

    if (this.favoritesService.isExist(id, 'albums')) {
      throw new ConflictException(`Album ${album.name} is already favorite`);
    }

    return this.favoritesService.insert(id, 'albums');
  }

  @Post('artist/:id')
  @HttpCode(201)
  @ApiResponse({ description: 'Added succesfully' })
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

    if (this.favoritesService.isExist(id, 'artists')) {
      throw new ConflictException(`Artist ${artist.name} is already favorite`);
    }

    return this.favoritesService.insert(id, 'artists');
  }

  @Get()
  @ApiResponse({ description: 'Successful operation' })
  findAll() {
    const artists = this.artistsService.findAll();
    const albums = this.albumsService.findAll();
    const tracks = this.tracksService.findAll();

    const favorites = this.favoritesService.findAll();

    return new FavoritesRepsonse({
      artists: artists.filter((artist) =>
        favorites.artists.includes(artist.id),
      ),
      albums: albums.filter((album) => favorites.albums.includes(album.id)),
      tracks: tracks.filter((track) => favorites.tracks.includes(track.id)),
    });
  }

  @Delete('track/:id')
  @HttpCode(204)
  @ApiResponse({ description: 'Deleted succesfully' })
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

    if (!this.favoritesService.isExist(id, 'tracks')) {
      throw new NotFoundException(`Track ${track.name} is not favorite`);
    }

    this.favoritesService.remove(id, 'tracks');
  }

  @Delete('album/:id')
  @HttpCode(204)
  @ApiResponse({ description: 'Deleted succesfully' })
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

    if (!this.favoritesService.isExist(id, 'albums')) {
      throw new NotFoundException(`Album ${album.name} is not favorite`);
    }

    this.favoritesService.remove(id, 'albums');
  }

  @Delete('artist/:id')
  @HttpCode(204)
  @ApiResponse({ description: 'Deleted succesfully' })
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

    if (!this.favoritesService.isExist(id, 'artists')) {
      throw new NotFoundException(`Artist ${artist.name} is not favorite`);
    }

    this.favoritesService.remove(id, 'artists');
  }
}
