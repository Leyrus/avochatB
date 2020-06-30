export interface IGetMessagesDTO {
    chatId: number,
}

export interface ISendMessagesDTO {
    login: string,
    chatId: number,
    message: string,
}

export interface IDeleteMessagesDTO {
    messageId: number,
}

export interface IEditMessagesDTO {
    messageId: number,
    message: string,
}
