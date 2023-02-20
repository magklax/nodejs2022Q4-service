import { MigrationInterface, QueryRunner } from 'typeorm';

export class Favorites1676732859291 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [favorites] = await queryRunner.manager.find('favorites');

    if (!favorites) {
      await queryRunner.manager.insert('favorites', [{}]);
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE favorites CASCADE`);
  }
}
