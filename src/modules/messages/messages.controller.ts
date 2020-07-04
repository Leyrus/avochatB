import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { IDeleteMessagesDTO, IEditMessagesDTO, IGetMessagesDTO, ISendMessagesDTO } from './messages.interface';
import { MessagesGateway } from './messages.gateway';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService, private messagesGateway: MessagesGateway) {}

    @Post('getMessages')
    getMessage(@Body() body: IGetMessagesDTO) {
        return this.messagesService.getMessages(body);
    }

    @Post('sendMessage')
    sendMessage(@Body() body: ISendMessagesDTO) {
        const result = this.messagesService.sendMessage(body);

        result.then(({ data }) => this.messagesGateway.sendMessage(null, data));

        return result;
    }

    @Post('deleteMessage')
    deleteMessage(@Body() body: IDeleteMessagesDTO) {
        const result = this.messagesService.deleteMessage(body);

        result.then(({ data }) => this.messagesGateway.deleteMessage(null, data));

        return result;
    }

    @Post('editMessage')
    editMessage(@Body() body: IEditMessagesDTO) {
        const result = this.messagesService.editMessage(body);

        result.then(({ data }) => this.messagesGateway.editMessage(null, data));

        return result;
    }
}
