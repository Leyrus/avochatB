import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { IDeleteMessagesDTO, IEditMessagesDTO, IGetMessagesDTO, ISendMessagesDTO } from './messages.interface';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) {}

    @Post('getMessages')
    getMessage(@Body() body: IGetMessagesDTO) {
        return this.messagesService.getMessages(body);
    }

    @Post('sendMessage')
    sendMessage(@Body() body: ISendMessagesDTO) {
        return this.messagesService.sendMessage(body);
    }

    @Post('deleteMessage')
    deleteMessage(@Body() body: IDeleteMessagesDTO) {
        return this.messagesService.deleteMessage(body);
    }

    @Post('editMessage')
    editMessage(@Body() body: IEditMessagesDTO) {
        return this.messagesService.editMessage(body);
    }
}
