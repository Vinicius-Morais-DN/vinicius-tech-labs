-- Aula 3 — Alteração da estrutura de tabelas
-- Conteúdo: CREATE DATABASE, USE, ALTER TABLE e DESCRIBE
--
-- ATENÇÃO: DROP DATABASE apaga o banco inteiro e todos os seus dados.
-- Para evitar apagar dados sem querer, o comando fica comentado.
-- Se estiver praticando em um banco descartável, remova os "--" para testá-lo.
-- DROP DATABASE AULAbd;

CREATE DATABASE AULAbd;

USE AULAbd;

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

-- Adicionar uma coluna.
ALTER TABLE alunos
ADD telefone VARCHAR(20);

-- Adicionar uma coluna com valor padrão.
ALTER TABLE alunos
ADD COLUMN estado VARCHAR(2) DEFAULT 'SP';

-- Adicionar CPF depois da coluna nome.
ALTER TABLE alunos
ADD COLUMN cpf VARCHAR(14) AFTER nome;

-- Aumentar o tamanho permitido para nome.
ALTER TABLE alunos
MODIFY COLUMN nome VARCHAR(100);

-- Tornar email obrigatório.
-- Se já houver linhas com email NULL, corrija-as antes desta alteração.
ALTER TABLE alunos
MODIFY COLUMN email VARCHAR(100) NOT NULL;

-- Alterar o valor padrão da cidade para novas inserções.
-- Isso não altera automaticamente os valores já existentes.
ALTER TABLE alunos
ALTER COLUMN cidade SET DEFAULT 'Santos';

-- Renomear telefone para celular e ajustar o tamanho.
ALTER TABLE alunos
CHANGE COLUMN telefone celular VARCHAR(15);

-- Remover a coluna CPF (e os dados nela armazenados).
ALTER TABLE alunos
DROP COLUMN cpf;

-- Conferir a estrutura final da tabela.
DESCRIBE alunos;
