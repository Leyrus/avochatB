import { Crypto } from '../../../utils/crypto';
import { IMessage } from '../interfaces/message';
import { MessageEntity } from '../entities/message.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IReadableUser } from '../../user/interfaces/user.interface';

export const createMessage = (message: MessageEntity, user: UserEntity | IReadableUser): IMessage => ({
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
