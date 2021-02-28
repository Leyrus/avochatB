import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { MailModule } from '../mail/mail.module';
import { config } from '../../config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TokenModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: config.jwtTime },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule { }
