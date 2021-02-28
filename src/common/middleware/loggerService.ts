import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from '@nestjs/common';
import { isProd } from '../../config';

export class CustomLogger implements LoggerService {
    private getLogsFile = () => process.env.NODE_ENV === 'production'
        ? path.resolve(__dirname, `../../logs/${new Date().toString().substr(4, 11).replace(/ /g , '_')}.log`)
        : path.resolve(__dirname, '../../../logs/logs.log')

    private saveLog = (message, context) => {
        if (isProd) {
            const logMessage = `${new Date().toString().substr(4, 20)} - [${context}]: ${message}\n`;
            fs.appendFile(this.getLogsFile(), logMessage, (err) => {
                if(err) {
                    throw err;
                }
            });
        }
    }

    log(message: any, context?: string): void {
        this.saveLog(message, context);
        console.log(`\x1b[35m ${new Date().toISOString()}\x1b[32m - [${context}]: \x1b[30m${message}`);
    }

    debug(message: any, context?: string): any {
        console.debug(message);
    }

    error(message: any, trace?: string, context?: string): any {
        this.saveLog(message, context);
        console.log(`\x1b[35m ${new Date().toISOString()}\x1b[31m - [${context}]: \x1b[31m${message}`);
    }

    verbose(message: any, context?: string): any {
        console.debug(message);
    }

    warn(message: any, context?: string): any {
      console.warn(message);
    }
}
