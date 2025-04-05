import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Task } from './task.entity';

@Entity('task_user')
export class TaskUser {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'task_id' })
  taskId: number;

  @ManyToOne(() => User, (user) => user.taskUsers)
  user: User;

  @ManyToOne(() => Task, (task) => task.taskUsers)
  task: Task;
}
