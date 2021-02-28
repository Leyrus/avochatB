export interface IChat {
  id: number,
  name: string,
  userOwnerId: number,
}

export interface IDeleteChatResponse {
  deletedChatId: number,
}
