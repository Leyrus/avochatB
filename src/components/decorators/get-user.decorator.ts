import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserAuth } from '../../modules/user/interfaces/user.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserAuth => {
    const req = ctx.switchToHttp().getRequest();
    return {
      ...req.user,
      withChats: req.query.withChats === 'true' || false,
    };
  },
);
