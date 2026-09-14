"""
Limpa lockouts de login e garante que o user admin existe com a senha correta.
Roda uma vez e sai.
"""
import asyncio, os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ["DB_NAME"]
ADMIN_USER = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "admin123")

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # 1) Limpa todos os lockouts
    r = await db.login_attempts.delete_many({})
    print(f"Lockouts removidos: {r.deleted_count}")

    # 2) Verifica/cria o user admin
    user = await db.users.find_one({"username": ADMIN_USER.lower()})
    hashed = bcrypt.hashpw(ADMIN_PASS.encode(), bcrypt.gensalt()).decode()
    if user:
        await db.users.update_one(
            {"username": ADMIN_USER.lower()},
            {"$set": {"password_hash": hashed,
                      "totp_enabled": False},
             "$unset": {"totp_secret": "", "totp_secret_pending": ""}}
        )
        print(f"User '{ADMIN_USER}' atualizado — senha redefinida, 2FA removido.")
    else:
        await db.users.insert_one({
            "username": ADMIN_USER.lower(),
            "password_hash": hashed,
            "role": "admin",
            "totp_enabled": False,
        })
        print(f"User '{ADMIN_USER}' criado.")

    # 3) Confirma
    user = await db.users.find_one({"username": ADMIN_USER.lower()})
    ok = bcrypt.checkpw(ADMIN_PASS.encode(), user["password_hash"].encode())
    print(f"Senha '{ADMIN_PASS}' válida para '{ADMIN_USER}': {ok}")
    print(f"totp_enabled: {user.get('totp_enabled')}")

    client.close()

asyncio.run(main())
