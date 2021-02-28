import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ChatEntity } from './entities/chat.entity';
import { CreateChatDTO } from './dto/create-chat.dto';
import { IChat } from './interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createChat(body: CreateChatDTO) {
    const user = await this.usersRepository.findOne({
      login: body.login,
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
}
