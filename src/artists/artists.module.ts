import { forwardRef, Module } from '@nestjs/common';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';

import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { InMemoryArtistStorage } from './storage/artist.storage';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, InMemoryArtistStorage],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavoritesModule),
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
