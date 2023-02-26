import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import entities from '.';

dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'db',
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
