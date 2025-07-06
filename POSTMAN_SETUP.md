# 🚀 Configuração do Postman para Cave Mode API

Este guia explica como configurar e usar a coleção do Postman para testar a API do Cave Mode.

## 📁 Arquivos

- `cave-mode-api.postman_collection.json` - Coleção com todos os endpoints
- `cave-mode-api.postman_environment.json` - Ambiente com variáveis

## 🔧 Configuração Inicial

### 1. Importar a Coleção
1. Abra o Postman
2. Clique em "Import" (botão no canto superior esquerdo)
3. Arraste o arquivo `cave-mode-api.postman_collection.json` ou clique em "Upload Files"
4. Clique em "Import"

### 2. Importar o Ambiente
1. Clique em "Import" novamente
2. Arraste o arquivo `cave-mode-api.postman_environment.json`
3. Clique em "Import"

### 3. Selecionar o Ambiente
1. No canto superior direito, clique no dropdown de ambiente
2. Selecione "Cave Mode - Local Environment"

## 🔑 Como Usar

### Passo 1: Registrar um Usuário
1. Vá para a pasta "Autenticação"
2. Execute "Registrar Usuário"
3. Use um email e senha de sua escolha

### Passo 2: Fazer Login
1. Execute "Fazer Login" com as mesmas credenciais
2. **IMPORTANTE**: Copie o token da resposta
3. Vá em "Environments" → "Cave Mode - Local Environment"
4. Cole o token na variável `auth_token`

### Passo 3: Testar os Endpoints
Agora você pode testar todos os endpoints de alarmes, rotinas, metas, etc.

## 📋 Endpoints Disponíveis

### 🔐 Autenticação
- **POST** `/api/auth/register` - Registrar usuário
- **POST** `/api/auth/login` - Fazer login

### ⏰ Alarmes
- **POST** `/api/alarms` - Criar alarme
- **GET** `/api/alarms` - Listar todos os alarmes
- **GET** `/api/alarms/active` - Listar alarmes ativos
- **PUT** `/api/alarms/:id` - Atualizar alarme
- **DELETE** `/api/alarms/:id` - Deletar alarme
- **POST** `/api/alarms/:id/selfie` - Upload de selfie
- **GET** `/api/alarms/:id/selfies` - Listar selfies

### 👤 Usuários
- **GET** `/api/users/profile` - Obter perfil
- **PUT** `/api/users/safe-mode` - Atualizar safe mode
- **GET** `/api/users/safe-mode` - Obter status do safe mode

### 📅 Rotinas
- **POST** `/api/routines` - Criar rotina
- **GET** `/api/routines` - Listar rotinas

### 🎯 Metas
- **POST** `/api/goals` - Criar meta
- **GET** `/api/goals` - Listar metas

### 📱 Apps Bloqueados
- **POST** `/api/blocked-apps` - Bloquear app
- **GET** `/api/blocked-apps` - Listar apps bloqueados

## 🔄 Fluxo de Teste Recomendado

### 1. Teste de Alarme Completo
```bash
1. Registrar Usuário
2. Fazer Login (copiar token)
3. Criar Alarme
4. Listar Alarmes (verificar se foi criado)
5. Atualizar Alarme
6. Deletar Alarme
```

### 2. Exemplo de Dados para Criar Alarme
```json
{
  "time": "2025-07-06T20:00:00.000Z",
  "repeat": "daily"
}
```

**Opções de `repeat`:**
- `"once"` - Uma vez
- `"daily"` - Diário
- `"weekly"` - Semanal

## 🛠️ Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `base_url` | URL base da API | `http://localhost:3000` |
| `auth_token` | Token JWT de autenticação | `eyJhbGciOiJIUzI1NiIs...` |
| `alarm_id` | ID do alarme para testes | `5` |
| `user_id` | ID do usuário | `4` |
| `routine_id` | ID da rotina | `1` |
| `goal_id` | ID da meta | `1` |
| `blocked_app_id` | ID do app bloqueado | `1` |

## 🚨 Troubleshooting

### Erro 401 - Unauthorized
- Verifique se o token está correto na variável `auth_token`
- Certifique-se de que fez login antes de testar endpoints protegidos

### Erro 404 - Not Found
- Verifique se o servidor está rodando em `http://localhost:3000`
- Execute: `doppler run -- npm run dev`

### Erro de Conexão
- Verifique se o servidor está rodando
- Confirme se a URL base está correta

## 📝 Exemplos de Uso

### Criar Alarme para Amanhã às 8h
```json
{
  "time": "2025-07-07T08:00:00.000Z",
  "repeat": "daily"
}
```

### Criar Rotina da Manhã
```json
{
  "title": "Rotina da Manhã",
  "startTime": "2025-07-06T06:00:00.000Z",
  "endTime": "2025-07-06T08:00:00.000Z"
}
```

### Bloquear Instagram por 1 hora
```json
{
  "appName": "Instagram",
  "type": "temporary",
  "duration": 60
}
```

## 🎯 Dicas

1. **Sempre faça login primeiro** antes de testar endpoints protegidos
2. **Copie o token** da resposta do login para a variável `auth_token`
3. **Use IDs válidos** nas variáveis quando testar endpoints que precisam de IDs
4. **Teste o fluxo completo** para garantir que tudo está funcionando

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o servidor está rodando
2. Confirme se as variáveis de ambiente estão configuradas
3. Teste primeiro os endpoints de autenticação
4. Verifique os logs do servidor para erros detalhados 