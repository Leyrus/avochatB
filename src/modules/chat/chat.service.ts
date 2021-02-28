import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { IReadableUser } from '../user/interfaces/user.interface';
import { ChatEntity } from './entities/chat.entity';
import { CreateChatDTO } from './dto/create-chat.dto';
import { IChat, IDeleteChatRes } from './interfaces/chat.interface';
import { DeleteChatDTO } from './dto/delete-participants.dto';
import { EditChatDTO } from './dto/edit-chat.dto';
import { AddParticipantDTO } from './dto/add-participant.dto';
import { DeleteParticipantDTO } from './dto/delete-participant.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getParticipants(chatId: number): Promise<IReadableUser[]> {
    const chat = await this.chatsRepository.findOne({
      id: chatId,
    },{
      relations: ['users'],
    });
    if(!chat) {
      throw new BadRequestException('Chat not found');
    }
    return chat.users.map(user => {
      // @TODO добавить когда появятся сокеты
      // user.isOnline = !!user.socketClientId;
      // delete user.socketClientId;
      delete user.password;

      return user;
    });
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

    return { deletedChatId: body.chatId };
  }

  async editChat(body: EditChatDTO): Promise<IChat> {
    const { chatId, newName } = body;
    await this.chatsRepository
      .update(
        { id: chatId }, { name: newName },
      );
    return await this.chatsRepository.findOne({ id: chatId });
  }

  async addParticipantToChat(body: AddParticipantDTO) {
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

    return {
      addedChatId: chat.id,
      addedUserId: user.id,
    };
  }

  async deleteParticipantFromChat(body: DeleteParticipantDTO) {
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
    return {
      deletedChatId: chat.id,
      deletedUserId: user.id,
    };
  }
}

