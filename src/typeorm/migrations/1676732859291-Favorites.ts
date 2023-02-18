import { MigrationInterface, QueryRunner } from 'typeorm';
import { FavoriteEntity } from '..';

export class Favorites1676732859291 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('favorites', [
      {
        albumsIds: [],
        artistsId: [],
        tracksIds: [],
      },
    ]);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(FavoriteEntity);
  }
}
