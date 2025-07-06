import fs from 'fs/promises';
import path from 'path';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: string;
  service: string;
  method: string;
  userId?: number;
  message: string;
  data?: any;
  error?: any;
  duration?: number;
  trace?: string;
}

export class Logger {
  private logDir: string;
  private serviceName: string;
  private minLevel: LogLevel;

  constructor(serviceName: string, minLevel: LogLevel = LogLevel.INFO) {
    this.serviceName = serviceName;
    this.minLevel = minLevel;
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDir();
  }

  private async ensureLogDir() {
    try {
      await fs.access(this.logDir);
    } catch {
      await fs.mkdir(this.logDir, { recursive: true });
    }
  }

  private async writeLog(entry: LogEntry) {
    const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
    const logLine = JSON.stringify(entry) + '\n';
    
    try {
      await fs.appendFile(logFile, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private formatError(error: any): any {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error as any)
      };
    }
    return error;
  }

  private createLogEntry(
    level: LogLevel,
    method: string,
    message: string,
    data?: any,
    error?: any,
    userId?: number,
    duration?: number
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      service: this.serviceName,
      method,
      message,
      duration
    };

    if (userId) entry.userId = userId;
    if (data) entry.data = data;
    if (error) entry.error = this.formatError(error);
    if (error?.stack) entry.trace = error.stack;

    return entry;
  }

  async debug(method: string, message: string, data?: any, userId?: number) {
    if (this.minLevel <= LogLevel.DEBUG) {
      const entry = this.createLogEntry(LogLevel.DEBUG, method, message, data, undefined, userId);
      await this.writeLog(entry);
      console.debug(`[DEBUG] ${this.serviceName}.${method}: ${message}`, data || '');
    }
  }

  async info(method: string, message: string, data?: any, userId?: number, duration?: number) {
    if (this.minLevel <= LogLevel.INFO) {
      const entry = this.createLogEntry(LogLevel.INFO, method, message, data, undefined, userId, duration);
      await this.writeLog(entry);
      console.info(`[INFO] ${this.serviceName}.${method}: ${message}`, data || '');
    }
  }

  async warn(method: string, message: string, data?: any, userId?: number) {
    if (this.minLevel <= LogLevel.WARN) {
      const entry = this.createLogEntry(LogLevel.WARN, method, message, data, undefined, userId);
      await this.writeLog(entry);
      console.warn(`[WARN] ${this.serviceName}.${method}: ${message}`, data || '');
    }
  }

  async error(method: string, message: string, error?: any, data?: any, userId?: number, duration?: number) {
    if (this.minLevel <= LogLevel.ERROR) {
      const entry = this.createLogEntry(LogLevel.ERROR, method, message, data, error, userId, duration);
      await this.writeLog(entry);
      console.error(`[ERROR] ${this.serviceName}.${method}: ${message}`, error || '', data || '');
    }
  }

  async fatal(method: string, message: string, error?: any, data?: any, userId?: number) {
    if (this.minLevel <= LogLevel.FATAL) {
      const entry = this.createLogEntry(LogLevel.FATAL, method, message, data, error, userId);
      await this.writeLog(entry);
      console.error(`[FATAL] ${this.serviceName}.${method}: ${message}`, error || '', data || '');
    }
  }

  // Método para medir performance de operações
  async timeOperation<T>(
    method: string,
    operation: () => Promise<T>,
    message: string,
    userId?: number,
    data?: any
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      await this.info(method, `Starting: ${message}`, data, userId);
      
      const result = await operation();
      
      const duration = Date.now() - startTime;
      await this.info(method, `Completed: ${message}`, { ...data, result: 'success' }, userId, duration);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.error(method, `Failed: ${message}`, error, data, userId, duration);
      throw error;
    }
  }
}

// Instâncias de logger para cada service
export const userLogger = new Logger('UserService');
export const alarmLogger = new Logger('AlarmService');
export const goalLogger = new Logger('GoalService');
export const blockedAppLogger = new Logger('BlockedAppService');
export const routineLogger = new Logger('RoutineService'); 