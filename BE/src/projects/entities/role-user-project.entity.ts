import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Role } from '../../users/entities/role.entity';
import { Project } from './project.entity';

@Entity('roles_users_projects')
export class RoleUserProject {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.roleUserProjects)
  user: User;

  @ManyToOne(() => Role, (role) => role.roleUserProjects)
  role: Role;

  @ManyToOne(() => Project, (project) => project.roleUserProjects)
  project: Project;
}
