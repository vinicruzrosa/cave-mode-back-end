"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const auth_1 = require("./routes/auth");
const protected_1 = require("./routes/protected");
const swagger_2 = require("./schemas/swagger");
// Carregar variáveis de ambiente
dotenv_1.default.config();
const server = (0, fastify_1.default)({
    logger: true
});
// Configurar Swagger
server.register(swagger_1.default, {
    swagger: {
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
        host: process.env.HOST || 'localhost:3000',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: swagger_2.swaggerTags,
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'JWT token no formato: Bearer <token>'
            }
        },
        externalDocs: {
            description: 'Documentação completa',
            url: 'https://docs.cavemode.com'
        }
    }
});
// Configurar Swagger UI
server.register(swagger_ui_1.default, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
        displayOperationId: false,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        requestInterceptor: (request) => {
            // Adicionar headers padrão se necessário
            return request;
        },
        responseInterceptor: (response) => {
            // Processar resposta se necessário
            return response;
        }
    },
    uiHooks: {
        onRequest: function (request, reply, next) {
            next();
        },
        preHandler: function (request, reply, next) {
            next();
        }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
    },
    transformSpecificationClone: true
});
// Registrar rotas
server.register(auth_1.authRoutes, { prefix: '/api/auth' });
server.register(protected_1.protectedRoutes, { prefix: '/api/protected' });
// Adicionar schemas ao Swagger
server.addSchema(swagger_2.swaggerSchemas);
// Rota de health check
server.get('/health', {
    schema: {
        tags: ['System'],
        summary: 'Verificar status da aplicação',
        description: 'Endpoint para verificar se a aplicação está funcionando corretamente',
        response: {
            200: {
                description: 'Aplicação funcionando normalmente',
                $ref: '#/components/schemas/HealthResponse'
            }
        }
    }
}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    };
}));
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
}, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        name: 'Cave Mode API',
        version: '1.0.0',
        description: 'API de autenticação e gerenciamento de usuários',
        environment: process.env.NODE_ENV || 'development',
        documentation: '/docs'
    };
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const port = parseInt(process.env.PORT || '3000');
        const host = process.env.HOST || '0.0.0.0';
        yield server.listen({ port, host });
        console.log(`🚀 Servidor rodando em http://${host}:${port}`);
        console.log(`📚 Documentação disponível em http://${host}:${port}/docs`);
        console.log(`🏥 Health check em http://${host}:${port}/health`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
