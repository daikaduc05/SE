import { IProjects } from "./model/IProjects"

export const fLogin = [
    {
        email: "cac",
        password: "123456",
    }, 
]

export const fUser = {
    username: "Nguyen Ha",
    avatar: "",
    email: "nguyenha17022005@gmail.com",
    password: "123456",
    noti_setting: true,
    is_banned: false
}

export const fProject:IProjects[] = [
   {
    id: "1",
    name: "Project 1",
    avatar: "",
    description: "Description 1",
    created_at: "2021-01-01"
   },
   {
    id: "2",
    name: "Project 2",
    avatar: "",
    description: "Description 2",
    created_at: "2021-01-02"
   }
]
