import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class MyLogger implements LoggerService {
    private getLogsFile = () => process.env.mode === 'production'
        ? path.resolve(__dirname, `../../logs/${new Date().toString().substr(4, 11).replace(/ /g , '_')}.log`)
        : path.resolve(__dirname, '../../../logs/logs.log')

    log(message: any, context?: string): void {
        if (process.env.NODE_MODE === 'production') {
            const logMessage = `${new Date().toString().substr(4, 20)} - [${context}]: ${message}\n`;
            fs.appendFile(this.getLogsFile(), logMessage, (err) => {
                if(err) {
                    throw err;
                }
            });
        } else {
            console.log(`\x1b[35m ${new Date().toISOString()}\x1b[32m - [${context}]: \x1b[30m${message}`);
        }
    }

    debug(message: any, context?: string): any {
        console.debug(message);
    }

    error(message: any, trace?: string, context?: string): any {
        console.error(message);
    }

    verbose(message: any, context?: string): any {
        console.debug(message);
    }

    warn(message: any, context?: string): any {
      console.warn(message);
    }
}
