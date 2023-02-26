import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import { appendFileSync } from 'fs';

import { getLogLevel, LogLevel } from './utils';

config();

@Injectable()
export class LoggingService {
  logLevel: LogLevel;
  logFile: string;

  constructor() {
    this.logLevel = getLogLevel(process.env.LOG_LEVEL || LogLevel.INFO);
    this.logFile = process.env.LOG_FILE || 'logs.txt';
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      Object.values(LogLevel).indexOf(level) >=
      Object.values(LogLevel).indexOf(this.logLevel)
    );
  }

  private logToFileAndStdout(message: string) {
    process.stdout.write(message + '\n');
    appendFileSync(this.logFile, message + '\n');
  }

  debug(message: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const logMessage = `[DEBUG] ${message}`;

      this.logToFileAndStdout(logMessage);
    }
  }

  info(message: string) {
    if (this.shouldLog(LogLevel.INFO)) {
      const logMessage = `[INFO] ${message}`;

      this.logToFileAndStdout(logMessage);
    }
  }

  error(error: Error) {
    console.log(error);

    const logMessage = `[ERROR] ${error.name}: ${error.message}`;

    this.logToFileAndStdout(logMessage);
  }

  logRequest(req: Request, res: Response) {
    const { url, method, query, body } = req;

    if (this.shouldLog(LogLevel.DEBUG)) {
      const logMessage = `[DEBUG] Incoming request: ${method} ${url} Query: ${JSON.stringify(
        query,
      )} Body: ${JSON.stringify(body)}`;

      this.logToFileAndStdout(logMessage);
    }

    res.on('finish', () => {
      if (this.shouldLog(LogLevel.DEBUG)) {
        const logMessage = `[DEBUG] Outgoing response: ${method} ${url} Response code: ${res.statusCode}`;

        this.logToFileAndStdout(logMessage);
      } else if (this.shouldLog(LogLevel.INFO)) {
        const logMessage = `[INFO] ${method} ${url} ${res.statusCode}`;

        this.logToFileAndStdout(logMessage);
      }
    });
  }
}
