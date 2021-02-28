import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crypto } from '../../utils/crypto';
import { UserEntity } from '../user/entities/user.entity';
import { MessageEntity } from './entities/message.entity';
import { createMessage } from './utils';
import { EditMessageDTO } from './dto/edit-message.dto';
import { DeleteMessagesDTO } from './dto/delete-message.dto';
import { SendMessagesDTO } from './dto/send-message.dto';
import { IDeleteMessageRes, IMessage } from './interfaces/message';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private messageGateway: MessagesGateway,
  ) {
  }

  async getMessages(chatId: number): Promise<IMessage[]> {
    const users = await this.usersRepository.find({
      relations: ['chats'],
    });

    if (!users) {
      throw new BadRequestException('Users not found');
    }

    const chatUsers = users
      .filter(user => user.chats.find(chat => chat.id === chatId));
    const messages = await this.messagesRepository.find({ chatId });

    if (!messages) {
      throw new BadRequestException('Messages not found');
    }

    return messages.map(message => {
      const user = chatUsers.find(user => user.id === message.userId);

      return createMessage(message, user);
    });
  }

  async sendMessage(body: SendMessagesDTO, userId): Promise<IMessage> {
    const user = await this.usersRepository.findOne({
      id: userId,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const message = await this.messagesRepository
      .save({
        userId: user.id,
        chatId: body.chatId,
        message: Crypto.encrypt(body.message),
        dateCreate: new Date(),
        dateChange: null,
      });
    const newMessage = createMessage(message, user);
    this.messageGateway.sendMessage(null, newMessage);

    return newMessage;
  }

  async deleteMessage(body: DeleteMessagesDTO): Promise<IDeleteMessageRes> {
    await this.messagesRepository.delete(body.messageId);

    const deletedMessage = { deletedMessageId: body.messageId };

    this.messageGateway.deleteMessage(null, deletedMessage);
    return deletedMessage;
  }

  async editMessage(body: EditMessageDTO): Promise<IMessage> {
    await this.messagesRepository
      .update({ messageId: body.messageId }, {
        ...body,
        message: Crypto.encrypt(body.message),
        dateChange: new Date(),
      });
    const message = await this.messagesRepository
      .findOne({ messageId: body.messageId });
    const user = await this.usersRepository.findOne({
      id: message.userId,
    });

    const newMessage = createMessage(message, user);
    this.messageGateway.editMessage(null, newMessage);

    return newMessage;
  }
}
