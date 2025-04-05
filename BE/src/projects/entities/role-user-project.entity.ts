import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Role } from '../../users/entities/role.entity';
import { Project } from './project.entity';

@Entity('roles_users_projects')
export class RoleUserProject {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  @PrimaryColumn({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => User, (user) => user.roleUserProjects)
  user: User;

  @ManyToOne(() => Role, (role) => role.roleUserProjects)
  role: Role;

  @ManyToOne(() => Project, (project) => project.roleUserProjects)
  project: Project;
}
