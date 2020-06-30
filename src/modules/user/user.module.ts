import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Chat } from '../../entities/chat.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Chat])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
