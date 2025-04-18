export interface IUser {
    id: string;
    avatar: string;
    name: string;
    email: string;
    password: string;
    notiSettings: boolean;
    isBanned: boolean;
}


export interface IUser_noti {
   user_id: string;
   noti_id: string;
   is_read: boolean;
}
const enum ERoleUser {
    ADMIN = "admin",
    MEMBER = "user",
}


export interface IAddUser{
    roleName: string[];
    email: string;
}




