import fs from 'fs/promises';
import path from 'path';

export interface LogFilter {
  level?: string;
  service?: string;
  method?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export class LogViewer {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
  }

  async getLogFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.logDir);
      return files.filter(file => file.endsWith('.log')).sort().reverse();
    } catch (error) {
      console.error('Erro ao ler diretório de logs:', error);
      return [];
    }
  }

  async readLogFile(filename: string): Promise<any[]> {
    try {
      const filePath = path.join(this.logDir, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      
      return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(entry => entry !== null);
    } catch (error) {
      console.error(`Erro ao ler arquivo de log ${filename}:`, error);
      return [];
    }
  }

  async getLogs(filter: LogFilter = {}): Promise<any[]> {
    const files = await this.getLogFiles();
    let allLogs: any[] = [];

    for (const file of files) {
      const logs = await this.readLogFile(file);
      allLogs = allLogs.concat(logs);
    }

    return this.filterLogs(allLogs, filter);
  }

  private filterLogs(logs: any[], filter: LogFilter): any[] {
    return logs.filter(log => {
      // Filtrar por nível
      if (filter.level && log.level !== filter.level) {
        return false;
      }

      // Filtrar por serviço
      if (filter.service && log.service !== filter.service) {
        return false;
      }

      // Filtrar por método
      if (filter.method && !log.method.includes(filter.method)) {
        return false;
      }

      // Filtrar por usuário
      if (filter.userId && log.userId !== filter.userId) {
        return false;
      }

      // Filtrar por data
      if (filter.startDate) {
        const logDate = new Date(log.timestamp);
        const startDate = new Date(filter.startDate);
        if (logDate < startDate) {
          return false;
        }
      }

      if (filter.endDate) {
        const logDate = new Date(log.timestamp);
        const endDate = new Date(filter.endDate);
        if (logDate > endDate) {
          return false;
        }
      }

      // Filtrar por texto de busca
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const logText = JSON.stringify(log).toLowerCase();
        if (!logText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }

  async getErrorLogs(limit: number = 100): Promise<any[]> {
    const logs = await this.getLogs({ level: 'ERROR' });
    return logs.slice(0, limit);
  }

  async getServiceLogs(service: string, limit: number = 100): Promise<any[]> {
    const logs = await this.getLogs({ service });
    return logs.slice(0, limit);
  }

  async getUserLogs(userId: number, limit: number = 100): Promise<any[]> {
    const logs = await this.getLogs({ userId });
    return logs.slice(0, limit);
  }

  async getLogsByDateRange(startDate: string, endDate: string): Promise<any[]> {
    return this.getLogs({ startDate, endDate });
  }

  async getLogStatistics(): Promise<{
    totalLogs: number;
    errors: number;
    warnings: number;
    info: number;
    debug: number;
    services: { [key: string]: number };
    topErrors: { [key: string]: number };
  }> {
    const logs = await this.getLogs();
    
    const statistics = {
      totalLogs: logs.length,
      errors: logs.filter(log => log.level === 'ERROR').length,
      warnings: logs.filter(log => log.level === 'WARN').length,
      info: logs.filter(log => log.level === 'INFO').length,
      debug: logs.filter(log => log.level === 'DEBUG').length,
      services: {} as { [key: string]: number },
      topErrors: {} as { [key: string]: number }
    };

    // Contar por serviço
    logs.forEach(log => {
      if (log.service) {
        statistics.services[log.service] = (statistics.services[log.service] || 0) + 1;
      }
    });

    // Top erros
    logs
      .filter(log => log.level === 'ERROR' && log.message)
      .forEach(log => {
        const errorKey = `${log.service}.${log.method}: ${log.message}`;
        statistics.topErrors[errorKey] = (statistics.topErrors[errorKey] || 0) + 1;
      });

    return statistics;
  }

  async exportLogs(filter: LogFilter = {}, format: 'json' | 'csv' = 'json'): Promise<string> {
    const logs = await this.getLogs(filter);
    
    if (format === 'csv') {
      return this.convertToCSV(logs);
    }
    
    return JSON.stringify(logs, null, 2);
  }

  private convertToCSV(logs: any[]): string {
    if (logs.length === 0) return '';
    
    const headers = ['timestamp', 'level', 'service', 'method', 'userId', 'message', 'duration'];
    const csvRows = [headers.join(',')];
    
    logs.forEach(log => {
      const row = headers.map(header => {
        const value = log[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value || '';
      });
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }
}

// Função utilitária para visualizar logs no console
export async function viewLogs(filter: LogFilter = {}, limit: number = 50) {
  const viewer = new LogViewer();
  const logs = await viewer.getLogs(filter);
  
  console.log(`\n📊 Logs encontrados: ${logs.length}`);
  console.log('='.repeat(80));
  
  logs.slice(0, limit).forEach(log => {
    const timestamp = new Date(log.timestamp).toLocaleString();
    const level = log.level.padEnd(5);
    const service = (log.service || '').padEnd(15);
    const method = (log.method || '').padEnd(20);
    const userId = log.userId ? `[User:${log.userId}]` : '';
    const duration = log.duration ? `(${log.duration}ms)` : '';
    
    console.log(`${timestamp} | ${level} | ${service} | ${method} | ${userId} ${duration}`);
    console.log(`  ${log.message}`);
    
    if (log.error) {
      console.log(`  Error: ${log.error.message || log.error}`);
    }
    
    if (log.data) {
      console.log(`  Data: ${JSON.stringify(log.data)}`);
    }
    
    console.log('-'.repeat(80));
  });
}

// Função para mostrar estatísticas
export async function showLogStatistics() {
  const viewer = new LogViewer();
  const stats = await viewer.getLogStatistics();
  
  console.log('\n📈 Estatísticas dos Logs');
  console.log('='.repeat(50));
  console.log(`Total de logs: ${stats.totalLogs}`);
  console.log(`Erros: ${stats.errors}`);
  console.log(`Warnings: ${stats.warnings}`);
  console.log(`Info: ${stats.info}`);
  console.log(`Debug: ${stats.debug}`);
  
  console.log('\n📊 Logs por Serviço:');
  Object.entries(stats.services)
    .sort(([,a], [,b]) => b - a)
    .forEach(([service, count]) => {
      console.log(`  ${service}: ${count}`);
    });
  
  if (Object.keys(stats.topErrors).length > 0) {
    console.log('\n🚨 Top Erros:');
    Object.entries(stats.topErrors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([error, count]) => {
        console.log(`  ${error}: ${count} vezes`);
      });
  }
} 