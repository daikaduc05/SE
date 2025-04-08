export interface IUser {
    username: string;
    avatar: string;
    email: string;
    password: string;
    noti_setting: boolean;
    is_banned: boolean;
}


export interface IUser_noti {
   user_id: string;
   noti_id: string;
   is_read: boolean;
}


