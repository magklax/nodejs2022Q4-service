import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from './logger.service';

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
        this.loggingService.error(
          `Error during unhandled rejection handling:${error.message}`,
        );
        process.exit(1);
      });
    });

    process.on('uncaughtException', (error) => {
      this.loggingService.error(`Uncaught exception:${error.message}`);
      process.exit(1);
    });
  }
}
