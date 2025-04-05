import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import 'reflect-metadata';

config();

export const dbProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../**/*.entity.js'],
        migrations: [__dirname + '/../migrations/*.js'],
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      return dataSource.initialize();
    },
  },
];
