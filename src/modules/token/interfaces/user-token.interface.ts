export interface IUserToken extends Document {
  readonly userId: number;
  readonly token: string;
  readonly expireAt: string;
}
