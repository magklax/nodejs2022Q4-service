import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1676714474399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('users', [
      {
        login: 'John Doe',
        password: 'P@ssword',
      },
    ]);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE users CASCADE`);
  }
}
