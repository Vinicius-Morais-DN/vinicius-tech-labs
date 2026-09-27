-- ============================================
-- BANCO DE DADOS
-- ============================================

CREATE DATABASE SRTbd;

SHOW DATABASES;

USE SRTbd;


-- ============================================
-- TABELA PESSOAS
-- ============================================

CREATE TABLE Pessoas (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    nascimento DATE,
    sexo ENUM('M', 'F'),
    peso DECIMAL(5,2),
    altura DECIMAL(3,2),
    nacionalidade VARCHAR(20) DEFAULT 'Brasil'
);


-- ============================================
-- CONSULTANDO A ESTRUTURA DA TABELA
-- ============================================

DESCRIBE pessoas;

SELECT * FROM pessoas;


-- ============================================
-- INSERINDO DADOS
-- ============================================

INSERT INTO pessoas
    (nome, nascimento, sexo, peso, altura)
VALUES
    ('Joaquim', '1992-08-15', 'M', 82.4, 1.78),
    ('Mariana', '2001-03-22', 'F', 61.5, 1.65),
    ('Rafael', '1978-11-09', 'M', 91.3, 1.84),
    ('Camila', '1996-06-17', 'F', 68.2, 1.70);


-- ============================================
-- EXCLUINDO UM REGISTRO
-- ============================================

DELETE FROM pessoas
WHERE id IN (19);


-- ============================================
-- CONSULTANDO OS DADOS
-- ============================================

SELECT * FROM pessoas;


-- ============================================
-- INSERINDO UM REGISTRO COM POUCOS CAMPOS
-- ============================================

INSERT INTO pessoas
    (nome, sexo)
VALUES
    ('Marcos', 'M');


-- ============================================
-- INSERINDO ÍRIS
-- ============================================

INSERT INTO pessoas
    (nome, nascimento, sexo, peso, altura, nacionalidade)
VALUES
    ('Irís', '2026-06-17', 'F', 55.0, 1.60, 'Brasil');


-- ============================================
-- INSERINDO PESSOAS COM NACIONALIDADES DIFERENTES
-- ============================================

INSERT INTO pessoas
    (nome, nascimento, sexo, peso, altura, nacionalidade)
VALUES
    ('Lucas', '1994-02-11', 'M', 78.5, 1.80, 'Portugal'),
    ('Sofia', '2000-07-23', 'F', 62.3, 1.67, 'Argentina'),
    ('Daniel', '1988-12-05', 'M', 85.7, 1.83, 'EUA'),
    ('Yuki', '1997-09-14', 'F', 55.8, 1.60, 'Japão'),
    ('Hans', '1982-05-30', 'M', 92.1, 1.88, 'Alemanha'),
    ('Amelia', '1995-11-19', 'F', 67.4, 1.72, 'Inglaterra');


-- ============================================
-- CONSULTA FINAL
-- ============================================

SELECT * FROM pessoas;