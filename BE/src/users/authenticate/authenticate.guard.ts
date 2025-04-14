import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
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
    this.logger.log(token);
    const requiredRole = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!token) {
      return false;
    }
    try {
      const secretKey = process.env.JWT_SECRET as string;
      const payload = jwt.verify(token, secretKey);
      const userId = payload['id'] as number;
      this.logger.log(payload);
      req.userId = userId;
      if (!requiredRole && !req.params['projectId']) return true; // trường hợp ko xử lý role project
      const projectId = Number(req.params['projectId']);
      const roleUserProject = (await this.projectSerivce.findRoleProjectUser(
        projectId,
        userId,
      )) as RoleUserProject[];
      this.logger.log(projectId);
      if (!roleUserProject) return false;
      for (const item of roleUserProject) {
        this.logger.log(item.role.name);
        if (requiredRole.includes(item.role.name)) return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
