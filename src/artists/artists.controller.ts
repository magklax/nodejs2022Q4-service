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
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';

@ApiTags('Artists')
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
  @UsePipes(ValidationPipe)
  create(@Body() createArtistDto: CreateArtistDto) {
    const artist = this.artistsService.create(createArtistDto);
    return new ArtistEntity(artist);
  }

  @Get()
  findAll() {
    const artists = this.artistsService
      .findAll()
      .map((artist) => new ArtistEntity(artist));
    return artists;
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
    const artist = this.artistsService.findOne(id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }

    return new ArtistEntity(artist);
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
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artist = this.artistsService.findOne(id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }

    const updatedArtist = this.artistsService.update(id, updateArtistDto);

    return new ArtistEntity(updatedArtist);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ description: 'The artist has been deleted' })
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
