export class AssignedUserDto {
  id: number;
  name: string;
  email: string;
  assignedTime: Date;
}

export class TaskResponseDto {
  id: number;
  taskName: string;
  description: string;
  createdTime: Date;
  deadline: Date;
  doneAt: Date;
  priority: string;
  state: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  assignedUsers: AssignedUserDto[];
}
