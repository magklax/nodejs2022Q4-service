import { MigrationInterface, QueryRunner } from 'typeorm';
import { TrackEntity } from '..';

export class Track1676910820765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('tracks', [
      {
        name: 'The Show Must Go On',
        duration: 7200,
      },
    ]);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(TrackEntity);
  }
}
