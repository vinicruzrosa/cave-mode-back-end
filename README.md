# 🏔️ Cave Mode API

API RESTful para autenticação e gerenciamento de usuários construída com Fastify, Prisma e PostgreSQL.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema completo de registro e login
- **Rotas Protegidas**: Endpoints que requerem autenticação
- **Alarmes com Selfie**: Sistema de alarme que só desativa com foto em luz natural
- **Verificação de Luz Natural**: Análise automática de brilho em imagens
- **Validação de Dados**: Validação robusta com Zod
- **Documentação Interativa**: Swagger UI integrado
- **Testes Automatizados**: Suite completa de testes
- **Banco de Dados**: PostgreSQL com Prisma ORM

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI:

- **URL**: `http://localhost:3000/docs`
- **Especificação OpenAPI**: `http://localhost:3000/docs/json`

### 🔐 Autenticação

Para acessar endpoints protegidos, inclua o token JWT no header:
```
Authorization: Bearer <seu_token_jwt>
```

### 📝 Exemplos de Uso

1. **Registrar usuário**:
   ```bash
   POST /api/auth/register
   {
     "email": "usuario@exemplo.com",
     "password": "minhasenha123"
   }
   ```

2. **Fazer login**:
   ```bash
   POST /api/auth/login
   {
     "email": "usuario@exemplo.com",
     "password": "minhasenha123"
   }
   ```

3. **Acessar rota protegida**:
   ```bash
   GET /api/protected/profile
   Authorization: Bearer <token>
   ```

## 🛠️ Tecnologias

- **Fastify**: Framework web rápido e eficiente
- **Prisma**: ORM moderno para banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens
- **Zod**: Validação de schemas TypeScript
- **Jest**: Framework de testes
- **Swagger**: Documentação da API

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd cave-mode-back-end
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/cave_mode"
   JWT_SECRET="seu_jwt_secret_aqui"
   NODE_ENV="development"
   PORT=3000
   HOST=localhost
   ```

4. **Configure o banco de dados**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Execute as migrações**:
   ```bash
   npx prisma migrate dev
   ```

## 🚀 Executando a aplicação

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

### Executar testes em CI
```bash
npm run test:ci
```

## 📖 Endpoints da API

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/register` | Registrar novo usuário |
| POST | `/login` | Fazer login |

### Rotas Protegidas (`/api/protected`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/profile` | Obter perfil do usuário |
| GET | `/dashboard` | Obter dashboard do usuário |

### Alarmes (`/api/alarms`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/` | Criar novo alarme |
| GET | `/` | Listar todos os alarmes |
| GET | `/active` | Listar alarmes ativos |
| PUT | `/:id` | Atualizar alarme |
| DELETE | `/:id` | Deletar alarme |
| POST | `/:id/selfie` | Upload de selfie para desativar |
| GET | `/:id/selfies` | Listar selfies de um alarme |

### Sistema

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Verificar status da aplicação |
| GET | `/api/info` | Obter informações da API |
| GET | `/docs` | Documentação Swagger |

## 📊 Schemas da API

### RegisterRequest
```json
{
  "email": "string (email válido)",
  "password": "string (mínimo 6 caracteres)"
}
```

### LoginRequest
```json
{
  "email": "string (email válido)",
  "password": "string"
}
```

### AuthResponse
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "number",
    "email": "string",
    "createdAt": "string (ISO date)"
  }
}
```

### ErrorResponse
```json
{
  "error": "string",
  "code": "string (opcional)",
  "details": "object (opcional)"
}
```

## 🔒 Segurança

- **Senhas**: Criptografadas com bcrypt
- **Tokens JWT**: Válidos por 24 horas
- **Validação**: Todos os dados de entrada são validados com Zod
- **Headers**: CORS configurado adequadamente

## 📝 Exemplos de Uso

Veja o arquivo `examples/auth-examples.http` para exemplos completos de uso da API.

## 🏗️ Estrutura do Projeto

```
src/
├── middleware/          # Middlewares (auth, etc.)
├── routes/             # Rotas da API
├── schemas/            # Schemas de validação e Swagger
├── types/              # Tipos TypeScript
├── utils/              # Utilitários (JWT, password)
└── server.ts           # Arquivo principal do servidor

tests/
├── integration/        # Testes de integração
├── middleware/         # Testes de middleware
├── routes/             # Testes de rotas
├── schemas/            # Testes de schemas
└── utils/              # Testes de utilitários
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email**: contact@cavemode.com
- **Documentação**: https://docs.cavemode.com
- **Issues**: Use o GitHub Issues para reportar bugs ou solicitar features

## 🔄 Changelog

### v1.0.0
- ✅ Sistema completo de autenticação JWT
- ✅ Rotas protegidas
- ✅ Validação de dados com Zod
- ✅ Documentação Swagger completa
- ✅ Suite de testes automatizados
- ✅ Integração com PostgreSQL via Prisma
- ✅ Middleware de autenticação
- ✅ Endpoints de sistema (health check, info)
- ✅ Exemplos de uso e documentação 