import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from 'src/db/db.module';
import { userProviders } from 'src/users/repository/users.provider';
import { notificationProviders } from './repository/notification.provider';
import { roleProviders } from './repository/role.provider';
import { notificationUserProviders } from './repository/notification-user.provider';
@Module({
  imports: [DbModule],
  providers: [
    UsersService,
    ...userProviders,
    ...notificationProviders,
    ...roleProviders,
    ...notificationUserProviders,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
