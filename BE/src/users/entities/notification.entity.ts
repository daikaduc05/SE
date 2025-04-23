import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NotificationUser } from './notification-user.entity';

@Entity('nofitications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column()
  type: string;

  @Column()
  projectId: number;

  @Column()
  taskId: number;

  @OneToMany(() => NotificationUser, (notificationUser) => notificationUser.notification)
  notificationUser: NotificationUser[];
}
