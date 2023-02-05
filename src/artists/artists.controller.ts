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
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
  Put,
  Inject,
} from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Inject(TracksService)
  public tracksService: TracksService;
  @Inject(AlbumsService)
  public albumsService: AlbumsService;
  @Inject(FavoritesService)
  private readonly favoritesService: FavoritesService;

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const artist = this.artistsService.findOne(id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }

    return artist;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artist = this.artistsService.findOne(id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }

    return this.artistsService.update(id, updateArtistDto);
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
    const artist = this.artistsService.findOne(id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }

    this.tracksService.resetArtistIds(artist.id);
    this.albumsService.resetArtistIds(artist.id);

    this.favoritesService.remove(id, 'artists');

    return this.artistsService.remove(id);
  }
}
