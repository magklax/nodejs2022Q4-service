import { ApiProperty } from '@nestjs/swagger';

export class FavoriteEntity {
  @ApiProperty()
  artists: string[];

  @ApiProperty()
  albums: string[];

  @ApiProperty()
  tracks: string[];

  constructor() {
    this.artists = [];
    this.albums = [];
    this.tracks = [];
  }
}
