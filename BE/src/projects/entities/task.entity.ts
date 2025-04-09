import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { TaskUser } from './task-user.entity';
import { User } from '../../users/entities/users.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'task_description' })
  description: string;

  @Column({ name: 'task_state' })
  state: string;

  @Column({ name: 'task_priority' })
  priority: string;

  @Column({ name: 'task_name' })
  taskName: string;

  @Column({ name: 'created_time' })
  createdTime: Date;

  @Column({ name: 'task_deadline' })
  deadline: Date;

  @Column({ name: 'done_at' })
  doneAt: Date;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @OneToMany(() => TaskUser, (taskUser) => taskUser.task)
  taskUsers: TaskUser[];

  @ManyToOne(() => User, (user) => user.taskCreated)
  createdBy: User;
}
