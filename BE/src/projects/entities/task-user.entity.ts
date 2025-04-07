import { Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Task } from './task.entity';

@Entity('task_user')
export class TaskUser {
  @ManyToOne(() => User, (user) => user.taskUsers)
  user: User;

  @ManyToOne(() => Task, (task) => task.taskUsers)
  task: Task;
}
