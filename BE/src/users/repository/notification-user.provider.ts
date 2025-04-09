import { DataSource } from 'typeorm';
import { NotificationUser } from '../entities/notification-user.entity';

export const notificationUserProviders = [
  {
    provide: 'NOTIFICATION_USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(NotificationUser),
    inject: ['DATA_SOURCE'],
  },
];
