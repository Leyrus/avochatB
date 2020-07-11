import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { IAddUserDTO, ICreateChatDTO, IDeleteChatDTO, IDeleteUserDTO, IGetUsersDTO } from './chat.interface';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('createChat')
    createChat(@Body() body: ICreateChatDTO) {
        return this.chatService.createChat(body);
    }

    @Post('deleteChat')
    deleteChat(@Body() body: IDeleteChatDTO) {
        return this.chatService.deleteChat(body);
    }

    @Post('addUserToChat')
    addUser(@Body() body: IAddUserDTO) {
        return this.chatService.addUser(body);
    }

    @Post('deleteUserFromChat')
    deleteUser(@Body() body: IDeleteUserDTO) {
        return this.chatService.deleteUser(body);
    }

    @Post('getUsers')
    getUsers(@Body() body: IGetUsersDTO) {
        return this.chatService.getUsers(body);
    }
}
