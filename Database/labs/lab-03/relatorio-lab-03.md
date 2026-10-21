# Relatório do Laboratório 03 — Cadastro e atualização de alunos

## Objetivo

Criar um banco de dados para uma escola, montar a tabela `alunos`, inserir registros de exemplo e praticar consultas e atualizações dos dados.

## Comandos praticados

- `CREATE DATABASE` e `USE`: criar e selecionar o banco `escola`.
- `CREATE TABLE`: definir as colunas da tabela `alunos`.
- `AUTO_INCREMENT` e `PRIMARY KEY`: gerar IDs automaticamente e identificar cada registro.
- `INSERT INTO`: inserir os registros de exemplo.
- `SELECT`: consultar os registros.
- `DESCRIBE`: verificar a estrutura da tabela.
- `UPDATE ... SET ... WHERE`: alterar um ou mais campos dos registros selecionados.

## O que observei

O comando `UPDATE` permite alterar os dados de registros existentes. O `SET` define quais colunas serão modificadas e os novos valores, enquanto o `WHERE` limita a alteração aos registros que correspondem à condição.

Também pratiquei a atualização de mais de uma coluna na mesma instrução e uma operação matemática, somando um ponto às notas menores que 6. O filtro precisa ser conferido antes da execução para evitar mudanças em registros que não deveriam ser alterados.

## Cuidados

- Execute o `INSERT` apenas uma vez para não duplicar os registros.
- Confira a condição `WHERE` antes de executar um `UPDATE`.
- No MySQL Workbench, o Safe Update Mode pode bloquear atualizações consideradas inseguras. Use uma condição adequada à atividade e confirme quais linhas serão afetadas.

## Arquivo SQL

- [lab-03.sql](lab-03.sql)
