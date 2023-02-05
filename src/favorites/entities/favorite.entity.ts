export class FavoriteEntity {
  artists: string[];
  albums: string[];
  tracks: string[];

  constructor() {
    this.artists = [];
    this.albums = [];
    this.tracks = [];
  }
}
