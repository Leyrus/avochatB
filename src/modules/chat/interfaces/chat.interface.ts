export interface IChat {
  id: number,
  name: string,
  userOwnerId: number,
}

export interface IDeleteChatRes {
  deletedChatId: number,
}

export interface IAddParticipantRes {
  addedChatId: number,
  addedUserId: number,
}

export interface IDeleteParticipantRes {
  deletedChatId: number,
  deletedUserId: number,
}
