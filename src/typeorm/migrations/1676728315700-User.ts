import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '..';

export class User1676714474399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const createdAt = Date.now();

    await queryRunner.manager.insert('users', [
      {
        login: 'John Doe',
        password: 'P@ssword',
        createdAt,
        updatedAt: createdAt,
      },
    ]);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(UserEntity);
  }
}
