// User entity - Đại diện cho người dùng trong hệ thống
import { TaskUser } from 'src/projects/entities/task-user.entity';
import { RoleUserProject } from 'src/projects/entities/role-user-project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

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
}
