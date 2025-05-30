import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [__dirname + '/src/**/*.entity.{ts,js}'],

  migrations: [__dirname + '/src/migrations/*.{ts,js}'],

  synchronize: false,

  ssl: {
    rejectUnauthorized: false,
  },
});
