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
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';

@ApiTags('Albums')
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
  @UsePipes(ValidationPipe)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    const { artistId } = createAlbumDto;

    if (artistId) {
      const artist = this.artistsService.findOne(artistId);

      if (!artist) {
        throw new NotFoundException(`Artist with ID "${artistId}" not found`);
      }
    }

    const album = this.albumsService.create(createAlbumDto);

    return new AlbumEntity(album);
  }

  @Get()
  findAll() {
    const albums = this.albumsService
      .findAll()
      .map((album) => new AlbumEntity(album));

    return albums;
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
    const album = this.albumsService.findOne(id);

    if (!album) {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    }

    return new AlbumEntity(album);
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

    const updatedAlbum = this.albumsService.update(id, updateAlbumDto);

    return new AlbumEntity(updatedAlbum);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ description: 'The album has been deleted' })
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
