import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoleUserProject } from './role-user-project.entity';
import { Task } from './task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => RoleUserProject, (roleUserProject) => roleUserProject.project)
  roleUserProjects: RoleUserProject[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
