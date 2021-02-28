import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { configModule } from './config/configure.root';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TokenModule,
    MailModule,
    ChatModule,
    MessageModule,
    TypeOrmModule.forRoot(),
    configModule,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '(*)', method: RequestMethod.ALL });
  }
}
