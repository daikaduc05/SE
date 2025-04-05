import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [UsersModule, DbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
