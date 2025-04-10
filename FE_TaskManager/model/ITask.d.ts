export interface ITask {
   id: string;
   project_id: string;
   description: string;
   state: EState;
   priority: string;
   task_name: string;
   created_time: string;
   deadline: string;
   done_at : string;
   created_by: string;
}

export interface ITask_user {
   task_id: string;
   user_id: string;
   is_assigned: boolean;
}


