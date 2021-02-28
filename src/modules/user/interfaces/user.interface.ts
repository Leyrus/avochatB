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
  roles: string,
}

export interface IUserAuth {
  id: number,
  status: string,
  roles: string,
  iat: number,
  exp: number,
}

export interface IReadableUser {
  email: string;
  status: string;
  name: string | null;
  roles: string;
  chats?: IChat[],
  accessToken?: string;
}

export interface IUserResponse {
  email: string;
  username?: string;
  bio: string;
  image: string | null;
}
