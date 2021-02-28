export class ResultOutput {
  static success = (data: any): any => ({
    ok: true,
    data,
  });

  static error = (errorMessage: string): any => ({
    ok: false,
    data: null,
    errorMessage,
  });
}
