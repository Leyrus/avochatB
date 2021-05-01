import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../../types';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<IResponse<T>>> {
    if (process.env.TIMEOUT_API) {
      const promise = new Promise((res) => {
        setTimeout(res, +process.env.TIMEOUT_API);
      });
      return await promise.then(() => next.handle().pipe(
        map(data => data),
      ));
    }

    return next.handle().pipe(
      map(data => data),
    );
  }
}
