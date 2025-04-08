import { DataSource } from 'typeorm';
import { Notification } from '../entities/notification.entit';

export const notificationProviders = [
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Notification),
    inject: ['DATA_SOURCE'],
  },
];
