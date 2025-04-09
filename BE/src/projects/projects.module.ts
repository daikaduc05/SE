import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { DbModule } from '../db/db.module';
import { projectProviders } from './repository/project.provider';
import { taskProviders } from './repository/task.provider';
import { taskUserProviders } from './repository/task-user.provider';
import { roleUserProjectProviders } from './repository/role-user-project.provider';

@Module({
  imports: [DbModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ...projectProviders,
    ...taskProviders,
    ...taskUserProviders,
    ...roleUserProjectProviders,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
