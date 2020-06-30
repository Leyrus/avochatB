import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/messages.entity';
import { User } from '../../entities/user.entity';
import { createMessage } from '../../utils/message';
import { ResultOutput } from '../../utils/response';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async getMessages(body) {
        const users = await this.usersRepository.find({ relations: ['chats'] });
        const chatUsers = users
            .filter(user => user.chats.find(chat => chat.chatId === body.chatId));
        const messages = await this.messagesRepository.find({ chatId: body.chatId });
        const fullMessages = messages.map(message => {
            const user = chatUsers.find(user => user.userId === message.userId);

            return createMessage(message, user);
        });

        return ResultOutput.success(fullMessages);
    }

    async sendMessage(body) {
        const user = await this.usersRepository.findOne({ login: body.login });

        const message = await this.messagesRepository
            .save({
                userId: user.userId,
                chatId: body.chatId,
                message: body.message,
                dateCreate: new Date(),
                dateChange: null,
            });

        return ResultOutput.success(message);
    }

    async deleteMessage(body) {
        await this.messagesRepository.delete(body.messageId);

        return ResultOutput.success({ deletedMessageId: body.messageId });
    }

    async editMessage(body) {
        await this.messagesRepository
            .update({ messageId: body.messageId }, { ...body, dateChange: new Date() });
        const message = await this.messagesRepository
            .findOne({ messageId: body.messageId });
        const user = await this.usersRepository.findOne({ userId: message.userId });

        return ResultOutput.success(createMessage(message, user));
    }
}
