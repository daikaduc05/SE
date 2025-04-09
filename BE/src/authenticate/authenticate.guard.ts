import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { CustomRequest, CustomJwt } from '../custom-interface';
config();
@Injectable()
export class AuthenticateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<CustomRequest>();
    const authHeader = req.headers['access-token'] as string;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return false;
    }
    try {
      const secretKey = process.env.JWT_SECRET as string;
      const payload = jwt.verify(token, secretKey) as CustomJwt;
      req.userId = payload.userId;
      return true;
    } catch (error) {
      console.log('loi day roi', error);
      return false;
    }
  }
}
