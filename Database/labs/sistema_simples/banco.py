import sqlite3  # Importa o módulo sqlite3 para trabalhar com banco de dados SQLite.

conn = sqlite3.connect("usuarios.db")  # Cria uma conexão com o banco usuarios.db.

cursor = conn.cursor()  # Cria o cursor para executar comandos SQL.

cursor.execute("""
    CREATE TABLE IF NOT EXISTS login(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user VARCHAR(25) NOT NULL UNIQUE,
        senha VARCHAR(30) NOT NULL
    );
""")  # Cria a tabela login caso ela ainda não exista.]
cursor.execute("""
    INSERT INTO login (user, senha) VALUES
    ('shadow01', 'Kali@2026'),
    ('netdragon', 'Linux#8842'),
    ('cyberfox', 'R3des@771'),
    ('packet01', 'Cisco#4521'),
    ('rootlab', 'Lab@90317'),
    ('firewall', 'Net#62891'),
    ('nexus77', 'Py@551204'),
    ('darknet9', 'Sql#7832'),
    ('sysadmin', 'Adm@44921'),
    ('bytewolf', 'DB@920173');
""")
 
def cadastrar_usuario(user, senha):  # Define a função responsável pelo cadastro.

    if len(user) > 25 or len(user) < 6:  # Verifica se o usuário está fora do limite.
        print("Usuário deve ter entre 6 e 25 caracteres")
        return

    if len(senha) > 30 or len(senha) < 8:  # Verifica se a senha está fora do limite.
        print("Senha deve ter entre 8 e 30 caracteres")
        return

    try:  # Tenta executar o cadastro.

        cursor.execute("""
            INSERT INTO login (user, senha) VALUES (?, ?)
        """, (user, senha))  # Insere o usuário e a senha no banco.

        print("Cadastro realizado com sucesso")

    except sqlite3.IntegrityError:  # Captura erro de usuário duplicado.
        print("Usuário já existe")
        return


def fazer_login(user, senha):  # Define a função responsável pelo login.

    cursor.execute("""
        SELECT * FROM login WHERE user = ?
    """, (user,))  # Procura no banco o usuário informado.

    resultado = cursor.fetchone()  # Pega o primeiro registro encontrado.

    if resultado is None:  # Verifica se nenhum usuário foi encontrado.
        print("Usuário não cadastrado")
        return

    if resultado[2] != senha:  # Compara a senha digitada com a senha armazenada.
        print("Senha incorreta")
        return

    print("Login realizado com sucesso")


login_cadastro = input(
    "Deseja cadastrar ou fazer login? \nCadastro (s) ou Login (n): "
).lower()  # Pergunta a operação e transforma a resposta em minúscula.


if login_cadastro == "s":  # Se escolher cadastro.

    print("Vamos cadastrar um usuário")

    user = input("Digite o nome de usuario: ")
    senha = input(f"Digite a senha para {user}: ")

    cadastrar_usuario(user, senha)  # Executa o cadastro.


elif login_cadastro == "n":  # Se escolher login.

    print("Vamos fazer login")

    user = input("Digite seu usuario: ")
    senha = input("Digite sua senha: ")

    fazer_login(user, senha)  # Executa o login.


else:  # Se digitar qualquer outra opção.

    print("Opção inválida")





conn.commit()  # Confirma e salva as alterações no banco.

conn.close()  # Fecha a conexão com o banco.