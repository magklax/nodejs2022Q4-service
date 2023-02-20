import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {
    this.favoritesService.create();
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
    return this.favoritesService.insertAlbum(id);
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
    return this.favoritesService.insertArtist(id);
  }

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
    return this.favoritesService.insertTrack(id);
  }

  @Get()
  @ApiResponse({ description: 'Successful operation' })
  findAll() {
    return this.favoritesService.findAll();
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
    return this.favoritesService.removeAlbum(id);
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
    return this.favoritesService.removeArtist(id);
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
    return this.favoritesService.removeTrack(id);
  }
}
