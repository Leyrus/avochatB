import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { IAddParticipantRes, IChat, IDeleteChatRes, IDeleteParticipantRes } from './interfaces/chat.interface';

@WebSocketGateway(1214)
export class ChatGateway {
  constructor() {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('deleteChat')
  deleteChat(client: Socket, payload: IDeleteChatRes): void {
    this.logger.log(`createChat ${JSON.stringify(payload)}`);
    this.server.emit('deleteChat', { body: payload });
  }

  @SubscribeMessage('editChat')
  editChat(client: Socket, payload: IChat): void {
    this.logger.log(`editChat ${JSON.stringify(payload)}`);
    this.server.emit('editChat', { body: payload });
  }

  @SubscribeMessage('addUserToChat')
  addUserToChat(client: Socket, payload: IAddParticipantRes): void {
    this.logger.log(`addUserToChat ${JSON.stringify(payload)}`);
    this.server.emit('addUserToChat', { body: payload });
  }

  @SubscribeMessage('deleteUserFromChat')
  deleteUserFromChat(client: Socket, payload: IDeleteParticipantRes): void {
    this.logger.log(`deleteUserFromChat ${JSON.stringify(payload)}`);
    this.server.emit('deleteUserFromChat', { body: payload });
  }
}
