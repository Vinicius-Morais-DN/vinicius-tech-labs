# 🚀 Guia de Deploy

Este projeto consiste em:
- **Frontend:** React 19 + Tailwind CSS
- **Backend:** FastAPI (Python) + MongoDB

## Opções de Deploy

### 1. GitHub Pages (Frontend apenas - gratuito)

#### Pré-requisitos
- Conta no GitHub
- Projeto no GitHub

#### Passos

1. **No frontend, configure o homepage:**
   ```bash
   cd frontend
   npm install gh-pages --save-dev
   ```

2. **Adicione scripts no package.json:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. **Configure o homepage:**
   ```json
   "homepage": "https://vinicius-morais-dn.github.io/vinicius-tech-labs"
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

**Limitação:** Apenas frontend funciona. Backend precisa de outra solução.

---

### 2. Vercel (Frontend + Backend Serverless - gratuito)

#### Pré-requisitos
- Conta no Vercel
- Projeto no GitHub

#### Passos

1. **Acesse:** https://vercel.com/new
2. **Importe o repositório** do GitHub
3. **Configure:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. **Para o backend (Serverless):**
   - Vercel não suporta Python diretamente
   - Use Vercel Functions com FastAPI
   - Ou use Render/Railway para o backend

---

### 3. Render (Frontend + Backend - gratuito)

#### Pré-requisitos
- Conta no Render
- Projeto no GitHub

#### Passos para o Backend (FastAPI + MongoDB)

1. **Acesse:** https://render.com
2. **Clique em "New +" → "Web Service"**
3. **Conecte o repositório** do GitHub
4. **Configure:**
   - **Name:** `vinicius-tech-labs-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`

5. **Environment Variables:**
   - `MONGODB_URI`: (use MongoDB Atlas)
   - `JWT_SECRET`: (gerar uma chave secreta)
   - `GITHUB_TOKEN`: (opcional, para sincronização)

6. **MongoDB Atlas (gratuito):**
   - Crie conta em: https://www.mongodb.com/cloud/atlas
   - Crie cluster gratuito
   - Copie a connection string

#### Passos para o Frontend (React)

1. **No Render, crie "Static Site"**
2. **Conecte o repositório**
3. **Configure:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`

4. **Environment Variables:**
   - `REACT_APP_BACKEND_URL`: URL do backend (ex: `https://vinicius-tech-labs-backend.onrender.com`)

---

### 4. Railway (Frontend + Backend - gratuito)

#### Pré-requisitos
- Conta no Railway
- Projeto no GitHub

#### Passos

1. **Acesse:** https://railway.app
2. **Clique em "New Project" → "Deploy from GitHub repo"**
3. **Selecione o repositório**
4. **Railway detecta automaticamente:**
   - Backend (Python)
   - Frontend (Node.js)

5. **Configure MongoDB:**
   - Adicione plugin "MongoDB" no Railway
   - Copie a connection string

6. **Environment Variables:**
   - `MONGODB_URI`: connection string do MongoDB
   - `JWT_SECRET`: chave secreta
   - `REACT_APP_BACKEND_URL`: URL do backend

---

### 5. Self-hosted (VPS/DigitalOcean/AWS)

#### Pré-requisitos
- Servidor Linux (Ubuntu/Debian)
- Domínio (opcional)

#### Passos

1. **No servidor:**
   ```bash
   # Atualize o sistema
   sudo apt update && sudo apt upgrade -y

   # Instale Python e Node.js
   sudo apt install python3 python3-pip nodejs npm git -y

   # Instale MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt update
   sudo apt install mongodb-org -y
   sudo systemctl start mongod
   sudo systemctl enable mongod

   # Clone o repositório
   cd /var/www
   git clone https://github.com/Vinicius-Morais-DN/vinicius-tech-labs.git
   cd vinicius-tech-labs

   # Configure o backend
   cd backend
   pip3 install -r requirements.txt
   cp .env.example .env
   # Edite .env com suas configurações

   # Configure o frontend
   cd ../frontend
   npm install
   npm run build

   # Instale Nginx
   sudo apt install nginx -y

   # Configure Nginx (proxy)
   sudo nano /etc/nginx/sites-available/vinicius-tech-labs
   ```

2. **Configuração do Nginx:**
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;

       # Frontend
       location / {
           root /var/www/vinicius-tech-labs/frontend/build;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api/ {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       # Uploads
       location /api/uploads/ {
           alias /var/www/vinicius-tech-labs/backend/uploads/;
       }
   }
   ```

3. **Instale PM2 para gerenciar o backend:**
   ```bash
   sudo npm install -g pm2
   cd /var/www/vinicius-tech-labs/backend
   pm2 start uvicorn --name "vinicius-backend" -- server:app --host 0.0.0.0 --port 8000
   pm2 save
   pm2 startup
   ```

4. **SSL gratuito com Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d seu-dominio.com
   ```

---

## Recomendação

**Para iniciantes/gratuito:**
- **Render** é a melhor opção full-stack gratuita
- Suporta Python (FastAPI) e React
- MongoDB Atlas gratuito
- Fácil configuração

**Para produção/escala:**
- VPS (DigitalOcean/AWS)
- Nginx como proxy
- PM2 para gerenciamento de processos
- Let's Encrypt para SSL

---

## Verificação pós-deploy

1. **Teste o backend:**
   - Acesse: `https://seu-backend.com/api/content`
   - Deve retornar o conteúdo do site

2. **Teste o frontend:**
   - Acesse: `https://seu-frontend.com`
   - Verifique se carrega o conteúdo

3. **Teste o admin:**
   - Acesse: `https://seu-frontend.com/admin`
   - Faça login com suas credenciais

4. **Verifique console:**
   - Abra DevTools (F12)
   - Verifique se há erros de conexão

---

## Variáveis de Ambiente Necessárias

### Backend (.env)
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/portfolio
JWT_SECRET=sua-chave-secreta-aqui
GITHUB_TOKEN=ghp_token_opcional
GITHUB_DOCS_OWNER=Vinicius-Morais-DN
GITHUB_DOCS_REPO=vinicius-tech-labs
GITHUB_DOCS_BRANCH=main
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://seu-backend.com
```

---

## Suporte

Se encontrar problemas:
1. Verifique os logs do deploy
2. Confirme as variáveis de ambiente
3. Teste a conexão com MongoDB
4. Verifique se as portas estão abertas
