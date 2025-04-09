import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface CustomRequest extends Request {
  userId: number;
}
export interface CustomJwt extends jwt.JwtPayload {
  userId: number;
}
