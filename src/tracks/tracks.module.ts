import { forwardRef, Module } from '@nestjs/common';

import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { InMemoryTrackStorage } from './storage/tracks.storage';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService, InMemoryTrackStorage],
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavoritesModule),
  ],
  exports: [TracksService],
})
export class TracksModule {}
