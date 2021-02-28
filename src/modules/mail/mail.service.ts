import { Injectable } from '@nestjs/common';
import * as Mailgun from 'mailgun-js';
import { config } from '../../config';
import { IMailGunData } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  // private mg: Mailgun.messages;
  private mg: any;

  constructor() {
    this.mg = Mailgun({
      apiKey: config.apiKey,
      domain: config.apiDomain,
    });
  }

  send(
    data: IMailGunData): Promise<Mailgun.messages.SendResponse> {
    return new Promise((res, rej) => {
      if (config.enableMail === 'true') {
        this.mg.messages()
          .send(data, function(error, body) {
            if (error) {
              rej(error);
            }
            res(body);
          });
      } else {
        res();
      }
    });
  }
}
