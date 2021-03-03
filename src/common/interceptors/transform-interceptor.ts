import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResultOutput } from '../../utils/response';
import { IResponse } from '../../types';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map(data => ResultOutput.success(
        200, request.url, data,
      )),
    );
  }
}
