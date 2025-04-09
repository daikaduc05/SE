import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './users.entity';
import { NotificationUser } from './notification-user.entity';

@Entity('nofitications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notificationUser)
  createdBy: User;

  @OneToMany(() => NotificationUser, (notificationUser) => notificationUser.notification)
  notificationUser: NotificationUser[];
}
