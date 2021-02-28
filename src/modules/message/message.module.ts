import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [
    // TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => AuthModule),
    ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
