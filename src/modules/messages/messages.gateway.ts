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

@WebSocketGateway(4001)
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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

    afterInit() {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
