#!/usr/bin/env ts-node

import { viewLogs, showLogStatistics, LogViewer } from '../src/utils/logViewer';

const viewer = new LogViewer();

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'stats':
      await showLogStatistics();
      break;

    case 'errors':
      const errorLimit = args[0] ? parseInt(args[0]) : 50;
      await viewLogs({ level: 'ERROR' }, errorLimit);
      break;

    case 'service':
      if (!args[0]) {
        console.log('Uso: npm run logs service <nome-do-servico> [limite]');
        process.exit(1);
      }
      const serviceLimit = args[1] ? parseInt(args[1]) : 50;
      await viewLogs({ service: args[0] }, serviceLimit);
      break;

    case 'user':
      if (!args[0]) {
        console.log('Uso: npm run logs user <user-id> [limite]');
        process.exit(1);
      }
      const userId = parseInt(args[0]);
      const userLimit = args[1] ? parseInt(args[1]) : 50;
      await viewLogs({ userId }, userLimit);
      break;

    case 'search':
      if (!args[0]) {
        console.log('Uso: npm run logs search <texto> [limite]');
        process.exit(1);
      }
      const searchLimit = args[1] ? parseInt(args[1]) : 50;
      await viewLogs({ search: args[0] }, searchLimit);
      break;

    case 'date':
      if (!args[0] || !args[1]) {
        console.log('Uso: npm run logs date <data-inicio> <data-fim> [limite]');
        console.log('Formato: YYYY-MM-DD');
        process.exit(1);
      }
      const dateLimit = args[2] ? parseInt(args[2]) : 50;
      await viewLogs({ startDate: args[0], endDate: args[1] }, dateLimit);
      break;

    case 'export':
      const format = args[0] === 'csv' ? 'csv' : 'json';
      const exportFilter = args[1] ? { level: args[1] } : {};
      const exportData = await viewer.exportLogs(exportFilter, format);
      console.log(exportData);
      break;

    case 'recent':
      const recentLimit = args[0] ? parseInt(args[0]) : 50;
      await viewLogs({}, recentLimit);
      break;

    case 'help':
    default:
      console.log(`
🔍 Sistema de Logs - Cave Mode Backend

Comandos disponíveis:

📊 stats                    - Mostrar estatísticas dos logs
🚨 errors [limite]         - Mostrar apenas erros (padrão: 50)
🔧 service <nome> [limite] - Logs de um serviço específico
👤 user <id> [limite]      - Logs de um usuário específico
🔍 search <texto> [limite] - Buscar por texto nos logs
📅 date <inicio> <fim>     - Logs por período (YYYY-MM-DD)
📤 export [csv|json] [level] - Exportar logs
🕒 recent [limite]         - Logs mais recentes (padrão: 50)

Exemplos:
  npm run logs stats
  npm run logs errors 20
  npm run logs service AlarmService
  npm run logs user 123
  npm run logs search "not found"
  npm run logs date 2024-01-01 2024-01-31
  npm run logs export csv ERROR
  npm run logs recent 100
      `);
      break;
  }
}

main().catch(console.error); 