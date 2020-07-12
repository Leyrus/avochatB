import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';

@WebSocketGateway(4001)
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private userService: UserService) {}

    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('MessagesGateway');

    @SubscribeMessage('sendMessage')
    sendMessage(client: Socket, payload: any): void {
        this.logger.log(`send ${JSON.stringify(payload)}`);
        this.server.emit('sendMessage', { body: payload });
    }

    @SubscribeMessage('editMessage')
    editMessage(client: Socket, payload: any): void {
        this.logger.log(`edit ${JSON.stringify(payload)}`);
        this.server.emit('editMessage', { body: payload });
    }

    @SubscribeMessage('deleteMessage')
    deleteMessage(client: Socket, payload: any): void {
        this.logger.log(`delete ${JSON.stringify(payload)}`);
        this.server.emit('deleteMessage', { body: payload });
    }

    @SubscribeMessage('online')
    online(client: Socket, payload: {userId: string}): void {
        this.logger.log(`online userID: ${JSON.stringify(payload.userId)}`);
        this.userService.setOnline(+payload.userId, client.id).then();
    }

    afterInit() {
        this.logger.log('Init');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.userService.setOffline(client.id).then();
    }
}
