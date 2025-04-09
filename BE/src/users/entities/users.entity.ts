// User entity - Đại diện cho người dùng trong hệ thống
import { TaskUser } from '../../projects/entities/task-user.entity';
import { RoleUserProject } from '../../projects/entities/role-user-project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Notification } from './notification.entity';
import { Task } from '../../projects/entities/task.entity';
import { NotificationUser } from './notification-user.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  avatar: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'noti_settings', default: true })
  notiSettings: boolean;

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;

  @OneToMany(() => TaskUser, (taskUser) => taskUser.user)
  taskUsers: TaskUser[];

  @OneToMany(() => RoleUserProject, (roleUserProject) => roleUserProject.user)
  roleUserProjects: RoleUserProject[];

  @OneToMany(() => Task, (task) => task.createdBy)
  taskCreated: Task[];

  @OneToMany(() => Notification, (notification) => notification.createdBy)
  notificationCreated: Notification[];

  @OneToMany(() => NotificationUser, (notificationUser) => notificationUser.user)
  notificationUser: NotificationUser[];
}

//npx typeorm migration:generate dist/migrations/AddProductOrField -d dist/data-source.js
