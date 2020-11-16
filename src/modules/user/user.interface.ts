export interface INewUserDTO {
    name: string,
    login: string,
    password1: string
    password2: string
}
export interface IEditUserDTO {
    userId: number,
    newName?: string,
    newLogin?: string,
    oldPassword?: string,
    newPassword1?: string,
    newPassword2?: string,
}

export interface IUserDTO {
    login: string,
    password: string
}

export interface IUserChange {
    name?: string,
    login?: string,
    password?: string
}
