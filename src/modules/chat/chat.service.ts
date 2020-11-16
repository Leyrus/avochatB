import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { User } from '../../entities/user.entity';
import { ResultOutput } from '../../utils/response';
import {
    IAddUserDTO,
    ICreateChatDTO,
    IDeleteChatDTO,
    IDeleteUserDTO,
    IEditChatNameDTO,
    IGetUsersDTO
} from './chat.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatsRepository: Repository<Chat>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    private logger: Logger = new Logger('ChatService');

    async createChat(body: ICreateChatDTO) {
        const user = await this.usersRepository.findOne({
            login: body.login,
        }, { relations: ['chats'] });

        if(!user) {
            return ResultOutput.error('User not found');
        }

        const newChat = await this.chatsRepository
            .save({ name: body.chatName, userOwnerId: user.userId });

        await this.usersRepository.save({
            ...user,
            chats: [...user.chats, newChat],
        });

        this.logger.log(`newChat: ${JSON.stringify(newChat)}`);

        return ResultOutput.success(newChat);
    }

    async deleteChat(body: IDeleteChatDTO) {
        await this.chatsRepository
            .createQueryBuilder('chat')
            .delete()
            .from(Chat)
            .where('chatId = :chatId', { chatId: body.chatId })
            .execute();

        this.logger.log(`deletedChatId: ${body.chatId}`);

        return ResultOutput.success({ deletedChatId: body.chatId });
    }

    async editChatName(body: IEditChatNameDTO) {
        if(!body.chatId) {
            return ResultOutput.error('There is no chatId');
        }
        if(!body.newChatName) {
            return ResultOutput.error('There is no newChatName');
        }
        await this.chatsRepository.update({ chatId: body.chatId }, {
            name: body.newChatName,
        });

        return ResultOutput.success(body);
    }

    async addUser(body: IAddUserDTO) {
        const user = await this.usersRepository.findOne({
            login: body.login,
        }, { relations: ['chats'] });

        if(!user) {
            return ResultOutput.error('User not found');
        }

        const chat = await this.chatsRepository.findOne({ chatId: body.chatId });

        if(!chat) {
            return ResultOutput.error('Chat not found');
        }

        await this.usersRepository.save({
            ...user,
            chats: [...user.chats, chat],
        });

        const response = {
            addedChatId: chat.chatId,
            addedUserId: user.userId,
        };

        this.logger.log(`addedUserToChat: ${response}`);

        return ResultOutput.success(response);
    }

    async deleteUser(body: IDeleteUserDTO) {
        const user = await this.usersRepository.findOne({
            userId: body.userId,
        }, { relations: ['chats'] });

        if(!user) {
            return ResultOutput.error('User not found');
        }

        const chat = await this.chatsRepository.findOne({ chatId: body.chatId });

        if(!chat) {
            return ResultOutput.error('Chat not found');
        }

        await this.usersRepository.save({
            ...user,
            chats: user.chats.filter(innerChat => innerChat.chatId !== chat.chatId),
        });
        const response = {
            deletedChatId: chat.chatId,
            deletedUserId: user.userId,
        };

        this.logger.log(`deleteUserFromChat: ${response}`);

        return ResultOutput.success(response);
    }

    async getUsers(body: IGetUsersDTO) {
        const chat = await this.chatsRepository.findOne({
            chatId: body.chatId,
        },{
            relations: ['users'],
        });
        if(!chat) {
            return ResultOutput.error('Chat not found');
        }
        const chatUsers = chat.users.map(user => {
            user.isOnline = !!user.socketClientId;
            delete user.password;
            delete user.socketClientId;

            return user;
        });

        this.logger.log(`chatUsers: ${chatUsers}`);

        return ResultOutput.success(chatUsers);
    }
}
