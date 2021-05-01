import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { IReadableUser, IReadableUserResponse } from '../user/interfaces/user.interface';
import { ChatEntity } from './entities/chat.entity';
import { CreateChatDTO } from './dto/create-chat.dto';
import { IChat, IDeleteChatRes } from './interfaces/chat.interface';
import { DeleteChatDTO } from './dto/delete-chat.dto';
import { EditChatDTO } from './dto/edit-chat.dto';
import { AddParticipantChatDto } from './dto/add-participant-chat.dto';
import { DeleteParticipantChatDto } from './dto/delete-participant-chat.dto';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    private chatGateway: ChatGateway,
  ) {}

  async getParticipants(chatId: number): Promise<IReadableUserResponse> {
    const chat = await this.chatsRepository.findOne({
      id: chatId,
    },{
      relations: ['users'],
    });
    if(!chat) {
      throw new BadRequestException('Chat is not found');
    }
    const usersList = chat.users.map(user => {
          user.isOnline = !!user.socketClientId;
          delete user.socketClientId;
          delete user.password;

          return user;
        });
    return { usersList };
  }

  async createChat(body: CreateChatDTO, userId: number): Promise<IChat> {
    const user = await this.usersRepository.findOne({
      id: userId,
    }, { relations: ['chats'] });

    if(!user) {
      throw new BadRequestException('User not found');
    }

    const newChat: IChat = await this.chatsRepository
      .save({ name: body.chatName, userOwnerId: user.id });

    await this.usersRepository.save({
      ...user,
      chats: [...user.chats, newChat],
    });

    return newChat;
  }

  async deleteChat(body: DeleteChatDTO): Promise<IDeleteChatRes> {
    const result = await this.chatsRepository
      .createQueryBuilder('chat')
      .delete()
      .from(ChatEntity)
      .where('id = :chatId', { chatId: body.chatId })
      .execute();

    if (result.affected === 0) {
      throw new BadRequestException('Chat with this id was not found');
    }
    const deletedChat = { deletedChatId: body.chatId };
    this.chatGateway.deleteChat(null, deletedChat);

    return deletedChat;
  }

  async editChat(body: EditChatDTO): Promise<IChat> {
    const { chatId, newName } = body;
    await this.chatsRepository
      .update(
        { id: chatId }, { name: newName },
      );
    const updatedChat = await this.chatsRepository.findOne({ id: chatId });
    this.chatGateway.editChat(null, updatedChat);
    return updatedChat;
  }

  async addParticipantToChat(body: AddParticipantChatDto) {
    const user = await this.usersRepository.findOne({
      login: body.login,
    }, { relations: ['chats'] });

    if(!user) {
      throw new BadRequestException('User not found');
    }

    const chat = await this.chatsRepository.findOne({
      id: body.chatId,
    });

    if(!chat) {
      throw new BadRequestException('Chat not found');
    }

    await this.usersRepository.save({
      ...user,
      chats: [...user.chats, chat],
    });

    const newParticipant = {
      addedChatId: chat.id,
      addedUserId: user.id,
    };

    this.chatGateway.addUserToChat(null, newParticipant);

    return newParticipant;
  }

  async deleteParticipantFromChat(body: DeleteParticipantChatDto) {
    const user = await this.usersRepository.findOne({
      login: body.login,
    }, { relations: ['chats'] });

    if(!user) {
      throw new BadRequestException('User not found');
    }

    const chat = await this.chatsRepository
      .findOne({ id: body.chatId });

    if(!chat) {
      throw new BadRequestException('Chat not found');
    }

    await this.usersRepository.save({
      ...user,
      chats: user.chats
        .filter(innerChat => innerChat.id !== chat.id),
    });
    const deletedParticipant = {
      deletedChatId: chat.id,
      deletedUserId: user.id,
    };
    this.chatGateway.deleteUserFromChat(null, deletedParticipant);

    return deletedParticipant;
  }
}

