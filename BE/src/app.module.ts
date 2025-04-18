import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { ProjectsModule } from './projects/projects.module';
// import { ChatGateway } from './chat/chat.gateway';
// import { NotificationGateway } from './notification/notification.gateway';

@Module({
  imports: [UsersModule, DbModule, ProjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
