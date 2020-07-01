import { User } from '../entities/user.entity';
import { Message } from '../entities/messages.entity';
import { Crypto } from './crypto';

export const createMessage = (message: Message, user: User) => ({
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
