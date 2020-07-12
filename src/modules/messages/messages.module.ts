import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../../entities/messages.entity';
import { User } from '../../entities/user.entity';
import { MessagesGateway } from './messages.gateway';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, UserService],
})
export class MessagesModule {}
