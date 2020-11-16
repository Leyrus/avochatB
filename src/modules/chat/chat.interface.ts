export interface ICreateChatDTO {
    login: string,
    chatName: string,
}

export interface IDeleteChatDTO {
    chatId: number,
}

export interface IEditChatNameDTO {
    chatId: number,
    newChatName: string,
}

export interface IAddUserDTO {
    login: string,
    chatId: number,
}

export interface IDeleteUserDTO {
    userId: number,
    chatId: number
}

export interface IGetUsersDTO {
    chatId: number,
}

export interface IEditChatDTO {
    chatId: number,
    newName: string,
}
