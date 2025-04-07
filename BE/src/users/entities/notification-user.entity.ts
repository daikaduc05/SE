import { Entity, ManyToOne } from 'typeorm';
import { User } from './users.entity';
import { Notification } from './notification.entit';
@Entity('nofitications-user')
export class NotificationUser {
  @ManyToOne(() => User, (user) => user.notificationUser)
  user: User;

  @ManyToOne(() => Notification, (notification) => notification.notificationUser)
  notification: Notification;
}
