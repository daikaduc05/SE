import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from '../db/db.module';
import { userProviders } from '../users/repository/users.provider';
import { notificationProviders } from './repository/notification.provider';
import { roleProviders } from './repository/role.provider';
import { notificationUserProviders } from './repository/notification-user.provider';
import {
  projectProviders,
  roleUserProjectProviders,
  taskProviders,
  taskUserProviders,
} from 'src/projects/repository';
import { ProjectsService } from 'src/projects/projects.service';
@Module({
  imports: [DbModule],
  providers: [
    UsersService,
    ...userProviders,
    ...notificationProviders,
    ...roleProviders,
    ...notificationUserProviders,
    ...roleUserProjectProviders,
    ProjectsService,
    ...projectProviders,
    ...taskProviders,
    ...taskUserProviders,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
