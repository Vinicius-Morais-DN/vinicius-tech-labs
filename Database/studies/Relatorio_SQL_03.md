# Relatório SQL 03 — Alteração da Estrutura de Tabelas

**Data:** 07/10/2026  
**Conteúdo:** `DROP DATABASE`, `CREATE DATABASE`, `ALTER TABLE` e `DESCRIBE`

## 1. Introdução

Nesta aula, pratiquei comandos SQL utilizados para criar bancos de dados, definir a estrutura de tabelas e modificar colunas depois que uma tabela já existe.

O foco foi entender como adicionar, alterar e excluir colunas sem precisar recriar toda a tabela. Também pratiquei a consulta da estrutura usando `DESCRIBE`.

## 2. Criar, selecionar e excluir um banco de dados

```sql
CREATE DATABASE AULAbd;

USE AULAbd;
```

O comando `CREATE DATABASE` cria o banco de dados. Já o `USE` seleciona o banco que será utilizado nos próximos comandos.

O comando `DROP DATABASE` tem uma função diferente: exclui o banco de dados inteiro, incluindo suas tabelas e os dados armazenados nelas.

```sql
-- ATENÇÃO: este comando exclui o banco e seus dados.
-- Use somente em um ambiente de estudo descartável.
DROP DATABASE AULAbd;
```

Esse comando foi incluído para estudo, mas não precisa ser executado novamente se o banco já contém dados que você deseja preservar.

## 3. Criar a tabela

```sql
CREATE TABLE alunos (
    id INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    nascimento DATE,
    sexo ENUM('M', 'F'),
    email VARCHAR(100),
    curso VARCHAR(50),
    nota DECIMAL(4,2),
    cidade VARCHAR(50) DEFAULT 'São Paulo'
);
```

A tabela `alunos` possui colunas com diferentes tipos de dados:

- `INT`: armazena números inteiros.
- `VARCHAR`: armazena textos com tamanho variável.
- `DATE`: armazena datas.
- `ENUM`: restringe os valores a uma lista definida.
- `DECIMAL(4,2)`: armazena números decimais com duas casas.
- `NOT NULL`: impede que a coluna receba `NULL`.
- `DEFAULT`: define um valor padrão quando um valor não é informado na inserção.

Nesta definição, `id` não foi configurado como chave primária nem como `AUTO_INCREMENT`; esses recursos podem ser definidos ao planejar a tabela.

## 4. Alterar a estrutura com ALTER TABLE

O comando `ALTER TABLE` permite modificar a estrutura de uma tabela existente.

### Adicionar uma coluna

```sql
ALTER TABLE alunos
ADD telefone VARCHAR(20);
```

Adiciona a coluna `telefone` à tabela.

### Adicionar uma coluna com valor padrão

```sql
ALTER TABLE alunos
ADD COLUMN estado VARCHAR(2) DEFAULT 'SP';
```

Adiciona a coluna `estado`, usando `SP` como valor padrão quando aplicável.

### Escolher a posição da coluna

```sql
ALTER TABLE alunos
ADD COLUMN cpf VARCHAR(14) AFTER nome;
```

Adiciona `cpf` logo depois da coluna `nome`. O `AFTER` define a posição da nova coluna.

### Modificar o tamanho de uma coluna

```sql
ALTER TABLE alunos
MODIFY COLUMN nome VARCHAR(100);
```

Altera o tamanho máximo do campo `nome` de 50 para 100 caracteres.

### Tornar uma coluna obrigatória

```sql
ALTER TABLE alunos
MODIFY COLUMN email VARCHAR(100) NOT NULL;
```

Passa a exigir um valor para `email`. Se já houver registros com `NULL`, será necessário corrigir esses dados antes de aplicar a alteração.

### Alterar o valor padrão

```sql
ALTER TABLE alunos
ALTER COLUMN cidade SET DEFAULT 'Santos';
```

Define `Santos` como o valor padrão da coluna `cidade` para novas inserções que não informem essa coluna. Os registros existentes não são alterados automaticamente.

### Renomear uma coluna e modificar seu tipo

```sql
ALTER TABLE alunos
CHANGE COLUMN telefone celular VARCHAR(15);
```

Renomeia `telefone` para `celular` e define seu tipo como `VARCHAR(15)`.

### Excluir uma coluna

```sql
ALTER TABLE alunos
DROP COLUMN cpf;
```

Remove a coluna `cpf` da tabela. Os dados armazenados nela também são perdidos.

## 5. Consultar a estrutura

```sql
DESCRIBE alunos;
```

Esse comando mostra as colunas, os tipos de dados, se aceitam `NULL`, as chaves e os valores padrão da tabela. É útil para verificar se as alterações realizadas com `ALTER TABLE` funcionaram.

## 6. Diferença entre estrutura e dados

- `ALTER TABLE`: modifica a estrutura da tabela, como suas colunas.
- `UPDATE`: altera valores de registros existentes.
- `DELETE`: exclui registros, podendo selecionar quais por meio de `WHERE`.
- `DROP TABLE`: exclui uma tabela inteira, incluindo sua estrutura e seus dados.
- `DROP DATABASE`: exclui um banco de dados inteiro e seus objetos.

## 7. O que compreendi

Com esses comandos, compreendi que a estrutura de uma tabela pode ser modificada depois de sua criação. É possível adicionar colunas, mudar seus tipos, definir valores padrão, renomear campos e remover colunas.

Também percebi a diferença entre `ALTER TABLE`, que modifica a estrutura, e comandos como `UPDATE` e `DELETE`, que trabalham com os registros armazenados.

O `DROP DATABASE` exige ainda mais cuidado, pois remove um banco de dados inteiro, e não apenas uma coluna ou um registro.

## 8. Arquivos da prática

Os scripts SQL estão separados por aula na pasta `Database/labs`:

- [`alteracao-estrutura-tabelas.sql`](../labs/aula-03-alteracao-estrutura.sql) — criação do banco de aula e exercícios com `ALTER TABLE`.
- [`cadastro-atualizacao-alunos.sql`](../labs/aula-04-manipulacao-alunos.sql) — criação da tabela `alunos`, inserção de registros e exercícios com `UPDATE`.

O comando `DROP DATABASE` ficou comentado no script de alteração de estrutura para evitar apagar o banco acidentalmente. Ele pode ser descomentado somente em um banco descartável de estudo.
