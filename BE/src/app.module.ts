import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { ProjectsModule } from './projects/projects.module';
// import { ChatGateway } from './chat/chat.gateway';

import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [UsersModule, DbModule, ProjectsModule, EventEmitterModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
