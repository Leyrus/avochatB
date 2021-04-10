import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crypto } from '../../utils/crypto';
import { UserEntity } from '../user/entities/user.entity';
import { ChatEntity } from '../chat/entities/chat.entity';
import { ChatService } from '../chat/chat.service';
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
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    private messageGateway: MessagesGateway,
    private chatService: ChatService,
  ) {}

  async getMessages({
    userId,
    chatId,
    offset,
    limit,
  }): Promise<IMessage[]> {
    const chatParticipants = await this.chatService.getParticipants(chatId);
    const hasChat = chatParticipants.some(participant => participant.id === userId);

    if (!hasChat) {
      throw new BadRequestException('The user is not a participant of this chat');
    }

    const messages = await this.messagesRepository
      .createQueryBuilder()
      .select('messages')
      .from(MessageEntity, 'messages')
      .where('messages.chatId = :chatId', { chatId })
      .limit(limit)
      .offset(offset)
      .getMany()
    ;

    if (!messages) {
      throw new BadRequestException('Messages not found');
    }

    return messages.map(message => {
      const user = chatParticipants.find(user => user.id === message.userId);

      return createMessage(message, user);
    });
  }

  async sendMessage(body: SendMessagesDTO, userId): Promise<IMessage> {
    const user = await this.usersRepository.findOne({
      id: userId,
    });

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
