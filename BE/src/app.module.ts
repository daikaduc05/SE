import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [UsersModule, DbModule, ProjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
