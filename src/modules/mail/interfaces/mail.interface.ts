export interface IMailGunData {
	readonly from: string;
	readonly to: string[] | string;
	readonly subject: string;
  readonly html: string;
}
