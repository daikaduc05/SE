import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Task } from './task.entity';

@Entity('tasks_users')
@Unique(['user', 'task'])
export class TaskUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'assign_time' })
  assignTime: Date;

  @ManyToOne(() => User, (user) => user.taskUsers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Task, (task) => task.taskUsers, { onDelete: 'CASCADE' })
  task: Task;
}
