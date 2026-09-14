# Configuração do GitHub Token para Sincronização

## Para que serve o GitHub Token?

O GitHub Token (Personal Access Token - PAT) é necessário para:
- Aumentar o limite de requisições à API do GitHub (de 60 para 5000 por hora)
- Acessar repositórios privados
- Evitar erros de rate limit durante a sincronização

## Como criar um Personal Access Token

### Passo 1: Acessar as configurações do GitHub

1. Faça login no GitHub
2. Clique na sua foto de perfil no canto superior direito
3. Vá em **Settings** (Configurações)

### Passo 2: Criar o token

1. No menu lateral esquerdo, clique em **Developer settings**
2. Clique em **Personal access tokens** → **Tokens (classic)**
3. Clique no botão **Generate new token (classic)**

### Passo 3: Configurar permissões

**Note (nota):** Dê um nome descritivo, ex: "Portfolio Sync Token"

**Expiration (expiração):** Escolha "No expiration" (sem expiração) ou uma data futura

**Select scopes (selecione permissões):**
- ✅ `repo` (acesso completo a repositórios) - necessário para ler arquivos
- ✅ `read:org` (se for um repositório de organização)

### Passo 4: Gerar e copiar

1. Clique em **Generate token**
2. **COPIE O TOKEN IMEDIATAMENTE** - ele só aparece uma vez!
3. Guarde em local seguro

## Configurar no projeto

### Opção 1: Variável de ambiente (recomendado para desenvolvimento)

Adicione ao arquivo `backend/.env`:

```env
GITHUB_TOKEN="seu_token_aqui"
```

### Opção 2: Para produção

Configure no servidor onde o backend está rodando:
- Adicione como variável de ambiente no servidor
- Ou configure no serviço de deployment (Vercel, Railway, etc.)

## Verificar se funcionou

Após configurar o token, teste a sincronização manual no painel admin:
1. Acesse `http://localhost:3000/admin`
2. Vá em Documentação
3. Clique em "Sync GitHub"
4. Deve funcionar sem erros de rate limit

## Segurança

⚠️ **Nunca commitar o token no repositório!**
- O arquivo `.env` já está no `.gitignore`
- Se usar em produção, use secrets do serviço de hosting
- Se o token vazar, revogue e crie um novo imediatamente

## Revogar o token

Se precisar revogar:
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Clique no token e em "Revoke"
