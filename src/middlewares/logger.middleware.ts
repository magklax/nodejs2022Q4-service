import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from '../logger/logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.loggingService.logRequest(req, res);
    next();
  }

  onModuleInit() {
    process.on('unhandledRejection', (_reason, promise) => {
      promise.catch((error) => {
        process.stdout.write(
          `Error during unhandled rejection handling:${error.message}`,
        );
        process.exit(1);
      });
    });

    process.on('uncaughtException', (error) => {
      process.stdout.write(`Uncaught exception:${error.message}`);
      process.exit(1);
    });
  }
}
