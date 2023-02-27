export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
}

export const getLogLevel = (logLevel: string) => {
  if (Object.values(LogLevel).includes(logLevel as LogLevel)) {
    return logLevel as LogLevel;
  }
};
