import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization;
    return token.split(' ')[1];
  },
);
