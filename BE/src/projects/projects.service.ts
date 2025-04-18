import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleUserProject } from './entities/role-user-project.entity';
import { Project } from './entities/project.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';
import { RoleEnum } from 'src/enum/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskUser } from './entities/task-user.entity';
import { StateEnum } from 'src/enum/state.enum';
import { ProjectByUserDto } from './dto/project-by-user.dto';
import { UserWithRoleDto } from './dto/user-with-role.dto';
import { TaskResponseDto, AssignedUserDto } from './dto/task-response.dto';
import { UpdateMemberProjectDto } from './dto/add-member.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  constructor(
    @Inject('ROLE_USER_PROJECT_REPOSITORY')
    private readonly roleUserProjectRepository: Repository<RoleUserProject>,
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: Repository<Project>,
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: Repository<Task>,
    @Inject('TASK_USER_REPOSITORY')
    private readonly taskUserRespotiry: Repository<TaskUser>,
    private readonly userService: UsersService,
  ) {}

  async findOneProject(id: number): Promise<Project | null> {
    return await this.projectRepository.findOne({ where: { id } });
  }

  async findProjectByUserId(userId: number): Promise<ProjectByUserDto[] | null> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const roleUserProject = await this.roleUserProjectRepository.find({
      where: { user: user },
      relations: ['project', 'role'],
    });

    const projects = Object.values(
      roleUserProject.reduce(
        (acc, item) => {
          const { id, name, description, startDate, endDate } = item.project;
          const roleName = item.role.name;
          if (!acc[id]) {
            // Nếu chưa có đối tượng với id này, tạo mới
            acc[id] = {
              id,
              name,
              description,
              startDate,
              endDate,
              roles: [],
            };
          }
          // Thêm role vào mảng roles
          acc[id].roles.push(roleName);

          return acc;
        },
        {} as Record<number, ProjectByUserDto>,
      ),
    );

    return projects;
  }

  async findOneTask(id: number): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['taskUsers.user', 'createdBy'],
    });
  }

  async findRoleProjectUser(projectId: number, userId: number): Promise<RoleUserProject[] | null> {
    const thisUser = (await this.userService.findOne(userId)) as User;
    const thisProject = (await this.findOneProject(projectId)) as Project;
    return await this.roleUserProjectRepository.find({
      where: { user: thisUser, project: thisProject },
      relations: ['role'],
    });
  }

  async updateUserProject(
    projectId: number,
    updateMemberProject: UpdateMemberProjectDto[],
  ): Promise<boolean> {
    const project = await this.findOneProject(projectId);
    const user = await this.userService.findByEmails(updateMemberProject.map((item) => item.email));
    const role = await this.userService.findRole(updateMemberProject.map((item) => item.roleName));
    this.logger.log(user);
    this.logger.log(role);
    if (!project) throw NotFoundException;
    if (!user) throw NotFoundException;
    if (!role) throw NotFoundException;
    await this.roleUserProjectRepository.delete({ project: project });
    for (let i = 0; i < updateMemberProject.length; i++) {
      const newRoleUserProject = new RoleUserProject();
      newRoleUserProject.project = project;
      newRoleUserProject.user = user[i];
      newRoleUserProject.role = role[i];
      await this.roleUserProjectRepository.save(newRoleUserProject);
      this.logger.log(newRoleUserProject);
    }
    return true;
  }

  async createProject(project: CreateProjectDto, userId: number): Promise<Project | null> {
    const newProject = new Project();
    newProject.description = project.description;
    newProject.name = project.name;
    newProject.startDate = project.startDate;
    newProject.endDate = project.endDate;
    const user = await this.userService.findOne(userId);
    if (!user) throw UnauthorizedException;
    await this.projectRepository.save(newProject);
    await this.updateUserProject(newProject.id, [
      { email: user.email, roleName: RoleEnum.Admin },
      { email: user.email, roleName: RoleEnum.User },
    ]);
    return newProject;
  }

  async createTask(task: CreateTaskDto, userId: number, projectId: number): Promise<Task | null> {
    const newTask = new Task();
    const user = await this.userService.findOne(userId);
    const project = await this.findOneProject(projectId);
    if (!user) throw UnauthorizedException;
    if (!project) throw NotFoundException;
    newTask.createdBy = user;
    newTask.state = StateEnum.NotDone;
    newTask.deadline = task.deadline;
    newTask.doneAt = task.deadline;
    newTask.priority = task.priority;
    newTask.taskName = task.taskName;
    newTask.description = task.description;
    newTask.createdTime = new Date();
    newTask.project = project;
    return await this.taskRepository.save(newTask);
  }

  async assignTask(taskId: number, emails: string[]): Promise<TaskUser[] | null> {
    const task = await this.findOneTask(taskId);
    const users = await this.userService.findByEmails(emails);
    if (!task) throw NotFoundException;
    if (!users) throw UnauthorizedException;
    const oldTaskUsers = await this.taskUserRespotiry.find({
      where: { task: task },
    });
    if (oldTaskUsers) await this.taskUserRespotiry.remove(oldTaskUsers);
    const taskUsers: TaskUser[] = [];
    for (const user of users) {
      const taskUser = new TaskUser();
      taskUser.task = task;
      taskUser.user = user;
      taskUser.assignTime = new Date();
      taskUsers.push(taskUser);
    }
    return await this.taskUserRespotiry.save(taskUsers);
  }

  async findUserByProject(projectId: number): Promise<UserWithRoleDto[] | null> {
    const project = await this.findOneProject(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const userList = await this.roleUserProjectRepository.find({
      where: { project: project },
      relations: ['user', 'role'],
    });

    const users = Object.values(
      userList.reduce(
        (acc, item) => {
          const { id, name, email } = item.user;
          const roleName = item.role.name;

          if (!acc[id]) {
            // Nếu chưa có đối tượng với id này, tạo mới
            acc[id] = {
              id,
              name,
              email,
              roles: [],
            };
          }
          // Thêm role vào mảng roles
          acc[id].roles.push(roleName);

          return acc;
        },
        {} as Record<number, UserWithRoleDto>,
      ),
    );

    return users;
  }

  async updateProject(
    projectId: number,
    updateData: Partial<CreateProjectDto>,
  ): Promise<Project | null> {
    const project = await this.findOneProject(projectId);
    if (!project) throw NotFoundException;
    Object.assign(project, updateData);
    return await this.projectRepository.save(project);
  }

  async updateTask(
    taskId: number,
    updateData: UpdateTaskDto,
    userId: number,
  ): Promise<Task | null> {
    const task = await this.findOneTask(taskId);
    const user = await this.userService.findOne(userId);
    const taskUser = await this.taskUserRespotiry.findOne({
      where: { task: task as Task, user: user as User },
    });
    if (!taskUser) throw UnauthorizedException;
    if (!task) throw NotFoundException; // Cập nhật thông tin task
    Object.assign(task, updateData);
    return await this.taskRepository.save(task);
  }

  async findTasksByProjectId(projectId: number): Promise<TaskResponseDto[] | null> {
    const project = await this.findOneProject(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const tasks = await this.taskRepository.find({
      where: { project: project },
      relations: ['createdBy', 'taskUsers', 'taskUsers.user'],
    });

    const taskMap = new Map<number, TaskResponseDto>();

    tasks.forEach((task) => {
      if (!taskMap.has(task.id)) {
        taskMap.set(task.id, {
          id: task.id,
          taskName: task.taskName,
          description: task.description,
          createdTime: task.createdTime,
          deadline: task.deadline,
          doneAt: task.doneAt,
          priority: task.priority,
          state: task.state,
          createdBy: {
            id: task.createdBy.id,
            name: task.createdBy.name,
            email: task.createdBy.email,
          },
          assignedUsers: [],
        });
      }

      const taskDto = taskMap.get(task.id);
      task.taskUsers.forEach((taskUser) => {
        const assignedUser: AssignedUserDto = {
          id: taskUser.user.id,
          name: taskUser.user.name,
          email: taskUser.user.email,
          assignedTime: taskUser.assignTime,
        };
        taskDto?.assignedUsers.push(assignedUser);
      });
    });

    return Array.from(taskMap.values());
  }

  async deleteTask(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    await this.taskRepository.remove(task);
  }

  async deleteProject(projectId: number): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    await this.projectRepository.remove(project);
  }
}
