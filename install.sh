#!/bin/bash
# ============================================================
# VM_labs — Portfólio & Wiki de Infraestrutura/Cybersegurança
# Script de instalação completa (backend + frontend + MongoDB)
# Testado em Ubuntu/Debian. Requer: Python 3.10+, Node 18+, MongoDB
# ============================================================
set -e

echo "==> Verificando dependências..."
command -v python3 >/dev/null || { echo "Python 3 não encontrado. Instale: sudo apt install python3 python3-venv"; exit 1; }
command -v node >/dev/null || { echo "Node.js não encontrado. Instale: https://nodejs.org"; exit 1; }
command -v yarn >/dev/null || { echo "Yarn não encontrado. Instalando..."; npm install -g yarn; }

if ! command -v mongod >/dev/null; then
  echo "==> MongoDB não encontrado. Instale antes de continuar:"
  echo "    https://www.mongodb.com/docs/manual/administration/install-community/"
  echo "    (ou rode: docker run -d -p 27017:27017 --name mongo mongo:7)"
fi

echo "==> Configurando backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f .env ]; then
  cp .env.example .env
  SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
  sed -i "s|JWT_SECRET=.*|JWT_SECRET=\"$SECRET\"|" .env
  echo "==> .env criado com JWT_SECRET aleatório."
fi
deactivate
cd ..

echo "==> Configurando frontend..."
cd frontend
if [ ! -f .env ]; then
  cp .env.example .env
fi
yarn install
cd ..

echo ""
echo "============================================================"
echo " Instalação concluída!"
echo "============================================================"
echo " Para rodar o projeto:"
echo ""
echo " 1) Backend (terminal 1):"
echo "    cd backend && source venv/bin/activate"
echo "    uvicorn server:app --host 0.0.0.0 --port 8001 --reload"
echo ""
echo " 2) Frontend (terminal 2):"
echo "    cd frontend && yarn start"
echo ""
echo " 3) Acesse: http://localhost:3000"
echo "    Painel admin: http://localhost:3000/admin"
echo "    Usuário: admin | Senha: admin123"
echo "    (troque em backend/.env -> ADMIN_PASSWORD)"
echo "============================================================"
