# Início rápido — subir tudo de uma vez

Guia para colocar o portfólio no ar com **um único comando** no Windows.

---

## Pré-requisitos (só na primeira vez)

Antes de rodar, confira se você já fez isso uma vez:

| Item | Como verificar |
|------|----------------|
| Python 3.11+ | `python --version` |
| Node.js 18+ | `node -v` |
| Dependências do backend | `cd backend` → `pip install -r requirements.txt` |
| Dependências do frontend | `cd frontend` → `npm install --legacy-peer-deps` |
| Arquivo `backend/.env` | Copie de `backend/.env.example` e ajuste a senha |
| Arquivo `frontend/.env` | Copie de `frontend/.env.example` |

### Conteúdo mínimo dos `.env`

**`backend/.env`**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="portfolio"
JWT_SECRET="sua-chave-secreta-longa"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="sua-senha-aqui"
```

**`frontend/.env`**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## Forma mais fácil — 1 comando

Na **pasta raiz** do projeto, abra o PowerShell e rode:

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

O script faz automaticamente:

1. **MongoDB** na porta `27017` (inicia se ainda não estiver rodando)
2. **Backend** FastAPI na porta `8001`
3. **Frontend** React na porta `3000`
4. Sincroniza a senha do admin com o `.env` e limpa bloqueios de login
5. Abre o navegador em `http://localhost:3000`

### URLs após iniciar

| Serviço | Endereço |
|---------|----------|
| Site | http://localhost:3000 |
| Painel admin | http://localhost:3000/admin |
| API | http://localhost:8001/api/ |
| Health check | http://localhost:8001/api/health |

---

## Verificar se tudo está online

Abra no navegador ou no PowerShell:

```powershell
Invoke-RestMethod http://localhost:8001/api/health
```

Resposta esperada:

```json
{
  "api": true,
  "mongodb": true,
  "message": "Portfolio API online"
}
```

Se `mongodb` for `false`, o MongoDB não subiu — veja [Problemas comuns](./problemas-comuns.md).

---

## Login no admin

1. Acesse http://localhost:3000/admin
2. Na tela de login, confira se aparece **"✓ Servidor e banco online"** em verde
3. Use as credenciais do `backend/.env`:
   - **Usuário:** valor de `ADMIN_USERNAME` (padrão: `admin`)
   - **Senha:** valor de `ADMIN_PASSWORD`

---

## Parar os serviços

Feche as janelas do terminal que o `start.ps1` abriu (backend e frontend).

O MongoDB roda em janela minimizada — feche pelo Gerenciador de Tarefas se quiser encerrá-lo (`mongod.exe`).

---

## Iniciar manualmente (alternativa)

Use se preferir controle separado de cada serviço.

### Terminal 1 — MongoDB

```powershell
& "C:\Users\MASTER\mongodb\mongodb-win32-x86_64-windows-7.0.21\bin\mongod.exe" `
  --dbpath "C:\Users\MASTER\mongodb-data" `
  --port 27017 `
  --bind_ip 127.0.0.1
```

> Ajuste o caminho do `mongod.exe` se o seu MongoDB portable estiver em outro lugar.

### Terminal 2 — Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1   # se usar venv
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Terminal 3 — Frontend

```powershell
cd frontend
npm start
```

---

## Primeira instalação do MongoDB portable (Windows)

Se o `start.ps1` disser que o `mongod.exe` não foi encontrado:

```powershell
$url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.21.zip"
Invoke-WebRequest -Uri $url -OutFile "$env:USERPROFILE\mongodb.zip" -UseBasicParsing
Expand-Archive -Path "$env:USERPROFILE\mongodb.zip" -DestinationPath "$env:USERPROFILE\mongodb" -Force
New-Item -ItemType Directory -Path "$env:USERPROFILE\mongodb-data" -Force
```

Depois rode o `start.ps1` novamente.

---

## Próximos passos

- [Admin e salvamento](./admin-e-salvamento.md) — como editar conteúdo e onde os dados ficam salvos
- [Problemas comuns](./problemas-comuns.md) — login, MongoDB offline, npm, etc.
