import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  private getLogsFile = () => {
    const fileName = `${new Date().toString().substr(4, 11).replace(/ /g, '_')}.log`;
    return process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, `../../logs/${fileName}`)
      : path.resolve(__dirname, `../../../logs/${fileName}`);
  };

  private saveLog = (message, context) => {
    const logMessage = `${new Date().toString().substr(4, 20)} - [${context}]: ${message}\n`;
    fs.appendFile(this.getLogsFile(), logMessage, (err) => {
      if (err) {
        throw err;
      }
    });
  };

  private toJSON = (message) => JSON.stringify(message)

  log(message: any, context?: string): void {
    message = this.toJSON(message);
    this.saveLog(message, context);
    console.log(`\x1b[35m ${new Date().toISOString()}\x1b[32m - [${context}]: \x1b[30m${message}`);
  }

  debug(message: any, context?: string): any {
    message = this.toJSON(message);
    console.debug(message);
  }

  error(message: any, trace?: string, context?: string): any {
    message = this.toJSON(message);
    console.log(trace, 'myLog trace');
    this.saveLog(message, context);
    console.log(`\x1b[35m ${new Date().toISOString()}\x1b[31m - [${context}]: \x1b[31m${message}`);
  }

  verbose(message: any, context?: string): any {
    message = this.toJSON(message);
    console.debug(message);
  }

  warn(message: any, context?: string): any {
    message = this.toJSON(message);
    console.warn(message);
  }
}
