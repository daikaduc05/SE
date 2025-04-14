import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthenticateGuard } from 'src/users/authenticate/authenticate.guard';
import { Roles } from 'src/role/role.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { CustomRequest } from 'src/custom-interface';
import { Request } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AddMember } from './dto/add-member.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { RoleEnum } from 'src/enum/role.enum';
import { AssignTask } from './dto/assign-task.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Logger } from '@nestjs/common';
@Controller('projects')
export class ProjectsController {
  private readonly logger: Logger = new Logger(ProjectsController.name);
  constructor(private readonly projectsService: ProjectsService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Post('/')
  async createProject(@Body() project: CreateProjectDto, @Request() req: CustomRequest) {
    this.logger.log('[Start Controller] createProject');
    return await this.projectsService.createProject(project, req.userId);
  }

  @Roles(RoleEnum.Admin)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Post('/:projectId/members/')
  async addMember(@Param('projectId') projectId: number, @Body() body: AddMember) {
    this.logger.log('[Start Controller] addMember');
    return await this.projectsService.addUserProject(projectId, body.email, body.roleName);
  }

  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Post('/:projectId/tasks/')
  async createTask(
    @Param('projectId') projectId: number,
    @Request() req: CustomRequest,
    @Body() task: CreateTaskDto,
  ) {
    this.logger.log('[Start Controller] createTask');
    return await this.projectsService.createTask(task, req.userId, projectId);
  }

  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get('/:projectId/tasks/:taskId/')
  async getTask(@Param('projectId') projectId: number, @Param('taskId') taskId: number) {
    this.logger.log('[Start Controller] getTask');
    return await this.projectsService.findOneTask(taskId);
  }

  @Roles(RoleEnum.Admin)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Put('/:projectId/tasks/:taskId/assign/')
  async assignTask(
    @Param('projectId') projectId: number,
    @Param('taskId') taskId: number,
    @Body() body: AssignTask,
  ) {
    this.logger.log('[Start Controller] assignTask');
    return await this.projectsService.assignTask(taskId, body.email);
  }

  @Roles(RoleEnum.User, RoleEnum.Admin)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get('/:projectId/members/')
  async findUser(@Param('projectId') projectId: number) {
    this.logger.log('[Start Controller] findUser');
    return await this.projectsService.findUserByProject(projectId);
  }

  @Roles(RoleEnum.Admin)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Put('/:projectId/')
  async updateProject(@Param('projectId') projectId: number, @Body() updateData: UpdateProjectDto) {
    this.logger.log('[Start Controller] updateProject');
    return await this.projectsService.updateProject(projectId, updateData);
  }

  @Roles(RoleEnum.Admin, RoleEnum.User)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Put('/:projectId/tasks/:taskId/')
  async updateTask(
    @Param('projectId') projectId: number,
    @Param('taskId') taskId: number,
    @Body() updateData: UpdateTaskDto,
    @Request() req: CustomRequest,
  ) {
    this.logger.log('[Start Controller] updateTask');
    return await this.projectsService.updateTask(
      taskId,
      updateData,
      req.isAdmin as boolean,
      req.userId,
    );
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get('/')
  async findProjectByUserId(@Request() req: CustomRequest) {
    this.logger.log('[Start Controller] findProjectByUserId');
    return await this.projectsService.findProjectByUserId(req.userId);
  }

  @Roles(RoleEnum.User)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get('/:projectId')
  async getProjectDetail(@Param('projectId') projectId: number) {
    this.logger.log('[Start Controller] getProjectDetail');
    return await this.projectsService.findOneProject(projectId);
  }

  @Roles(RoleEnum.User)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get('/:projectId/tasks')
  async listTasksByProject(@Param('projectId') projectId: number) {
    this.logger.log('[Start Controller] listTasksByProject');
    return await this.projectsService.findTasksByProjectId(projectId);
  }
}
