import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { CustomRequest } from '../../custom-interface';
import { Reflector } from '@nestjs/core';
import { ProjectsService } from 'src/projects/projects.service';
import { ROLES_KEY } from 'src/role/role.decorator';
import { RoleUserProject } from 'src/projects/entities/role-user-project.entity';
config();
@Injectable()
export class AuthenticateGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticateGuard.name);
  constructor(
    private readonly projectSerivce: ProjectsService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('start guard');
    const req = context.switchToHttp().getRequest<CustomRequest>();
    const authHeader = req.headers['authorization'] as string;
    const token = authHeader && authHeader.split(' ')[1];
    const superRole = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]); // có role thì chắc chắn được, ko cần check ngoại lệ

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const secretKey = process.env.JWT_SECRET as string;
      const payload = jwt.verify(token, secretKey);
      const userId = payload['id'] as number;
      req.userId = userId;
      if (!superRole && !req.params['projectId']) return true; // trường họp chưa có project nào hết và xử lý api ko liên quan đến project
      const projectId = Number(req.params['projectId']);
      const roleUserProject = (await this.projectSerivce.findRoleProjectUser(
        projectId,
        userId,
      )) as RoleUserProject[];
      if (!roleUserProject) return false;
      for (const item of roleUserProject) {
        if (superRole.includes(item.role.name)) {
          return true; // có role cứng chắc chắn được !
        }
      }
      if (!req.params['taskId']) {
        // trường hợp ở trong project nhưng chưa xử lý task
        // mặc định là ko đủ quyền rồi, ko có ngoại lệ
        return false;
      }
      // trường hợp xử lý task - may be có ngoại lệ
      const taskId = Number(req.params['taskId']);
      const task = await this.projectSerivce.findOneTask(taskId, projectId);
      if (!task) return false;
      const taskUser = task.taskUsers.find((item) => item.user.id === userId);
      if (!taskUser) return false;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
