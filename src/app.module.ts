import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessagesModule } from './modules/messages/messages.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        UserModule,
        ChatModule,
        MessagesModule,
        TypeOrmModule.forRoot()
    ],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: '(*)', method: RequestMethod.ALL });
    }
}
