import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  appendFileSync,
  existsSync,
  statSync,
  readFileSync,
  mkdirSync,
} from 'fs';
import { config } from 'dotenv';
import { join } from 'path';

config();

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

const LOG_FILE = 'logs.txt';
const LOG_LEVEL_IDX = +process.env.LOG_LEVEL_IDX || 0;
const LOG_MAX_FILE_SIZE = +process.env.LOG_MAX_FILE_SIZE || 10485760; // 10 MB

@Injectable()
export class LoggingService extends Logger {
  logDir: string;
  logFile: string;
  maxFileSize: number;

  constructor() {
    super();
    this.logDir = join(process.cwd(), 'logs');

    mkdirSync(this.logDir, { recursive: true });

    this.logFile = join(this.logDir, LOG_FILE);
    this.maxFileSize = LOG_MAX_FILE_SIZE;
    this.rotateLogFileIfNeeded();
  }

  private logToFileAndStdout(logLevel: LogLevel, message: string) {
    super[logLevel](message);

    if (!existsSync(this.logFile)) {
      mkdirSync(this.logDir, { recursive: true });
    }

    appendFileSync(this.logFile, message + '\n');

    this.rotateLogFileIfNeeded();
  }

  private rotateLogFileIfNeeded() {
    if (existsSync(this.logFile)) {
      const stats = statSync(this.logFile);

      if (stats.size > this.maxFileSize) {
        const backupFile = `${this.logFile}.${new Date().toISOString()}.bak`;
        appendFileSync(backupFile, '');
        appendFileSync(backupFile, readFileSync(this.logFile, 'utf8'));
        appendFileSync(this.logFile, '');
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const index = Object.values(LogLevel).indexOf(level);

    return index <= LOG_LEVEL_IDX;
  }

  logRequest(req: Request, res: Response) {
    const { method, url, query, body } = req;

    const reqTimestamp = new Date().toISOString();
    const reqMessage = `${reqTimestamp} Incoming request - ${method} ${url} - Query: ${JSON.stringify(
      query,
    )} - Body: ${JSON.stringify(body)}`;

    this.log(reqMessage);

    res.on('finish', () => {
      const resTimestamp = new Date().toISOString();
      const resMessage = `${resTimestamp} Outgoing response: ${method} ${url} Response code: ${res.statusCode}`;

      this.log(resMessage);
    });
  }

  error(message: string, stack?: string) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const timestamp = new Date().toISOString();

      this.logToFileAndStdout(
        LogLevel.ERROR,
        `${timestamp} ${message} ${stack ? `\n${stack}` : ''}`,
      );
    }
  }

  warn(message: string) {
    if (this.shouldLog(LogLevel.WARN)) {
      const timestamp = new Date().toISOString();

      this.logToFileAndStdout(LogLevel.WARN, `${timestamp} ${message}`);
    }
  }

  log(message: any) {
    if (this.shouldLog(LogLevel.LOG)) {
      const timestamp = new Date().toISOString();

      this.logToFileAndStdout(LogLevel.LOG, `${timestamp} ${message}`);
    }
  }

  debug(message: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const timestamp = new Date().toISOString();

      this.logToFileAndStdout(LogLevel.DEBUG, `${timestamp} ${message}`);
    }
  }

  verbose(message: string) {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      const timestamp = new Date().toISOString();

      this.logToFileAndStdout(LogLevel.VERBOSE, `${timestamp} ${message}`);
    }
  }
}
