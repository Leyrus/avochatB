import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { User } from '../../entities/user.entity';
import { ResultOutput } from '../../utils/response';
import { IAddUserDTO, ICreateChatDTO, IDeleteChatDTO, IDeleteUserDTO } from './chat.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatsRepository: Repository<Chat>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async createChat(body: ICreateChatDTO) {
        const user = await this.usersRepository.findOne({
            login: body.login,
        }, { relations: ['chats'] });

        const newChat = await this.chatsRepository
            .save({ name: body.chatName, userOwnerId: user.userId });
        await this.usersRepository.save({
            ...user,
            chats: [...user.chats, newChat],
        });

        return ResultOutput.success(newChat);
    }

    async deleteChat(body: IDeleteChatDTO) {
        await this.chatsRepository
            .createQueryBuilder('chat')
            .delete()
            .from(Chat)
            .where('chatId = :chatId', { chatId: body.chatId })
            .execute();

        return ResultOutput.success({ deletedChatId: body.chatId });
    }

    async addUser(body: IAddUserDTO) {
        const user = await this.usersRepository.findOne({
            login: body.login,
        }, { relations: ['chats'] });
        const chat = await this.chatsRepository.findOne({ chatId: body.chatId });
        await this.usersRepository.save({
            ...user,
            chats: [...user.chats, chat],
        });

        const response = {
            addedChatId: chat.chatId,
            addedUserId: user.userId,
        };

        return ResultOutput.success(response);
    }

    async deleteUser(body: IDeleteUserDTO) {
        const user = await this.usersRepository.findOne({
            login: body.login,
        }, { relations: ['chats'] });
        const chat = await this.chatsRepository.findOne({ chatId: body.chatId });
        await this.usersRepository.save({
            ...user,
            chats: user.chats.filter(innerChat => innerChat.chatId !== chat.chatId),
        });
        const response = {
            deletedChatId: chat.chatId,
            deletedUserId: user.userId,
        };

        return ResultOutput.success(response);
    }
}
