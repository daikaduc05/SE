import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { DbModule } from '../db/db.module';
import { projectProviders } from './repository/project.provider';
import { taskProviders } from './repository/task.provider';
import { taskUserProviders } from './repository/task-user.provider';
import { roleUserProjectProviders } from './repository/role-user-project.provider';
import { roleProviders, userProviders } from 'src/users/repository';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [DbModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    UsersService,
    ...projectProviders,
    ...taskProviders,
    ...taskUserProviders,
    ...roleUserProjectProviders,
    ...userProviders,
    ...taskProviders,
    ...roleProviders,
    ...taskUserProviders,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
