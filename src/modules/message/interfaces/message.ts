interface IMessageAuthor {
  userId: number,
  name: string,
  login: string,
}

export interface IMessage {
  messageId: number,
  chatId?: number,
  userId?: number,
  message: string,
  dateCreate: Date,
  dateChange?: Date | null,
  author: IMessageAuthor,
}

export interface IDeleteMessageRes {
  deletedMessageId: number
}
