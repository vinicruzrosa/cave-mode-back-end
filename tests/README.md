# Testes Unitários - Cave Mode Backend

Este diretório contém todos os testes unitários e de integração para o sistema de alarme com selfie do Cave Mode.

## Estrutura dos Testes

```
tests/
├── README.md                    # Esta documentação
├── setup.ts                     # Configuração global dos testes
├── repositories/
│   └── alarm.repository.test.ts # Testes do repositório de alarmes
├── services/
│   └── alarm.service.test.ts    # Testes do serviço de alarmes
├── controllers/
│   └── alarm.controller.test.ts # Testes do controller de alarmes
├── schemas/
│   └── alarm.test.ts            # Testes dos schemas de validação
├── middleware/
│   └── auth.test.ts             # Testes do middleware de autenticação
├── routes/
│   └── alarms.test.ts           # Testes das rotas de alarme
├── integration/
│   └── alarm-integration.test.ts # Testes de integração
└── utils/
    ├── jwt.test.ts              # Testes das utilidades JWT
    ├── password.test.ts         # Testes das utilidades de senha
    └── test-utils.ts            # Utilitários para testes
```

## Tipos de Teste

### 1. Testes Unitários
- **Repositories**: Testam a camada de acesso a dados
- **Services**: Testam a lógica de negócio
- **Controllers**: Testam a camada de apresentação
- **Schemas**: Testam a validação de dados
- **Middleware**: Testam os middlewares de autenticação
- **Utils**: Testam as funções utilitárias

### 2. Testes de Integração
- **Routes**: Testam as rotas HTTP completas
- **Integration**: Testam fluxos completos do sistema

## Executando os Testes

### Todos os Testes
```bash
npm test
```

### Testes Específicos
```bash
# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Apenas testes de rotas
npm run test:routes

# Apenas testes relacionados a alarmes
npm run test:alarm
```

### Modo Watch (desenvolvimento)
```bash
npm run test:watch
```

### Com Cobertura
```bash
npm run test:coverage
```

## Configuração

### Jest Configuration
O Jest está configurado em `jest.config.js` com:
- Suporte a TypeScript
- Mocks automáticos para módulos
- Configuração de cobertura
- Timeout adequado para testes assíncronos

### Setup Global
O arquivo `tests/setup.ts` configura:
- Variáveis de ambiente para teste
- Mocks globais
- Configurações do banco de dados de teste

## Estrutura dos Testes

### Padrão AAA (Arrange, Act, Assert)
Todos os testes seguem o padrão AAA:

```typescript
describe('AlarmService', () => {
  describe('createAlarm', () => {
    it('should create alarm successfully', async () => {
      // Arrange - Preparar dados e mocks
      const mockAlarm = { /* ... */ };
      mockRepository.create.mockResolvedValue(mockAlarm);

      // Act - Executar a ação
      const result = await service.createAlarm(userId, alarmData);

      // Assert - Verificar resultados
      expect(result).toEqual(expectedResult);
      expect(mockRepository.create).toHaveBeenCalledWith(expectedParams);
    });
  });
});
```

### Mocks
- **Repositories**: Mockados para isolar a lógica de negócio
- **External Services**: Sharp, fs, path mockados
- **Database**: Prisma mockado nos testes unitários

### Fixtures e Helpers
- Dados de teste reutilizáveis
- Funções helper para criar objetos de teste
- Mocks padronizados

## Cobertura de Testes

### Métricas Alvo
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

### Pontos Críticos
- Validação de dados
- Lógica de negócio
- Tratamento de erros
- Autenticação e autorização
- Upload de arquivos

## Casos de Teste

### AlarmRepository
- ✅ Criar alarme
- ✅ Buscar alarme por ID
- ✅ Buscar alarmes por usuário
- ✅ Buscar alarmes ativos
- ✅ Atualizar alarme
- ✅ Deletar alarme
- ✅ Criar selfie
- ✅ Buscar selfies por alarme

### AlarmService
- ✅ Criar alarme com validação de tempo
- ✅ Rejeitar alarme com tempo passado
- ✅ Listar alarmes do usuário
- ✅ Atualizar alarme com validações
- ✅ Deletar alarme com verificação de propriedade
- ✅ Processar selfie com análise de brilho
- ✅ Rejeitar selfie com iluminação insuficiente
- ✅ Verificar alarme ativo antes de processar selfie

### AlarmController
- ✅ Criar alarme via HTTP
- ✅ Listar alarmes via HTTP
- ✅ Atualizar alarme via HTTP
- ✅ Deletar alarme via HTTP
- ✅ Upload de selfie via HTTP
- ✅ Tratamento de erros de validação
- ✅ Tratamento de erros de autenticação

### Schemas
- ✅ Validação de dados de criação
- ✅ Validação de dados de atualização
- ✅ Rejeição de dados inválidos
- ✅ Aceitação de dados válidos
- ✅ Validação de enum de repetição

### Middleware Auth
- ✅ Autenticação com token válido
- ✅ Rejeição sem header de autorização
- ✅ Rejeição com formato inválido
- ✅ Rejeição com token inválido
- ✅ Tratamento de casos extremos

### Rotas
- ✅ Endpoints completos
- ✅ Integração com banco de dados
- ✅ Autenticação real
- ✅ Upload de arquivos
- ✅ Validação de dados

## Boas Práticas

### 1. Nomenclatura
- Descreva o comportamento esperado
- Use padrão "should..." para descrições
- Agrupe testes relacionados em `describe`

### 2. Isolamento
- Cada teste deve ser independente
- Limpe dados entre testes
- Use mocks para dependências externas

### 3. Assertions
- Teste um comportamento por vez
- Use assertions específicas
- Verifique chamadas de mocks

### 4. Dados de Teste
- Use dados realistas
- Evite dados mágicos
- Crie fixtures reutilizáveis

## Debugging

### Executar Teste Específico
```bash
npm test -- --testNamePattern="should create alarm successfully"
```

### Verbose Output
```bash
npm test -- --verbose
```

### Debug com Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## CI/CD

### Pipeline de Testes
1. **Lint**: Verificar código
2. **Unit Tests**: Testes unitários
3. **Integration Tests**: Testes de integração
4. **Coverage**: Relatório de cobertura

### Configuração GitHub Actions
```yaml
- name: Run Tests
  run: npm run test:ci
```

## Troubleshooting

### Problemas Comuns

#### 1. Timeout em Testes
- Aumentar timeout no Jest config
- Verificar mocks assíncronos
- Usar `done()` callback quando necessário

#### 2. Mocks Não Funcionando
- Verificar ordem de imports
- Usar `jest.resetModules()`
- Verificar configuração de mocks

#### 3. Banco de Dados
- Usar banco de teste separado
- Limpar dados entre testes
- Usar transações quando possível

### Logs de Debug
```bash
DEBUG=* npm test
```

## Contribuindo

### Adicionando Novos Testes
1. Crie arquivo de teste seguindo a nomenclatura
2. Use padrão AAA
3. Adicione casos de teste abrangentes
4. Documente casos especiais

### Mantendo Testes
- Execute testes regularmente
- Mantenha mocks atualizados
- Refatore quando necessário
- Mantenha cobertura alta

## Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Fastify Testing](https://www.fastify.io/docs/latest/Guides/Testing/)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing/unit-testing) 