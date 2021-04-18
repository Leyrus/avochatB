import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../user/interfaces/user.interface';
import { TokenService } from '../token/token.service';
import { config } from '../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      // говорим что хотим получать поле из хедера
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // получение токена из кук
      // jwtFromRequest: ExtractJwt.fromExtractors([(
      //   request: Request,
      // ) => request.cookies.Authentication]),
      secretOrKey: config.jwtSecret,
      passReqToCallback: true,
    });
  }

  // валидация токена
  async validate(req: any, user: Partial<IUser>): Promise<any> {
    const token = req.headers.authorization.slice(7);
    const tokenExists = await this.tokenService.exists(user.id, token);
    if (tokenExists) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
