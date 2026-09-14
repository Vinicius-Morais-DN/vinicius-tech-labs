# Problemas comuns

Soluções rápidas para erros frequentes.

---

## Login no admin não funciona

### Tela mostra "MongoDB offline" ou "Backend offline"

**Causa:** os serviços não estão rodando.

**Solução:** rode na raiz do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

Confirme em http://localhost:8001/api/health que `mongodb` e `api` são `true`.

---

### "Usuário ou senha incorretos" (mas a senha está certa)

**Causas possíveis:**

1. Senha no `.env` diferente da que você está digitando
2. Conta bloqueada após 5 tentativas erradas

**Solução:**

```powershell
cd backend
python clear_lockout.py
```

Use exatamente o `ADMIN_USERNAME` e `ADMIN_PASSWORD` do arquivo `backend/.env`.

---

### "Muitas tentativas. Aguarde X min..."

**Causa:** bloqueio por tentativas de login.

**Solução:** aguarde ou rode `python clear_lockout.py` na pasta `backend`.

---

## Backend não conecta / site sem dados

### Erro de conexão na porta 8001

**Solução:**
1. Verifique se o backend está rodando
2. Confirme que `frontend/.env` tem:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```
3. Reinicie o frontend após alterar o `.env` (`Ctrl+C` → `npm start`)

---

## MongoDB não inicia

### `start.ps1` diz "mongod.exe não encontrado"

**Solução:** instale o MongoDB portable — passo a passo em [Início rápido → MongoDB portable](./inicio-rapido.md#primeira-instalação-do-mongodb-portable-windows).

### Porta 27017 já em uso

**Solução:** outro MongoDB já está rodando (pode ser normal). O `start.ps1` detecta e segue em frente.

---

## npm install falha

### Erro `ERESOLVE`

**Solução:**

```powershell
cd frontend
npm install --legacy-peer-deps
```

---

## Alterações não aparecem no site

1. Verifique se salvou (toast verde "Salvo no servidor e em backend/saves/")
2. Recarregue a página do site (`F5`)
3. Confira se `backend/saves/content.json` foi atualizado (data de modificação recente)

---

## Checklist rápido de diagnóstico

```powershell
# 1. MongoDB responde?
Test-NetConnection localhost -Port 27017

# 2. Backend responde?
Invoke-RestMethod http://localhost:8001/api/health

# 3. Frontend responde?
Test-NetConnection localhost -Port 3000

# 4. Resetar admin
cd backend; python clear_lockout.py
```

| Porta | Serviço |
|-------|---------|
| 27017 | MongoDB |
| 8001 | Backend (FastAPI) |
| 3000 | Frontend (React) |

---

## Ainda com problemas?

1. Feche todas as janelas do backend/frontend
2. Rode `start.ps1` de novo
3. Abra http://localhost:3000/admin e verifique o status verde na tela de login
4. Olhe os logs na janela do terminal do backend — erros aparecem lá em vermelho
