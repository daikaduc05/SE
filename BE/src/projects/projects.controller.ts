import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthenticateGuard } from 'src/users/authenticate/authenticate.guard';
import { Roles } from 'src/role/role.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { CustomRequest } from 'src/custom-interface';
import { Request } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UpdateMemberProjectDtoRequest } from './dto/add-member.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { RoleEnum } from 'src/enum/role.enum';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Logger } from '@nestjs/common';
@Controller('projects')
export class ProjectsController {
  private readonly logger: Logger = new Logger(ProjectsController.name);
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Post()
  async createProject(@Body() project: CreateProjectDto, @Request() req: CustomRequest) {
    this.logger.log('[Start Controller] createProject');
    return await this.projectsService.createProject(project, req.userId);
  }

  @Roles(RoleEnum.Admin)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Put('/:projectId/members/')
  @ApiBody({ type: UpdateMemberProjectDtoRequest })
  async updateMemberToProject(
    @Param('projectId') projectId: number,
    @Body() body: UpdateMemberProjectDtoRequest,
    @Request() req: CustomRequest,
  ) {
    this.logger.log('[Start Controller] updateMemberToProject');
    this.logger.log(body);
    return await this.projectsService.updateUserProject(projectId, body.membersList, req.userId);
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
    @Body() body: AssignTaskDto,
    @Request() req: CustomRequest,
  ) {
    this.logger.log('[Start Controller] assignTask');
    this.logger.log(body);
    return await this.projectsService.assignTask(taskId, body.emails, req.userId);
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
  async updateProject(
    @Param('projectId') projectId: number,
    @Body() updateData: UpdateProjectDto,
    @Request() req: CustomRequest,
  ) {
    this.logger.log('[Start Controller] updateProject');
    return await this.projectsService.updateProject(projectId, updateData, req.userId);
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
    return await this.projectsService.updateTask(taskId, updateData, req.userId);
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

  @Roles(RoleEnum.User, RoleEnum.Admin)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get('/:projectId/tasks')
  async listTasksByProject(@Param('projectId') projectId: number) {
    this.logger.log('[Start Controller] listTasksByProject');
    return await this.projectsService.findTasksByProjectId(projectId);
  }

  @Roles(RoleEnum.Admin)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Delete('/:projectId/tasks/:taskId')
  async deleteTask(
    @Param('taskId') taskId: number,
    @Param('projectId') __projectId: number, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    this.logger.log('[Start Controller] deleteTask');
    await this.projectsService.deleteTask(taskId);
    return { message: 'Task deleted successfully' };
  }

  @Roles(RoleEnum.Admin)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Delete('/:projectId')
  async deleteProject(@Param('projectId') projectId: number) {
    this.logger.log('[Start Controller] deleteProject');
    await this.projectsService.deleteProject(projectId);
    return { message: 'Project deleted successfully' };
  }
}
