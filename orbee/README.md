# 🌟 Orbee - Uber de Microtarefas

Um MVP funcional para conectar pessoas que precisam de ajuda com pequenas tarefas com prestadores locais.

![Orbee Logo](https://via.placeholder.com/200x100/0ea5e9/ffffff?text=Orbee)

## 📋 Sobre o Projeto

Orbee é uma plataforma onde pessoas podem solicitar ajuda para pequenas tarefas do dia a dia (trocar lâmpada, ajuda para idosos, entregas locais, etc.) e prestadores próximos podem aceitar e executar essas tarefas.

### ✨ Características Principais

- **Design Amigável**: Interface clean e intuitiva inspirada no estilo Lovable
- **Geolocalização**: Encontra prestadores próximos automaticamente
- **Sistema de Reputação**: Avaliações e comentários de ambos os lados
- **Tipos de Usuário**: Cliente, prestador ou ambos
- **Categorias Organizadas**: Manutenção, limpeza, entrega, cuidados, tecnologia
- **Fluxo Simplificado**: Máximo 2 cliques para ações principais

## 🚀 Funcionalidades

### 🔐 Autenticação
- [x] Login com email e senha
- [x] Cadastro com seleção de tipo de usuário
- [x] Login com Google
- [x] Verificação de email

### 📱 Interface do Cliente
- [x] Solicitar nova tarefa com geolocalização
- [x] Acompanhar status das tarefas
- [x] Avaliar prestadores
- [x] Dashboard com estatísticas

### 🛠️ Interface do Prestador
- [x] Ver tarefas disponíveis por proximidade
- [x] Aceitar tarefas
- [x] Gerenciar tarefas aceitas
- [x] Avaliar clientes

### 📊 Sistema de Avaliação
- [x] Avaliação de 1-5 estrelas
- [x] Comentários opcionais
- [x] Histórico de avaliações
- [x] Cálculo de média automático

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Backend**: Firebase (Firestore + Auth)
- **Geolocalização**: Browser Geolocation API
- **Build**: Create React App

## 📦 Estrutura do Projeto

```
orbee/
├── src/
│   ├── components/
│   │   ├── Auth/           # Componentes de autenticação
│   │   ├── Layout/         # Header e navegação
│   │   ├── Rating/         # Sistema de avaliação
│   │   └── Tasks/          # Componentes de tarefas
│   ├── contexts/           # Context API (Auth)
│   ├── pages/              # Páginas principais
│   ├── services/           # Serviços (Firebase)
│   ├── types/              # Tipos TypeScript
│   └── config/             # Configurações
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd orbee
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase** (Opcional para teste)
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Authentication (Email/Password e Google)
   - Ative Firestore Database
   - Copie as configurações para `src/config/firebase.ts`

4. **Execute o projeto**
```bash
npm start
```

5. **Acesse no navegador**
```
http://localhost:3000
```

## 🎯 MVP - Funcionalidades Validadas

### ✅ Implementadas
- ✅ Sistema completo de autenticação
- ✅ Solicitação de tarefas com geolocalização
- ✅ Lista de tarefas para prestadores
- ✅ Gerenciamento de tarefas ativas
- ✅ Sistema de avaliação
- ✅ Dashboard com estatísticas
- ✅ Design responsivo e amigável

### 🔄 Para Próximas Versões
- 📧 Sistema de notificações push
- 💬 Chat integrado
- 💰 Sistema de pagamento
- 📱 App mobile nativo
- 🗺️ Mapa interativo
- 📈 Analytics avançado

## 🎨 Design System

### Cores Principais
- **Azul Orbee**: `#0ea5e9` (Primary)
- **Verde Sucesso**: `#10b981`
- **Amarelo Alerta**: `#f59e0b`
- **Vermelho Erro**: `#ef4444`

### Componentes Reutilizáveis
- `btn-primary`: Botão principal
- `btn-secondary`: Botão secundário
- `input-field`: Campo de entrada
- `card`: Container de conteúdo

## 📊 Dados de Teste

O projeto inclui dados simulados para demonstração:
- Usuários de exemplo
- Tarefas de amostra
- Avaliações fictícias
- Estatísticas demonstrativas

## 🧪 Como Testar

### Cenário 1: Cliente
1. Cadastre-se como "Cliente"
2. Solicite uma nova tarefa
3. Acompanhe no painel de tarefas
4. Avalie o prestador (simulado)

### Cenário 2: Prestador
1. Cadastre-se como "Prestador"
2. Veja tarefas disponíveis
3. Aceite uma tarefa
4. Marque como concluída

### Cenário 3: Ambos
1. Cadastre-se como "Ambos"
2. Teste todas as funcionalidades
3. Alterne entre cliente e prestador

## 🔧 Configuração de Desenvolvimento

### Scripts Disponíveis
```bash
npm start          # Servidor de desenvolvimento
npm test           # Executar testes
npm run build      # Build para produção
npm run eject      # Ejetar CRA (não recomendado)
```

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```env
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_dominio
REACT_APP_FIREBASE_PROJECT_ID=seu_project_id
```

## 📱 Responsividade

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

## 🤝 Contribuindo

Este é um MVP para validação. Feedback e sugestões são bem-vindos!

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Desenvolvedor**: [Seu Nome]
- **Design**: Sistema baseado em Lovable
- **MVP**: Focado em validação rápida

## 📞 Contato

Para dúvidas sobre o projeto:
- Email: contato@orbee.com
- GitHub: [seu-usuario]

---

**💡 Orbee** - Conectando pessoas através de pequenas ajudas. 🌟
