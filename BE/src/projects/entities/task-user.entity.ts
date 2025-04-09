import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Task } from './task.entity';

@Entity('tasks_users')
export class TaskUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'assign_time' })
  assignTime: Date;

  @ManyToOne(() => User, (user) => user.taskUsers)
  user: User;

  @ManyToOne(() => Task, (task) => task.taskUsers)
  task: Task;
}
