# 📊 Sistema de Logs - Cave Mode Backend

Este documento descreve o sistema de logging implementado para trace de erros e monitoramento da aplicação.

## 🎯 Objetivo

O sistema de logs foi implementado para:
- **Trace de erros**: Identificar exatamente onde e por que os erros ocorrem
- **Monitoramento**: Acompanhar o desempenho e comportamento da aplicação
- **Debugging**: Facilitar a identificação e correção de problemas
- **Auditoria**: Registrar todas as operações importantes

## 🏗️ Arquitetura

### Estrutura de Logs

Cada entrada de log contém:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "service": "AlarmService",
  "method": "createAlarm",
  "userId": 123,
  "message": "Alarm created successfully",
  "data": { "alarmId": 456, "time": "2024-01-15T11:00:00.000Z" },
  "duration": 150,
  "error": null,
  "trace": null
}
```

### Níveis de Log

- **DEBUG**: Informações detalhadas para debugging
- **INFO**: Informações gerais sobre operações
- **WARN**: Avisos sobre situações que podem ser problemáticas
- **ERROR**: Erros que não impedem a execução
- **FATAL**: Erros críticos que podem afetar a aplicação

### Serviços Monitorados

- `UserService`: Operações de usuário
- `AlarmService`: Gerenciamento de alarmes
- `GoalService`: Gerenciamento de metas
- `BlockedAppService`: Controle de apps bloqueados
- `RoutineService`: Gerenciamento de rotinas
- `ErrorMiddleware`: Erros de requisições HTTP

## 📁 Estrutura de Arquivos

```
src/
├── utils/
│   ├── logger.ts          # Sistema principal de logging
│   └── logViewer.ts       # Visualizador e filtros de logs
├── middleware/
│   └── errorLogger.ts     # Middleware para logs de HTTP
└── services/
    ├── user.service.ts    # Logs integrados
    ├── alarm.service.ts   # Logs integrados
    ├── goal.service.ts    # Logs integrados
    ├── blockedApp.service.ts # Logs integrados
    └── routine.service.ts # Logs integrados

logs/                      # Diretório de logs (criado automaticamente)
├── 2024-01-15.log        # Logs do dia
├── 2024-01-16.log        # Logs do dia
└── ...

scripts/
└── logs.ts               # Script para visualizar logs
```

## 🚀 Como Usar

### 1. Visualizar Logs

```bash
# Mostrar estatísticas
npm run logs stats

# Ver apenas erros
npm run logs errors 20

# Logs de um serviço específico
npm run logs service AlarmService

# Logs de um usuário específico
npm run logs user 123

# Buscar por texto
npm run logs search "not found"

# Logs por período
npm run logs date 2024-01-01 2024-01-31

# Exportar logs
npm run logs export csv ERROR

# Logs mais recentes
npm run logs recent 100
```

### 2. Programaticamente

```typescript
import { LogViewer } from './src/utils/logViewer';

const viewer = new LogViewer();

// Obter logs com filtros
const errorLogs = await viewer.getErrorLogs(50);
const userLogs = await viewer.getUserLogs(123);
const serviceLogs = await viewer.getServiceLogs('AlarmService');

// Estatísticas
const stats = await viewer.getLogStatistics();

// Exportar
const csvData = await viewer.exportLogs({ level: 'ERROR' }, 'csv');
```

## 🔧 Configuração

### Níveis de Log por Ambiente

```typescript
// Desenvolvimento: Todos os níveis
const devLogger = new Logger('ServiceName', LogLevel.DEBUG);

// Produção: Apenas INFO e acima
const prodLogger = new Logger('ServiceName', LogLevel.INFO);
```

### Personalização

```typescript
import { Logger, LogLevel } from '../utils/logger';

// Criar logger personalizado
const customLogger = new Logger('CustomService', LogLevel.DEBUG);

