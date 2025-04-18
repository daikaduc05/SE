import { IUser } from "./IUser";

export interface ITaskFull {
   id: string;
   description: string;
   state: string ; 
   priority: string;
   taskName: string;
   createdTime: Date;
   deadline: Date;
   doneAt: Date;
   taskUsers: ITaskUser[];
   createdBy: IUser;
 }



export interface ITask_user {
  id: string;
  assignTime: Date;
  user : IUser;
}

export interface ITaskEdit{

}



