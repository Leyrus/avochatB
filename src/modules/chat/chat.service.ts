import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ChatEntity } from './entities/chat.entity';
import { CreateChatDTO } from './dto/create-chat.dto';
import { IChat, IDeleteChatResponse } from './interfaces/chat.interface';
import { DeleteChatDTO } from './dto/delete-participants.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createChat(body: CreateChatDTO, userId: number) {
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

  async deleteChat(body: DeleteChatDTO): Promise<IDeleteChatResponse> {
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
}

