import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Role } from '../../users/entities/role.entity';
import { Project } from './project.entity';

@Entity('roles_users_projects')
@Unique(['user', 'role', 'project'])
export class RoleUserProject {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.roleUserProjects, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, (role) => role.roleUserProjects, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Project, (project) => project.roleUserProjects, { onDelete: 'CASCADE' })
  project: Project;
}
