import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';
import { Notification } from './notification.entity';
@Entity('notification-users')
export class NotificationUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'is_read' })
  isRead: boolean;
  @ManyToOne(() => User, (user) => user.notificationUser)
  user: User;

  @ManyToOne(() => Notification, (notification) => notification.notificationUser)
  notification: Notification;
}