// Usar em operações
await customLogger.info('methodName', 'Operação iniciada', { data: 'value' });
await customLogger.error('methodName', 'Erro ocorreu', error, { context: 'data' });
```

## 📊 Métricas e Monitoramento

### Estatísticas Disponíveis

- **Total de logs**: Número total de entradas
- **Distribuição por nível**: DEBUG, INFO, WARN, ERROR, FATAL
- **Logs por serviço**: Quantidade de logs por cada serviço
- **Top erros**: Erros mais frequentes
- **Performance**: Duração das operações

### Exemplo de Saída

```
📈 Estatísticas dos Logs
==================================================
Total de logs: 1,234
Erros: 45
Warnings: 12
Info: 1,150
Debug: 27

📊 Logs por Serviço:
  AlarmService: 456
  UserService: 234
  GoalService: 189
  BlockedAppService: 156
  RoutineService: 123
  ErrorMiddleware: 76

🚨 Top Erros:
  AlarmService.createAlarm: User not found: 15 vezes
  GoalService.updateGoal: Goal not found: 8 vezes
  UserService.updateSafeMode: User not found: 6 vezes
```

## 🛠️ Manutenção

### Limpeza de Logs

Os logs são organizados por data e podem ser limpos manualmente:

```bash
# Remover logs antigos (mais de 30 dias)
find logs/ -name "*.log" -mtime +30 -delete
```

### Backup

```bash
# Fazer backup dos logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/
```

### Monitoramento Automático

Para monitoramento contínuo, considere:

1. **Alertas**: Configurar alertas para erros críticos
2. **Dashboards**: Usar ferramentas como Grafana ou Kibana
3. **Retenção**: Definir política de retenção de logs
4. **Análise**: Implementar análise automática de padrões

## 🔍 Debugging

### Identificar Problemas

1. **Erros frequentes**: `npm run logs errors`
2. **Performance**: Verificar duração das operações
3. **Usuários específicos**: `npm run logs user <id>`
4. **Períodos**: `npm run logs date <inicio> <fim>`

### Exemplo de Debug

```bash
# Ver erros recentes
npm run logs errors 10

# Ver logs de um usuário com problemas
npm run logs user 123

# Buscar por um erro específico
npm run logs search "database connection"

# Ver performance de um serviço
npm run logs service AlarmService
```

## 📝 Boas Práticas

### 1. Mensagens Descritivas

```typescript
// ❌ Ruim
await logger.error('method', 'Error occurred');

// ✅ Bom
await logger.error('createAlarm', 'Failed to create alarm: invalid time format', error, { 
  userId, 
  time: data.time 
});
```

### 2. Contexto Adequado

```typescript
// Sempre incluir contexto relevante
await logger.info('updateGoal', 'Goal updated successfully', {
  userId,
  goalId,
  updatedFields: Object.keys(data),
  previousStatus: goal.completed
});
```

### 3. Medição de Performance

```typescript
// Usar timeOperation para operações importantes
return logger.timeOperation(
  'processSelfie',
  async () => { /* operação */ },
  'Process selfie for alarm',
  userId,
  { alarmId, imageSize }
);
```

### 4. Tratamento de Erros

```typescript
try {
  // operação
} catch (error) {
  await logger.error('methodName', 'Operation failed', error, { context });
  throw error; // Re-throw para manter o fluxo de erro
}
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Logs não aparecem**: Verificar permissões do diretório `logs/`
2. **Performance lenta**: Verificar se há muitos logs sendo escritos
3. **Erro de disco**: Implementar rotação de logs
4. **Logs duplicados**: Verificar se há múltiplas instâncias do logger

### Soluções

```bash
# Verificar permissões
ls -la logs/

# Limpar logs antigos
npm run logs stats

# Verificar espaço em disco
df -h logs/
```

## 📚 Referências

- [Fastify Hooks](https://www.fastify.io/docs/latest/Reference/Hooks/)
- [Node.js File System](https://nodejs.org/api/fs.html)
- [JSON Logging Best Practices](https://www.loggly.com/blog/json-logging-best-practices/) 