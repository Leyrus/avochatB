import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    // eslint-disable-next-line @typescript-eslint/ban-types
    use(req: Request, res: Response, next: Function) {
        console.log('Request', req.params);
        next();
    }
}
