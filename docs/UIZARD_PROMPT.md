# 🎨 Prompt Uizard - Cave Mode App

## 📱 **APLICATIVO MOBILE: CAVE MODE**

Crie um aplicativo mobile moderno para **Cave Mode** - um sistema de produtividade que ajuda usuários a manter foco através de alarmes inteligentes, metas, rotinas e bloqueio de apps.

---

## 🎯 **CONCEITO VISUAL**

**Tema**: Dark mode como padrão, inspirado em cavernas
- **Cores**: Preto (#000000), cinza escuro (#1F2937), verde esmeralda (#10B981), laranja (#F59E0B)
- **Estilo**: Minimalista, clean, sem distrações
- **Mood**: Proteção, foco, tranquilidade

---

## 📋 **TELAS PRINCIPAIS**

### **1. AUTENTICAÇÃO**
- **Splash**: Logo Cave Mode, fundo escuro
- **Login**: Email, senha, botão verde "Entrar"
- **Register**: Nome, email, senha, confirmar senha

### **2. DASHBOARD (HOME)**
- **Header**: Avatar, nome, toggle Safe Mode
- **Cards principais**:
  - Alarme Ativo (laranja se ativo)
  - Meta do Dia (progresso)
  - Rotina Atual
  - Apps Bloqueados (contador)
- **Quick Actions**: Criar Alarme, Nova Meta, Adicionar App

### **3. ALARMES**
- **Lista**: Horário grande, status toggle, repetição
- **Criar/Editar**: Time picker, repetição (uma vez/diário/semanal)
- **Alarme Tocando**: Tela cheia, botão câmera grande
- **Selfie**: Viewfinder, indicador de luz, resultado

### **4. METAS**
- **Lista**: Título, checkbox, data
- **Criar/Editar**: Título, descrição opcional
- **Estatísticas**: Total, completadas, pendentes, gráficos

### **5. APPS BLOQUEADOS**
- **Lista**: Ícone app, nome, tipo bloqueio, status
- **Adicionar**: Busca apps, tipo (permanente/temporário), duração
- **Estatísticas**: Total bloqueados, tempo economizado

### **6. ROTINAS**
- **Lista**: Título, horário início/fim, status
- **Criar/Editar**: Título, horários, dias da semana

### **7. PERFIL**
- **Info**: Avatar, nome, email
- **Configurações**: Safe Mode, notificações, privacidade
- **Estatísticas**: Total alarmes, metas, tempo focado

---

## 🎨 **COMPONENTES**

### **Navegação**
- **Bottom Tab**: Home, Alarmes, Metas, Apps, Perfil
- **Header**: Título, botões ação
- **Back Button**: Consistente

### **Elementos**
- **Cards**: Bordas arredondadas, sombra sutil
- **Botões**: Verde (primário), cinza (secundário), vermelho (perigo)
- **Inputs**: Bordas arredondadas, placeholder claro
- **Toggles**: Animação suave

### **Estados**
- **Loading**: Spinner, skeleton
- **Empty**: Ilustração + mensagem
- **Error**: Mensagem clara + retry
- **Success**: Feedback visual

---

## 📱 **ESPECIFICAÇÕES**

### **Resolução**: 375x812px (iPhone X)
### **Interações**: Swipe deletar, pull refresh, haptic feedback
### **Animações**: Transições 300ms, micro-interações

---

## 🎯 **FLUXOS PRINCIPAIS**

1. **Alarme**: Criar → Configurar → Tocar → Selfie → Resultado
2. **Meta**: Criar → Listar → Marcar completa → Estatísticas
3. **App**: Buscar → Selecionar → Bloquear → Listar

---

## 🎨 **INSPIRAÇÕES**

- **Forest**: Foco e gamificação
- **Sleep Cycle**: Alarmes inteligentes
- **Habitify**: Tracking hábitos
- **Freedom**: Bloqueio apps
- **Notion**: Interface limpa

---

## 📋 **ENTREGÁVEIS**

### **Telas (18 total)**
- [ ] Splash, Login, Register
- [ ] Dashboard, Perfil, Configurações
- [ ] Lista/Criar/Editar Alarmes
- [ ] Alarme Tocando, Selfie, Resultado
- [ ] Lista/Criar/Editar Metas, Estatísticas
- [ ] Lista/Adicionar Apps Bloqueados, Estatísticas
- [ ] Lista/Criar/Editar Rotinas

### **Componentes**
- [ ] Sistema navegação
- [ ] Cards, botões, inputs
- [ ] Modais, overlays
- [ ] Estados loading/error/empty

---

## 🎯 **OBJETIVO**

Interface que transmita **FOCUS** - design limpo, feedback positivo, controle do usuário, tranquilidade como uma caverna, eficiência nas ações.

O usuário deve sentir que entra em um "modo caverna" - espaço protegido e focado para produtividade sem distrações. 