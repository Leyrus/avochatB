import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/messages.entity';
import { User } from '../../entities/user.entity';
import { createMessage } from '../../utils/message';
import { ResultOutput } from '../../utils/response';
import { IDeleteMessagesDTO, IEditMessagesDTO, IGetMessagesDTO, ISendMessagesDTO } from './messages.interface';
import { Crypto } from '../../utils/crypto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    private logger: Logger = new Logger('MessagesService');

    async getMessages(body: IGetMessagesDTO) {
        const users = await this.usersRepository.find({ relations: ['chats'] });

        if(!users) {
            return ResultOutput.error('Users not found');
        }

        const chatUsers = users
            .filter(user => user.chats.find(chat => chat.chatId === body.chatId));
        const messages = await this.messagesRepository.find({ chatId: body.chatId });

        if(!messages) {
            return ResultOutput.error('Messages not found');
        }

        const fullMessages = messages.map(message => {
            const user = chatUsers.find(user => user.userId === message.userId);

            return createMessage(message, user);
        });

        this.logger.log(`fullMessages count: ${fullMessages.length}`);

        return ResultOutput.success(fullMessages);
    }

    async sendMessage(body: ISendMessagesDTO) {
        const user = await this.usersRepository.findOne({ login: body.login });

        if(!user) {
            return ResultOutput.error('Messages not found');
        }

        const message = await this.messagesRepository
            .save({
                userId: user.userId,
                chatId: body.chatId,
                message: Crypto.encrypt(body.message),
                dateCreate: new Date(),
                dateChange: null,
            });

        this.logger.log(`message: ${JSON.stringify(message)}, user: ${JSON.stringify(user)}`);

        return ResultOutput.success(createMessage(message, user));
    }

    async deleteMessage(body: IDeleteMessagesDTO) {
        await this.messagesRepository.delete(body.messageId);

        this.logger.log(`deletedMessageId: ${JSON.stringify(body.messageId)}`);

        return ResultOutput.success({ deletedMessageId: body.messageId });
    }

    async editMessage(body: IEditMessagesDTO) {
        await this.messagesRepository
            .update({ messageId: body.messageId }, {
                ...body,
                message: Crypto.encrypt(body.message),
                dateChange: new Date(),
            });
        const message = await this.messagesRepository
            .findOne({ messageId: body.messageId });
        const user = await this.usersRepository.findOne({ userId: message.userId });

        this.logger.log(`message: ${message}, user: ${user}`);

        return ResultOutput.success(createMessage(message, user));
    }
}
