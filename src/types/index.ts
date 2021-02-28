export interface IResponse<T> {
  ok: boolean,
  errorMessage?: string,
  data: T,
}

export type IResponsePromise<T> = Promise<IResponse<T>>
