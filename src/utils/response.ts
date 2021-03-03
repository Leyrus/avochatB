interface IResult {
  ok: boolean,
  statusCode: number,
  timestamp: string,
  path: string,
  data: any,
  error?: any,
}

export class ResultOutput {
  static success = (statusCode: number, path, data: any): IResult => ({
    ok: true,
    statusCode,
    path,
    timestamp: new Date().toISOString(),
    data,
  });

  static error = (statusCode, path, error: any): IResult => ({
    ok: false,
    statusCode,
    path,
    timestamp: new Date().toISOString(),
    data: null,
    error,
  });
}
