# Relatório do Laboratório 02 — Alteração da estrutura de tabelas

## Objetivo

Praticar a criação de um banco de dados e de uma tabela, além de modificar a estrutura de uma tabela existente usando comandos SQL.

## Comandos praticados

- `CREATE DATABASE`: cria o banco de dados `AULAbd`.
- `USE`: seleciona o banco que será utilizado.
- `CREATE TABLE`: cria a tabela `alunos) com diferentes tipos de dados.
- `ALTER TABLE ... ADD`: adiciona novas colunas.
- `MODIFY COLUMN`: modifica a definição de uma coluna.
- `ALTER COLUMN ... SET DEFAULT`: altera o valor padrão de uma coluna.
- `CHANGE COLUMN`: renomeia uma coluna e permite alterar sua definição.
- `DROP COLUMN`: remove uma coluna da tabela.
- `DESCRIBE`: mostra a estrutura atual da tabela.

## O que observei

A estrutura de uma tabela pode ser ajustada depois da criação. É possível adicionar colunas, aumentar o tamanho permitido para um campo, definir valores padrão, renomear uma coluna e remover campos que não serão mais utilizados.

Também é importante prestar atenção às restrições, como `NOT NULL), e conferir a estrutura com `DESCRIBE` depois das alterações.

## Cuidados

O comando `DROP DATABASE` exclui o banco de dados inteiro e seus dados. Por segurança, ele está comentado no arquivo SQL. Já `DROP COLUMN` remove a coluna e os dados armazenados nela, então deve ser usado apenas quando isso for intencional.

## Arquivo SQL

- [lab-02.sql](lab-02.sql)
