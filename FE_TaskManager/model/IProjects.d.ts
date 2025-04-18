export interface IProjects {
    id: string;
    name: string;
    avatar: string;
    description: string;
    created_at: string;
}

export interface IProjects_Info{
    id: string;
    name: string;
    description: string;
    startDate : Date;
    endDate: Date;
   roles :[
        "admin" | "user"
   ]
}

export interface IProjects_member {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

export interface IEditUser {
    roleName: string;
    email: string;
}


export interface IProjects_Detail {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
}


