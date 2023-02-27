import { Injectable } from '@nestjs/common';
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

type LogLevel = 'debug' | 'info' | 'error';

const LOG_LEVELS = process.env.LOG_LEVELS.split(', ') || [
  'debug',
  'info',
  'error',
];
const LOG_FILE = process.env.LOG_FILE || 'logs.txt';
const LOG_MAX_FILE_SIZE = +process.env.LOG_MAX_FILE_SIZE || 10485760; // 10 MB

@Injectable()
export class LoggingService {
  logDir: string;
  logFile: string;
  maxFileSize: number;
  LogLevel: LogLevel;

  constructor() {
    this.logDir = join(process.cwd(), 'logs');

    mkdirSync(this.logDir, { recursive: true });

    this.logFile = join(this.logDir, LOG_FILE);
    this.maxFileSize = LOG_MAX_FILE_SIZE;
    this.rotateLogFileIfNeeded();
  }

  private logToFileAndStdout(message: string) {
    process.stdout.write(message + '\n');

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
    return LOG_LEVELS.includes(level);
  }

  logRequest(req: Request, res: Response) {
    const { method, url, query, body } = req;

    if (this.shouldLog('info')) {
      const timestamp = new Date().toISOString();
      const reqMessage = `${timestamp} [INFO] Incoming request - ${method} ${url} - Query: ${JSON.stringify(
        query,
      )} - Body: ${JSON.stringify(body)}`;

      this.logToFileAndStdout(reqMessage);
    }

    res.on('finish', () => {
      const resMessage = `[INFO] Outgoing response: ${method} ${url} Response code: ${res.statusCode}`;

      this.info(resMessage);
    });
  }

  info(message: string) {
    if (this.shouldLog('info')) {
      const timestamp = new Date().toISOString();
      this.logToFileAndStdout(`${timestamp} ${message}`);
    }
  }

  error(message: string, stack?: string) {
    if (this.shouldLog('error')) {
      const timestamp = new Date().toISOString();

      this.logToFileAndStdout(
        `${timestamp} [ERROR] ${message} ${stack ? `\n${stack}` : ''}`,
      );
    }
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      const timestamp = new Date().toISOString();
      this.logToFileAndStdout(`${timestamp} [DEBUG] ${message}`);
    }
  }
}
