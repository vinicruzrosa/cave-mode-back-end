# 🎨 Prompt para Uizard - Cave Mode UI/UX

## 📱 Aplicativo Mobile: Cave Mode

Crie um aplicativo mobile moderno e intuitivo para o **Cave Mode** - um sistema de produtividade e foco que ajuda usuários a manterem rotinas saudáveis, gerenciar alarmes inteligentes, definir metas e controlar o uso de aplicativos.

---

## 🎯 **CONCEITO E IDENTIDADE VISUAL**

### **Tema e Estilo**
- **Paleta de cores**: Tons escuros e profundos (preto, cinza escuro, azul marinho)
- **Acentos**: Verde esmeralda (#10B981), laranja âmbar (#F59E0B), azul ciano (#06B6D4)
- **Estilo**: Minimalista, moderno, com elementos de "caverna" (texturas sutis, gradientes escuros)
- **Tipografia**: Sans-serif moderna, legível em telas pequenas
- **Ícones**: Line icons, minimalistas, com peso médio

### **Mood Board**
- Interface escura como uma caverna
- Elementos que lembram rochas e minerais
- Iluminação sutil e focada
- Sensação de proteção e foco
- Design clean e sem distrações

---

## 🏗️ **ARQUITETURA DE TELAS**

### **1. TELAS DE AUTENTICAÇÃO**
#### **1.1 Splash Screen**
- Logo Cave Mode centralizado
- Animação de carregamento sutil
- Fundo gradiente escuro

#### **1.2 Login Screen**
- Campo de email
- Campo de senha
- Botão "Entrar" (verde esmeralda)
- Link "Esqueci minha senha"
- Link "Criar conta"
- Opção "Lembrar de mim"

#### **1.3 Register Screen**
- Campo de nome completo
- Campo de email
- Campo de senha
- Campo de confirmar senha
- Checkbox "Aceito os termos"
- Botão "Criar conta"
- Link "Já tenho conta"

---

### **2. TELA PRINCIPAL (DASHBOARD)**
#### **2.1 Home Screen**
- **Header**: Avatar do usuário, nome, toggle Safe Mode
- **Cards principais**:
  - Card "Alarme Ativo" (laranja se ativo, cinza se inativo)
  - Card "Meta do Dia" (progresso visual)
  - Card "Rotina Atual" (se houver)
  - Card "Apps Bloqueados" (contador)
- **Quick Actions**:
  - Botão "Criar Alarme"
  - Botão "Nova Meta"
  - Botão "Adicionar App"
- **Estatísticas rápidas**:
  - Metas completadas hoje
  - Tempo focado
  - Apps bloqueados ativos

---

### **3. MÓDULO DE ALARMES**
#### **3.1 Alarms List Screen**
- **Header**: Título "Meus Alarmes", botão "+" para adicionar
- **Lista de alarmes**:
  - Horário grande e destacado
  - Status (ativo/inativo) com toggle
  - Tipo de repetição (uma vez, diário, semanal)
  - Botão de editar e deletar
- **Filtros**: Todos, Ativos, Inativos
- **Empty state**: Ilustração + "Nenhum alarme criado"

#### **3.2 Create/Edit Alarm Screen**
- **Formulário**:
  - Campo "Título do alarme" (opcional)
  - Seletor de horário (time picker)
  - Seletor de repetição (radio buttons)
  - Toggle "Ativar imediatamente"
- **Preview**: Como o alarme aparecerá
- **Botões**: Cancelar, Salvar

#### **3.3 Alarm Ring Screen**
- **Tela cheia** com fundo escuro
- **Horário atual** grande
- **Mensagem**: "Hora de acordar! Tire uma selfie com luz natural"
- **Botão câmera** grande e destacado
- **Botão "Soneca"** (se permitido)
- **Botão "Desativar"**

#### **3.4 Selfie Camera Screen**
- **Viewfinder** da câmera
- **Overlay** com instruções
- **Indicador de luz** (barra de progresso)
- **Botão "Tirar foto"**
- **Botão "Voltar"**

#### **3.5 Selfie Result Screen**
- **Foto tirada** em destaque
- **Resultado da análise**:
  - ✅ "Luz natural aprovada!" (verde)
  - ❌ "Precisa de mais luz natural" (laranja)
- **Métrica de brilho** (0-255)
- **Botão "Tentar novamente"**
- **Botão "Confirmar"** (se aprovado)

---

### **4. MÓDULO DE METAS**
#### **4.1 Goals List Screen**
- **Header**: Título "Minhas Metas", botão "+" para adicionar
- **Filtros**: Todas, Pendentes, Completadas
- **Lista de metas**:
  - Título da meta
  - Status (checkbox)
  - Data de criação
  - Botão de editar e deletar
- **Estatísticas**: Total, Completadas, Pendentes

#### **4.2 Create/Edit Goal Screen**
- **Formulário**:
  - Campo "Título da meta"
  - Campo "Descrição" (opcional)
  - Seletor de categoria (opcional)
- **Botões**: Cancelar, Salvar

#### **4.3 Goals Statistics Screen**
- **Cards de estatísticas**:
  - Total de metas
  - Taxa de conclusão
  - Metas da semana
  - Metas do mês
- **Gráficos**:
  - Progresso semanal
  - Distribuição por categoria
- **Lista de metas recentes**

---

### **5. MÓDULO DE APPS BLOQUEADOS**
#### **5.1 Blocked Apps List Screen**
- **Header**: Título "Apps Bloqueados", botão "+" para adicionar
- **Lista de apps**:
  - Ícone do app
  - Nome do app
  - Tipo de bloqueio (permanente/temporário)
  - Status (ativo/expirado)
  - Botão de desbloquear
- **Filtros**: Todos, Permanentes, Temporários

#### **5.2 Add Blocked App Screen**
- **Busca de apps**:
  - Campo de busca
  - Lista de apps populares
  - Apps recentes
- **Configuração do bloqueio**:
  - Tipo (permanente/temporário)
  - Duração (se temporário)
  - Horário de início
- **Botões**: Cancelar, Bloquear

#### **5.3 Block Statistics Screen**
- **Cards de estatísticas**:
  - Total de apps bloqueados
  - Bloqueios permanentes
  - Bloqueios temporários
  - Tempo economizado
- **Gráficos**:
  - Apps mais bloqueados
  - Tempo de uso economizado

---

### **6. MÓDULO DE ROTINAS**
#### **6.1 Routines List Screen**
- **Header**: Título "Minhas Rotinas", botão "+" para adicionar
- **Rotina atual** (se houver):
  - Card destacado
  - Progresso do tempo
  - Botão "Pausar/Retomar"
- **Lista de rotinas**:
  - Título
  - Horário de início e fim
  - Status (ativa/inativa)
  - Botão de editar e deletar

#### **6.2 Create/Edit Routine Screen**
- **Formulário**:
  - Campo "Título da rotina"
  - Seletor de horário de início
  - Seletor de horário de fim
  - Dias da semana (checkboxes)
- **Preview**: Como a rotina aparecerá
- **Botões**: Cancelar, Salvar

---

### **7. MÓDULO DE PERFIL**
#### **7.1 Profile Screen**
- **Informações do usuário**:
  - Avatar (editável)
  - Nome completo
  - Email
  - Data de cadastro
- **Configurações**:
  - Toggle Safe Mode
  - Notificações
  - Privacidade
  - Idioma
- **Estatísticas gerais**:
  - Total de alarmes
  - Metas completadas
  - Tempo focado
  - Apps bloqueados

#### **7.2 Settings Screen**
- **Seções**:
  - Notificações
  - Privacidade
  - Segurança
  - Aparência
  - Sobre
- **Botão "Sair"** (vermelho)

---

## 🎨 **ELEMENTOS DE DESIGN**

### **Componentes Reutilizáveis**
- **Cards**: Bordas arredondadas, sombra sutil, padding consistente
- **Botões**: 
  - Primário (verde esmeralda)
  - Secundário (cinza)
  - Perigo (vermelho)
  - Texto (sem fundo)
- **Inputs**: Bordas arredondadas, placeholder claro, validação visual
- **Toggles**: Animação suave, cores consistentes
- **Modais**: Fundo escuro, animação de entrada

### **Navegação**
- **Bottom Tab Bar**: 5 ícones principais
  - Home (casa)
  - Alarmes (despertador)
  - Metas (checklist)
  - Apps (smartphone)
  - Perfil (usuário)
- **Header**: Título da tela, botões de ação
- **Back Button**: Consistente em todas as telas

### **Estados**
- **Loading**: Spinner sutil, skeleton screens
- **Empty**: Ilustrações, mensagens motivacionais
- **Error**: Mensagens claras, botão de retry
- **Success**: Feedback visual, animações

---

## 📱 **ESPECIFICAÇÕES TÉCNICAS**

### **Resoluções**
- **Mobile**: 375x812px (iPhone X)
- **Tablet**: 768x1024px (iPad)

### **Interações**
- **Gestos**: Swipe para deletar, pull to refresh
- **Animações**: Transições suaves (300ms)
- **Feedback**: Haptic feedback, sons sutis
- **Acessibilidade**: Labels, contraste adequado

### **Performance**
- **Carregamento**: Lazy loading, cache de imagens
- **Offline**: Funcionalidades básicas offline
- **Sincronização**: Sync automático quando online

---

## 🎯 **FLUXOS PRINCIPAIS**

### **Fluxo 1: Criar e Gerenciar Alarme**
1. Usuário toca "+" na tela de alarmes
2. Preenche horário e repetição
3. Salva o alarme
4. Alarme aparece na lista
5. Quando toca, abre tela de selfie
6. Tira foto e recebe feedback
7. Alarme é desativado se aprovado

### **Fluxo 2: Definir e Completar Meta**
1. Usuário toca "+" na tela de metas
2. Digita título da meta
3. Meta aparece na lista
4. Marca como completa
5. Estatísticas são atualizadas

### **Fluxo 3: Bloquear App**
1. Usuário toca "+" na tela de apps
2. Busca e seleciona app
3. Define tipo e duração do bloqueio
4. App é bloqueado
5. Aparece na lista de bloqueados

---

## 🎨 **INSPIRAÇÕES**

### **Apps de Referência**
- **Forest**: Para o conceito de foco e gamificação
- **Sleep Cycle**: Para alarmes inteligentes
- **Habitify**: Para tracking de hábitos
- **Freedom**: Para bloqueio de apps
- **Notion**: Para interface limpa e organizada

### **Estilos Visuais**
- **Dark mode** como padrão
- **Gradientes sutis** para profundidade
- **Micro-interações** para feedback
- **Tipografia hierárquica** clara
- **Espaçamento generoso** para respiração

---

## 📋 **CHECKLIST DE ENTREGÁVEIS**

### **Telas Principais**
- [ ] Splash Screen
- [ ] Login/Register
- [ ] Dashboard (Home)
- [ ] Lista de Alarmes
- [ ] Criar/Editar Alarme
- [ ] Tela de Alarme Tocando
- [ ] Câmera de Selfie
- [ ] Resultado da Selfie
- [ ] Lista de Metas
- [ ] Criar/Editar Meta
- [ ] Estatísticas de Metas
- [ ] Lista de Apps Bloqueados
- [ ] Adicionar App Bloqueado
- [ ] Estatísticas de Apps
- [ ] Lista de Rotinas
- [ ] Criar/Editar Rotina
- [ ] Perfil do Usuário
- [ ] Configurações

### **Componentes**
- [ ] Sistema de navegação
- [ ] Cards reutilizáveis
- [ ] Botões e inputs
- [ ] Modais e overlays
- [ ] Estados de loading/error/empty

### **Documentação**
- [ ] Guia de estilo
- [ ] Componentes reutilizáveis
- [ ] Fluxos de navegação
- [ ] Especificações técnicas

---

## 🎯 **OBJETIVO FINAL**

Criar uma interface que transmita:
- **Foco**: Design limpo sem distrações
- **Motivação**: Feedback positivo e progresso visual
- **Controle**: Usuário sente que está no comando
- **Tranquilidade**: Interface calma como uma caverna
- **Eficiência**: Ações rápidas e intuitivas

O usuário deve sentir que está entrando em um "modo caverna" - um espaço protegido e focado onde pode ser produtivo sem distrações. 