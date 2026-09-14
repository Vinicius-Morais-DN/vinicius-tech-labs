# Test Credentials
# Agent writes here when creating/modifying auth credentials (admin accounts, test users).
# Testing agent reads this before auth tests. Fork/continuation agents read on startup.

## Admin (painel /admin)
- Usuário: admin
- Senha: admin123
- Papel: admin (único usuário do sistema)
- Login: POST /api/auth/login  {"username": "admin", "password": "admin123"}
- Token JWT (Bearer) retornado no body; frontend guarda em localStorage "vm_token"

## Endpoints de auth
- POST /api/auth/login
- GET  /api/auth/me (Bearer)

## Notas
- Credenciais definidas em backend/.env (ADMIN_USERNAME / ADMIN_PASSWORD). Seed é idempotente: se a senha do .env mudar, o hash é atualizado no startup.
- Lockout de brute force: 5 tentativas falhas = 15 min de bloqueio por IP+usuário.
