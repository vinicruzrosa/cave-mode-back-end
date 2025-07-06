import fastify from 'fastify';
import dotenv from 'dotenv';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import { authRoutes } from './routes/auth';
import { protectedRoutes } from './routes/protected';
import { alarmRoutes } from './routes/alarms';
import { routineRoutes } from './routes/routines';
import { blockedAppRoutes } from './routes/blockedApps';
import { goalRoutes } from './routes/goals';
import { userRoutes } from './routes/users';
import { swaggerSchemas, swaggerTags, swaggerSecuritySchemes } from './schemas/swagger';
import { errorLoggingMiddleware } from './middleware/errorLogger';

// Carregar variáveis de ambiente
dotenv.config();

const server = fastify({
  logger: true
});

// Configurar Swagger
server.register(swagger, {
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'Cave Mode API',
      description: `
## 🏔️ Cave Mode API

API RESTful para autenticação e gerenciamento de usuários construída com Fastify, Prisma e PostgreSQL.

### 🚀 Funcionalidades

- **Autenticação JWT**: Sistema completo de registro e login
- **Rotas Protegidas**: Endpoints que requerem autenticação
- **Validação de Dados**: Validação robusta com Zod
- **Documentação Interativa**: Swagger UI integrado
- **Testes Automatizados**: Suite completa de testes

### 🔐 Autenticação

Para acessar endpoints protegidos, inclua o token JWT no header:
\`\`\`
Authorization: Bearer <seu_token_jwt>
\`\`\`

### 📝 Exemplos de Uso

1. **Registrar usuário**:
   \`\`\`bash
   POST /api/auth/register
   {
     "email": "usuario@exemplo.com",
     "password": "minhasenha123"
   }
   \`\`\`

2. **Fazer login**:
   \`\`\`bash
   POST /api/auth/login
   {
     "email": "usuario@exemplo.com",
     "password": "minhasenha123"
   }
   \`\`\`

3. **Acessar rota protegida**:
   \`\`\`bash
   GET /api/protected/profile
   Authorization: Bearer <token>
   \`\`\`

### 🛠️ Tecnologias

- **Fastify**: Framework web rápido e eficiente
- **Prisma**: ORM moderno para banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens
- **Zod**: Validação de schemas TypeScript
- **Jest**: Framework de testes
      `,
      version: '1.0.0',
      contact: {
        name: 'Cave Mode Team',
        email: 'contact@cavemode.com',
        url: 'https://cavemode.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local server' }
    ],
    tags: swaggerTags,
    components: {
      securitySchemes: swaggerSecuritySchemes
    },
    security: [{ bearerAuth: [] }],
    externalDocs: {
      description: 'Documentação completa',
      url: 'https://docs.cavemode.com'
    }
  }
});

// Registrar plugin multipart para upload de arquivos
server.register(multipart);

// Registrar middleware de logging de erros
errorLoggingMiddleware(server);

// Configurar Swagger UI
server.register(swaggerUi, {
  routePrefix: '/docs'
});

// Registrar rotas
server.register(authRoutes, { prefix: '/api/auth' });
server.register(protectedRoutes, { prefix: '/api/protected' });
server.register(alarmRoutes, { prefix: '/api/alarms' });
server.register(routineRoutes, { prefix: '/api/routines' });
server.register(blockedAppRoutes, { prefix: '/api/blocked-apps' });
server.register(goalRoutes, { prefix: '/api/goals' });
server.register(userRoutes, { prefix: '/api/users' });

// Adicionar schemas ao Swagger
Object.values(swaggerSchemas).forEach(schema => {
  server.addSchema(schema);
});

// Rota de health check
server.get('/health', {
  schema: {
    tags: ['System'],
    summary: 'Verificar status da aplicação',
    description: 'Endpoint para verificar se a aplicação está funcionando corretamente',
    response: {
      200: {
        description: 'Aplicação funcionando normalmente',
        $ref: 'HealthResponse'
      }
    }
  }
}, async (request, reply) => {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  };
});

// Rota de informações da API
server.get('/api/info', {
  schema: {
    tags: ['System'],
    summary: 'Obter informações da API',
    description: 'Retorna informações sobre a versão e configuração da API',
    response: {
      200: {
        description: 'Informações da API',
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Cave Mode API' },
          version: { type: 'string', example: '1.0.0' },
          description: { type: 'string', example: 'API de autenticação e gerenciamento de usuários' },
          environment: { type: 'string', example: 'development' },
          documentation: { type: 'string', example: '/docs' }
        }
      }
    }
  }
}, async (request, reply) => {
  return {
    name: 'Cave Mode API',
    version: '1.0.0',
    description: 'API de autenticação e gerenciamento de usuários',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/docs'
  };
});

// Função para construir o servidor (usada em testes)
export const build = async () => {
  return server;
};

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    console.log(`🚀 Servidor rodando em http://${host}:${port}`);
    console.log(`📚 Documentação disponível em http://${host}:${port}/docs`);
    console.log(`🏥 Health check em http://${host}:${port}/health`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Só inicia o servidor se este arquivo for executado diretamente
if (require.main === module) {
  start();
} 