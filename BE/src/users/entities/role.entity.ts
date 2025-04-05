// Role entity - Đại diện cho vai trò trong hệ thống
import { RoleUserProject } from 'src/projects/entities/role-user-project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => RoleUserProject, (roleUserProject) => roleUserProject.role)
  roleUserProjects: RoleUserProject[];
}
