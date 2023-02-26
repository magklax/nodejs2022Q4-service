import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import entities from '.';

dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrationsTableName: 'migrations',
  entities,
  synchronize: true,
  parseInt8: true,
  migrations: ['dist/typeorm/migrations/*{.ts,.js}'],
};

export default new DataSource(config);

export const database = registerAs(
  'database',
  (): PostgresConnectionOptions => config,
);
