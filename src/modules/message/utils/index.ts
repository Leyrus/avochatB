import { Crypto } from '../../../utils/crypto';
import { IMessage } from '../interfaces/message';
import { IUser } from '../../user/interfaces/user.interface';
import { MessageEntity } from '../entities/message.entity';

export const createMessage = (message: MessageEntity, user: IUser): IMessage => ({
  messageId: message.messageId,
  message: Crypto.decrypt(message.message),
  dateCreate: message.dateCreate,
  dateChange: message.dateChange,
  author: {
    userId: message.userId,
    name: user ? user.name : 'Deleted user',
    login: user ? user.login : 'Deleted user',
  },
});
