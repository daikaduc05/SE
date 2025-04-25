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
import { UpdateMemberProjectDto } from './dto/add-member.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TypeNotiEnum } from 'src/enum/typeNoti.enum';
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

  async findOneTask(id: number, projectId: number): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id, project: { id: projectId } },
      relations: ['taskUsers.user', 'createdBy'],
    });
    this.logger.log(task);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async findMyTask(projectId: number, userId: number): Promise<Task[] | null> {
    const project = await this.findOneProject(projectId);
    if (!project) throw new NotFoundException('Project not found');
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    const tasks = await this.taskRepository.find({
      where: { project: project },
      relations: ['createdBy', 'taskUsers', 'taskUsers.user'],
    });
    const myTask = tasks.filter((task) => task.taskUsers.some((item) => item.user.id == user.id));
    return myTask;
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
    userId: number,
  ): Promise<boolean> {
    const project = await this.findOneProject(projectId);
    const user = await this.userService.findByEmails(updateMemberProject.map((item) => item.email));
    const role = await this.userService.findRole(updateMemberProject.map((item) => item.roleName));
    if (!project) throw NotFoundException;
    if (!user) throw NotFoundException;
    if (!role) throw NotFoundException;
    const existingUsers = await this.roleUserProjectRepository.find({
      where: { project: project },
      relations: ['user'],
    });
    const existingUserIds = existingUsers.map((item) => item.user.id);
    const notifiedUserIds = new Set<number>();
    await this.roleUserProjectRepository.delete({ project: project });
    for (let i = 0; i < updateMemberProject.length; i++) {
      const newRoleUserProject = new RoleUserProject();
      newRoleUserProject.project = project;
      newRoleUserProject.user = user[i];
      newRoleUserProject.role = role[i];
      await this.roleUserProjectRepository.save(newRoleUserProject);
      if (
        !existingUserIds.includes(user[i].id) &&
        !notifiedUserIds.has(user[i].id) &&
        user[i].id != userId
      ) {
        await this.userService.sendNotification(
          user[i].id,
          `You have been added to the project: ${project.name}`,
          TypeNotiEnum.Project,
          project.id,
          0,
        );
        notifiedUserIds.add(user[i].id);
      }
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
    await this.updateUserProject(
      newProject.id,
      [
        { email: user.email, roleName: RoleEnum.Admin },
        { email: user.email, roleName: RoleEnum.User },
      ],
      userId,
    );
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
    await this.taskRepository.save(newTask);
    const taskUser = new TaskUser();
    taskUser.task = newTask;
    taskUser.user = user;
    taskUser.assignTime = new Date();
    await this.taskUserRespotiry.save(taskUser);
    return newTask;
  }

  async assignTask(taskId: number, emails: string[], userId: number): Promise<TaskUser[] | null> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project'],
    });
    const users = await this.userService.findByEmails(emails);
    if (!task) throw new NotFoundException('Task not found');
    if (!users) throw new NotFoundException('User not found');
    const oldTaskUsers = await this.taskUserRespotiry.find({
      where: { task: task },
    });
    if (oldTaskUsers) await this.taskUserRespotiry.remove(oldTaskUsers);
    for (const user of users) {
      const isUser = await this.roleUserProjectRepository.exists({
        where: { user: user, project: task.project },
      });
      if (!isUser) throw new NotFoundException('User not found');
    }
    const taskUsers: TaskUser[] = [];
    for (const user of users) {
      const taskUser = new TaskUser();
      taskUser.task = task;
      taskUser.user = user;
      taskUser.assignTime = new Date();
      taskUsers.push(taskUser);
      if (user.id != userId)
        await this.userService.sendNotification(
          user.id,
          `You have been assigned to a new task: ${task.taskName}`,
          TypeNotiEnum.Task,
          task.project.id,
          task.id,
        );
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
    userId: number,
  ): Promise<Project | null> {
    const project = await this.findOneProject(projectId);
    if (!project) throw NotFoundException;
    const userList = await this.findUserByProject(projectId);
    if (userList)
      for (const user of userList) {
        if (user.id != userId)
          await this.userService.sendNotification(
            user.id,
            `The project ${project.name} has been updated`,
            TypeNotiEnum.Project,
            project.id,
            0,
          );
      }
    Object.assign(project, updateData);
    return await this.projectRepository.save(project);
  }

  async updateTask(
    taskId: number,
    updateData: UpdateTaskDto,
    userId: number,
  ): Promise<Task | null> {
    const user = await this.userService.findOne(userId);
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['taskUsers.user', 'createdBy', 'project'],
    });
    if (!user) throw UnauthorizedException;
    if (!task) throw new NotFoundException('Task not found');

    for (const taskUser of task.taskUsers) {
      if (taskUser.user.id != user.id)
        await this.userService.sendNotification(
          taskUser.user.id,
          `The task ${task.taskName} has been updated`,
          TypeNotiEnum.Task,
          task.project.id,
          task.id,
        );
    }
    Object.assign(task, updateData);
    return await this.taskRepository.save(task);
  }

  async findTasksByProjectId(projectId: number): Promise<Task[] | null> {
    const project = await this.findOneProject(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const tasks = await this.taskRepository.find({
      where: { project: project },
      relations: ['createdBy', 'taskUsers', 'taskUsers.user'],
    });

    return tasks;
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
