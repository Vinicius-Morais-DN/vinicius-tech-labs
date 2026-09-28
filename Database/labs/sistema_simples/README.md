# Sistema de Login com Python e SQLite

## Componentes Principais

### Importação do SQLite

```python
import sqlite3
```

Importa o módulo `sqlite3), que permite trabalhar com bancos SQLite diretamente pelo Python, sem instalação adicional.

### Conexão com o Banco de Dados

```python
conn = sqlite3.connect("usuarios.db")
```

Cria uma conexão com o arquivo `usuarios.db`. Caso o arquivo não exista, o SQLite o cria automaticamente.

### Cursor

```python
cursor = conn.cursor()
```

Cria o cursor utilizado para executar comandos SQL no banco de dados.

---

## Estrutura do Banco de Dados

### Tabela `login`

```sql
CREATE TABLE IF NOT EXISTS login(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user VARCHAR(25) NOT NULL UNIQUE,
    senha VARCHAR(30) NOT NULL
);
```

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER | Identificador único e automático |
| `user` | VARCHAR(25) | Nome de usuário, obrigatório e único |
| `senha` | VARCHAR(30) | Senha armazenada para o laboratório |

Principais restrições:
- `PRIMARY KEY`: identifica cada registro.
- `AUTOINCREMENT`: gera o ID automaticamente.
- `NOT NULL`: exige o preenchimento do campo.
- `UNIQUE`: impede usuários duplicados.

O banco também possui usuários de teste para demonstração do sistema.

---

## Funções Principais

### `cadastrar_usuario()`

Responsável pelo cadastro de novos usuários.

O processo:
1. Valida o tamanho do usuário.
2. Valida o tamanho da senha.
3. Executa o `INSERT INTO`.
4. Trata o erro caso o usuário já exista.

**Validações:**
- Usuário: 6 a 25 caracteres.
- Senha: 8 a 30 caracteres.

### `fazer_login()`

Responsável pela autenticação.

O processo:
1. Busca o usuário com `SELECT`.
2. Recupera o resultado com `fetchone()`.
3. Verifica se o usuário existe.
4. Compara a senha informada com o registro encontrado.
5. Informa se o login foi realizado ou recusado.

No resultado retornado pelo banco:
- `resultado[0]` → ID
- `resultado[1]` → usuário
- `resultado[2]` → senha

---

## Fluxo do Sistema

O programa apresenta duas opções:

- **Cadastro:** solicita usuário e senha e registra os dados no banco.
- **Login:** solicita as credenciais e verifica o registro existente.
- **Opção inválida:** informa que a opção escolhida não existe.

Ao final:

```python
conn.commit()
conn.close()
```

- `commit()`: confirma as alterações no banco.
- `close()`: encerra a conexão.

---

## Recursos Praticados

- Python integrado ao SQLite.
- Criação e utilização de tabela SQL.
- `INSERT INTO` e `SELECT`.
- Parâmetros `?` nas consultas.
- Validação de entrada.
- Restrição `UNIQUE`.
- Tratamento de `sqlite3.IntegrityError`.
- Persistência de dados em arquivo `usuarios.db`.

> **Observação:** este é um laboratório de estudo. As senhas são armazenadas de forma simples para fins didáticos e **não representam uma implementação adequada para produção**.

---

## Melhorias Futuras

O laboratório foi desenvolvido de forma simples, mas algumas melhorias poderiam aproximá-lo de uma aplicação real. Essas funcionalidades **ainda não foram implementadas** e fazem parte dos meus próximos estudos.

- **Senhas:** utilizar hash específico para armazenamento seguro, como bcrypt ou Argon2.
- **2FA:** adicionar uma segunda etapa de autenticação.
- **Proteção de login:** limitar tentativas consecutivas para reduzir tentativas automatizadas.
- **Logs:** registrar tentativas de acesso para facilitar auditoria e análise.
- **Interface:** substituir a interação via terminal por uma interface gráfica ou web.
- **Banco de dados:** estudar a migração do SQLite para MySQL ou PostgreSQL.
- **Recuperação de senha:** implementar um fluxo seguro de redefinição de senha.

Essas melhorias representam possibilidades de evolução do projeto conforme avanço nos estudos de **Banco de Dados, Python e Cibersegurança**.
