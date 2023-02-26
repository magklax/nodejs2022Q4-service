import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1676714474399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        login varchar NOT NULL,
        password varchar NOT NULL,
        "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
        "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW(),
        version integer NOT NULL DEFAULT 1,
        "refreshToken" varchar,
        UNIQUE(login)
      );`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS favorites (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "albumsIds" text[] DEFAULT '{}',
          "artistsId" text[] DEFAULT '{}',
          "tracksIds" text[] DEFAULT '{}'
        );`,
    );

    await queryRunner.manager.insert('favorites', [{}]);

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS artists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        grammy BOOLEAN NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "favoriteArtists" (
        "artistId" UUID REFERENCES artists(id) ON DELETE CASCADE,
        "favoriteId" UUID REFERENCES favorites(id) ON DELETE CASCADE,
        PRIMARY KEY ("artistId", "favoriteId")
      );`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS albums (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          year INTEGER NOT NULL,
          "artistId" UUID DEFAULT NULL,
          FOREIGN KEY ("artistId") REFERENCES artists(id) ON DELETE SET NULL
        );
  
        CREATE TABLE IF NOT EXISTS "favoriteAlbums" (
          "albumId" UUID REFERENCES albums(id) ON DELETE CASCADE,
          "favoriteId" UUID REFERENCES favorites(id) ON DELETE CASCADE,
          PRIMARY KEY ("albumId", "favoriteId")
        );`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS tracks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        "artistId" UUID NULL REFERENCES artists(id) ON DELETE SET NULL,
        "albumId" UUID NULL REFERENCES albums(id) ON DELETE SET NULL,
        duration INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "favoriteTracks" (
        "trackId" UUID REFERENCES tracks(id) ON DELETE CASCADE,
        "favoriteId" UUID REFERENCES favorites(id) ON DELETE CASCADE,
        PRIMARY KEY ("trackId", "favoriteId")
      );`,
    );

    await queryRunner.query(
      `ALTER TABLE favorites ADD COLUMN "favoriteAlbums" uuid[] DEFAULT '{}';
        CREATE TABLE IF NOT EXISTS "favorites_albums_albums" (
          "albumsId" uuid REFERENCES albums(id) ON DELETE CASCADE,
          "favoritesId" uuid REFERENCES favorites(id) ON DELETE CASCADE,
          PRIMARY KEY ("albumsId", "favoritesId")
        );`,
    );

    await queryRunner.query(
      `ALTER TABLE favorites ADD COLUMN "favoriteArtists" uuid[] DEFAULT '{}';
        CREATE TABLE IF NOT EXISTS "favorites_artists_artists" (
          "artistsId" uuid REFERENCES artists(id) ON DELETE CASCADE,
          "favoritesId" uuid REFERENCES favorites(id) ON DELETE CASCADE,
          PRIMARY KEY ("artistsId", "favoritesId")
        );`,
    );

    await queryRunner.query(
      `ALTER TABLE favorites ADD COLUMN "favoriteTracks" uuid[] DEFAULT '{}';
        CREATE TABLE IF NOT EXISTS "tracks_favorite_tracks_favorites" (
          "tracksId" uuid REFERENCES tracks(id) ON DELETE CASCADE,
          "favoritesId" uuid REFERENCES favorites(id) ON DELETE CASCADE,
          PRIMARY KEY ("tracksId", "favoritesId")
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "favorites_artists_artists"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "favoriteArtists"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "favoriteAlbums"`);
    await queryRunner.query(`DROP TABLE IF EXISTS tracks`);
    await queryRunner.query(`DROP TABLE IF EXISTS albums`);
    await queryRunner.query(`DROP TABLE IF EXISTS favorites`);
    await queryRunner.query(`DROP TABLE IF EXISTS artists`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
