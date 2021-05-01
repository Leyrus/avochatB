import { IChat } from '../../chat/interfaces/chat.interface';

export interface IUser {
  id: number,
  createdAt: Date,
  updatedAt: Date,
  lang: string,
  email: string,
  login: string,
  name: string | null,
  password: string,
  status: string,
  chats?: IChat[],
  socketClientId?: string,
  isOnline?: boolean,
  roles: string,
}

export interface IUserAuth {
  id: number,
  status: string,
  withChats: boolean,
  roles: string,
  iat: number,
  exp: number,
}

export interface IReadableUser {
  id: number
  login: string,
  email: string;
  status: string;
  name: string | null;
  roles: string;
  chats?: IChat[],
  accessToken?: string;
  refreshToken?: string;
  socketClientId?: string,
  isOnline?: boolean,
}

export interface IReadableUserResponse {
  usersList: IReadableUser[],
}

export interface IUserResponse {
  email: string;
  username?: string;
  bio: string;
  image: string | null;
}
