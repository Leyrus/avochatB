export interface ICreateChatDTO {
    login: string,
    chatName: string,
}

export interface IDeleteChatDTO {
    chatId: number,
}

export interface IAddUserDTO {
    login: string,
    chatId: number
}

export interface IDeleteUserDTO {
    login: string,
    chatId: number

}
