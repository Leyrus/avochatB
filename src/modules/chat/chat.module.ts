import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../user/entities/user.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatEntity } from './entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChatEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => AuthModule),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {
}
