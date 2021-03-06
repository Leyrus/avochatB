export interface IResponse<T> {
  ok: boolean,
  errorMessage?: string,
  data: T,
}
