import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { IDeleteMessagesDTO, IEditMessagesDTO, IGetMessagesDTO, ISendMessagesDTO } from './messages.interface';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) {}

    @Post('get')
    getMessage(@Body() body: IGetMessagesDTO) {
        return this.messagesService.getMessages(body);
    }

    @Post('send')
    sendMessage(@Body() body: ISendMessagesDTO) {
        return this.messagesService.sendMessage(body);
    }

    @Post('delete')
    deleteMessage(@Body() body: IDeleteMessagesDTO) {
        return this.messagesService.deleteMessage(body);
    }

    @Post('edit')
    editMessage(@Body() body: IEditMessagesDTO) {
        return this.messagesService.editMessage(body);
    }
}
