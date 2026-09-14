# Admin e salvamento de dados

Como editar o portfólio pelo painel admin e onde os dados ficam armazenados.

---

## Acessar o painel

1. Suba o projeto com [Início rápido](./inicio-rapido.md)
2. Acesse http://localhost:3000/admin
3. Faça login com usuário e senha do `backend/.env`

---

## O que você pode editar

| Aba | Conteúdo |
|-----|----------|
| **Geral** | Nome, título, foto, bio, sobre mim, currículo, badges, links |
| **Skills** | Hard skills (com %) e soft skills |
| **Projetos** | Cards de labs e projetos |
| **Certificações** | Cursos e certificados |
| **Documentação** | Áreas e páginas da wiki (Markdown) |
| **Mensagens** | Formulário de contato recebido |

---

## Como funciona o salvamento

Os dados são guardados em **dois lugares**:

```
MongoDB (banco principal)  →  backend/saves/*.json (backup em disco)
```

### Salvamento automático

| Ação | O que acontece |
|------|----------------|
| Editar **Geral** ou **Skills** | Autosave após 2 segundos sem digitar |
| Clicar **Salvar** (Projetos, Certs, Docs) | Salva no banco + atualiza o JSON correspondente |
| Clicar **Salvar tudo** (botão no topo) | Exporta tudo para `backend/saves/` |

### Arquivos de backup

```
backend/saves/
├── content.json         ← Geral + Skills
├── projects.json        ← Projetos
├── certifications.json  ← Certificações
├── areas.json           ← Áreas da documentação
└── docpages.json        ← Páginas da wiki
```

### Restauração automática

Quando o backend inicia, ele **restaura os dados** de `backend/saves/` para o MongoDB (se os arquivos existirem). Isso protege seu conteúdo mesmo se o banco for reiniciado.

---

## Botão "Salvar tudo"

Fica no topo do painel admin (centro da barra). Use quando quiser garantir que **tudo** foi exportado para a pasta `saves/`.

Indicadores na tela:
- **"salvando no servidor..."** — autosave em andamento
- **"salvo às HH:MM"** — último save confirmado
- **"● alterações não salvas"** — ainda há mudanças pendentes

---

## Resetar senha ou desbloquear login

Se errar a senha 5 vezes, a conta fica bloqueada por 15 minutos.

Para resetar imediatamente (com MongoDB rodando):

```powershell
cd backend
python clear_lockout.py
```

Isso:
- Remove bloqueios de tentativas de login
- Redefine a senha do admin conforme o `ADMIN_PASSWORD` do `.env`

---

## Uploads (imagens e currículo)

Arquivos enviados pelo admin ficam em:

```
backend/uploads/
```

As URLs são salvas no banco e nos JSONs de backup junto com o restante do conteúdo.
