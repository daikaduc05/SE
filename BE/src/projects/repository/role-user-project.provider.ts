import { DataSource } from 'typeorm';
import { RoleUserProject } from '../entities/role-user-project.entity';

export const roleUserProjectProviders = [
  {
    provide: 'ROLE_USER_PROJECT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RoleUserProject),
    inject: ['DATA_SOURCE'],
  },
];
