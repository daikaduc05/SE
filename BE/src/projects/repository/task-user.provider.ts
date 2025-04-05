import { DataSource } from 'typeorm';
import { TaskUser } from '../entities/task-user.entity';

export const taskUserProviders = [
  {
    provide: 'TASK_USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TaskUser),
    inject: ['DATA_SOURCE'],
  },
];
