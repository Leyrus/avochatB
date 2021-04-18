import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ChatService } from '../chat/chat.service';
import { ChatEntity } from '../chat/entities/chat.entity';
import { ChatGateway } from '../chat/chat.gateway';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageEntity } from './entities/message.entity';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      MessageEntity,
      ChatEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => AuthModule),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessagesGateway,
    UserService,
    ChatService,
    ChatGateway,
  ],
})
export class MessageModule {
}
