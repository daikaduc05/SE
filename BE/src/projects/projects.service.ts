import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { State } from 'src/enum/state.enum';
@Injectable()
export class ProjectsService {
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

  async findProjectByUserId(
    userId: number,
  ): Promise<{ project: Project; role: string[] }[] | null> {
    const user = await this.userService.findOne(userId);
    if (!user) throw NotFoundException;
    const roleUserProject = await this.roleUserProjectRepository.find({
      where: { user: user },
      relations: ['project', 'role'],
    });
    return Object.values(
      roleUserProject.reduce(
        (acc, item) => {
          const { id } = item.project;
          const roleName = item.role.name;
          if (!acc[id]) {
            // Nếu chưa có đối tượng với id này, tạo mới
            acc[id] = { project: item.project, role: [] };
          }
          // Thêm role vào mảng role
          acc[id].role.push(roleName);

          return acc;
        },
        {} as Record<number, { project: Project; role: string[] }>,
      ),
    );
  }

  async findOneTask(id: number): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['taskUsers', 'taskUsers.user', 'createdBy'],
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

  async addUserProject(
    projectId: number,
    email: string,
    rolename: string,
  ): Promise<RoleUserProject | null> {
    const newRoleUserProject = new RoleUserProject();
    const project = await this.findOneProject(projectId);
    const user = await this.userService.findByEmail(email);
    const role = await this.userService.findRole(rolename);
    if (!project) throw NotFoundException;
    if (!user) throw NotFoundException;
    if (!role) throw NotFoundException;
    newRoleUserProject.project = project;
    newRoleUserProject.user = user;
    newRoleUserProject.role = role;
    return await this.roleUserProjectRepository.save(newRoleUserProject);
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
    await this.addUserProject(newProject.id, user.email, RoleEnum.Admin);
    await this.addUserProject(newProject.id, user.email, RoleEnum.User);
    return newProject;
  }

  async createTask(task: CreateTaskDto, userId: number, projectId: number): Promise<Task | null> {
    const newTask = new Task();
    const user = await this.userService.findOne(userId);
    const project = await this.findOneProject(projectId);
    if (!user) throw UnauthorizedException;
    if (!project) throw NotFoundException;
    newTask.createdBy = user;
    newTask.state = State.Start;
    newTask.deadline = task.deadline;
    newTask.doneAt = task.deadline;
    newTask.priority = task.priority;
    newTask.taskName = task.taskName;
    newTask.description = task.description;
    newTask.createdTime = new Date();
    newTask.project = project;
    return await this.taskRepository.save(newTask);
  }

  async assignTask(taskId: number, email: string): Promise<TaskUser | null> {
    const task = await this.findOneTask(taskId);
    const user = await this.userService.findByEmail(email);
    if (!task) throw NotFoundException;
    if (!user) throw UnauthorizedException;
    const taskUser = new TaskUser();
    taskUser.task = task;
    taskUser.user = user;
    taskUser.assignTime = new Date();
    const checkedTaskUser = await this.taskUserRespotiry.findOne({
      where: { task: task, user: user },
    });
    if (!checkedTaskUser) return await this.taskUserRespotiry.save(taskUser);
    else {
      return await this.taskUserRespotiry.remove(checkedTaskUser);
    }
  }

  async findUserByProject(projectId: number): Promise<{ user: User; role: string[] }[] | null> {
    const project = await this.findOneProject(projectId);
    const userList = await this.roleUserProjectRepository.find({
      where: { project: project as Project },
      relations: ['user', 'role'],
    });
    return Object.values(
      userList.reduce(
        (acc, item) => {
          const userId = item.user.id;
          const roleName = item.role.name;

          if (!acc[userId]) {
            // Nếu chưa có đối tượng với userId này, tạo mới
            acc[userId] = { user: item.user, role: [] };
          }

          // Thêm role vào mảng role
          acc[userId].role.push(roleName);

          return acc;
        },
        {} as Record<number, { user: User; role: string[] }>,
      ),
    );
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
    updateData: Partial<CreateTaskDto>,
    isAdmin: boolean,
    userId: number,
  ): Promise<Task | null> {
    const task = await this.findOneTask(taskId);
    if (!task) throw NotFoundException;
    if (!isAdmin && task.createdBy.id !== userId) throw UnauthorizedException;
    // Cập nhật thông tin task
    Object.assign(task, updateData);
    return await this.taskRepository.save(task);
  }

  async findTasksByProjectId(projectId: number): Promise<Task[] | null> {
    const project = await this.findOneProject(projectId);
    if (!project) throw NotFoundException;
    return await this.taskRepository.find({
      where: { project: project },
      relations: ['createdBy', 'taskUsers', 'taskUsers.user'],
    });
  }
}
