import { Request } from 'express';
export interface CustomRequest extends Request {
  userId: number;
  projectId?: number | null;
  isAdmin?: boolean;
}
