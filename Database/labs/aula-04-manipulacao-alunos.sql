-- Aula 4 — Cadastro e atualização de alunos
-- Conteúdo: CREATE DATABASE, CREATE TABLE, INSERT, SELECT, DESCRIBE e UPDATE

CREATE DATABASE escola;

USE escola;

-- Criar a tabela de alunos.
CREATE TABLE alunos (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    nascimento DATE,
    sexo ENUM('M', 'F'),
    email VARCHAR(100),
    curso VARCHAR(50),
    nota DECIMAL(4,2),
    cidade VARCHAR(50) DEFAULT 'São Paulo',
    celular VARCHAR(15)
);

-- Inserir os 30 registros de exemplo.
-- Execute este INSERT apenas uma vez para não duplicar os alunos.
INSERT INTO alunos
    (nome, nascimento, sexo, email, curso, nota, cidade, celular)
VALUES
    ('Ana Silva', '2008-03-15', 'F', 'ana.silva@email.com', 'Informática', 8.50, 'São Paulo', '11987650001'),
    ('Bruno Santos', '2007-07-22', 'M', 'bruno.santos@email.com', 'Administração', 7.00, 'Santo André', '11987650002'),
    ('Carla Oliveira', '2008-11-05', 'F', 'carla.oliveira@email.com', 'Informática', 9.25, 'São Bernardo do Campo', '11987650003'),
    ('Daniel Souza', '2007-01-18', 'M', 'daniel.souza@email.com', 'Logística', 5.50, 'Diadema', '11987650004'),
    ('Eduarda Lima', '2008-06-30', 'F', 'eduarda.lima@email.com', 'Administração', 6.75, 'Mauá', '11987650005'),
    ('Felipe Costa', '2007-09-12', 'M', 'felipe.costa@email.com', 'Informática', 4.00, 'São Paulo', '11987650006'),
    ('Gabriela Pereira', '2008-02-08', 'F', 'gabriela.pereira@email.com', 'Logística', 8.00, 'Osasco', '11987650007'),
    ('Henrique Almeida', '2007-12-25', 'M', 'henrique.almeida@email.com', 'Administração', 3.50, 'Guarulhos', '11987650008'),
    ('Isabela Rodrigues', '2008-04-17', 'F', 'isabela.rodrigues@email.com', 'Informática', 9.75, 'Santo André', '11987650009'),
    ('João Martins', '2007-08-09', 'M', 'joao.martins@email.com', 'Logística', 6.00, 'Diadema', '11987650010'),
    ('Karen Ferreira', '2008-10-21', 'F', 'karen.ferreira@email.com', 'Administração', 7.50, 'São Paulo', '11987650011'),
    ('Lucas Gomes', '2007-05-14', 'M', 'lucas.gomes@email.com', 'Informática', 5.75, 'Mauá', '11987650012'),
    ('Mariana Ribeiro', '2008-01-27', 'F', 'mariana.ribeiro@email.com', 'Logística', 8.75, 'Osasco', '11987650013'),
    ('Nicolas Carvalho', '2007-11-03', 'M', 'nicolas.carvalho@email.com', 'Administração', 4.50, 'Guarulhos', '11987650014'),
    ('Olivia Barbosa', '2008-07-19', 'F', 'olivia.barbosa@email.com', 'Informática', 10.00, 'São Bernardo do Campo', '11987650015'),
    ('Pedro Araujo', '2007-02-11', 'M', 'pedro.araujo@email.com', 'Logística', 6.25, 'São Paulo', '11987650016'),
    ('Quiteria Mendes', '2008-09-06', 'F', 'quiteria.mendes@email.com', 'Administração', 7.25, 'Santo André', '11987650017'),
    ('Rafael Nunes', '2007-04-29', 'M', 'rafael.nunes@email.com', 'Informática', 2.50, 'Diadema', '11987650018'),
    ('Sofia Cardoso', '2008-12-13', 'F', 'sofia.cardoso@email.com', 'Logística', 9.00, 'Mauá', '11987650019'),
    ('Thiago Teixeira', '2007-06-07', 'M', 'thiago.teixeira@email.com', 'Administração', 5.00, 'Osasco', '11987650020'),
    ('Valentina Moreira', '2008-05-24', 'F', 'valentina.moreira@email.com', 'Informática', 8.25, 'Guarulhos', '11987650021'),
    ('William Castro', '2007-10-16', 'M', 'william.castro@email.com', 'Logística', 6.50, 'São Paulo', '11987650022'),
    ('Yasmin Dias', '2008-08-02', 'F', 'yasmin.dias@email.com', 'Administração', 3.75, 'Santo André', '11987650023'),
    ('André Lopes', '2007-03-20', 'M', 'andre.lopes@email.com', 'Informática', 7.75, 'Diadema', '11987650024'),
    ('Beatriz Freitas', '2008-11-28', 'F', 'beatriz.freitas@email.com', 'Logística', 4.25, 'Mauá', '11987650025'),
    ('Caio Machado', '2007-07-05', 'M', 'caio.machado@email.com', 'Administração', 9.50, 'Osasco', '11987650026'),
    ('Débora Batista', '2008-02-14', 'F', 'debora.batista@email.com', 'Informática', 6.80, 'Guarulhos', '11987650027'),
    ('Enzo Fernandes', '2007-12-01', 'M', 'enzo.fernandes@email.com', 'Logística', 5.25, 'São Paulo', '11987650028'),
    ('Fernanda Reis', '2008-04-09', 'F', 'fernanda.reis@email.com', 'Administração', 8.90, 'Santo André', '11987650029'),
    ('Gustavo Correia', '2007-09-23', 'M', 'gustavo.correia@email.com', 'Informática', 7.20, 'Diadema', '11987650030');

-- Consultar os registros e a estrutura da tabela.
SELECT * FROM alunos;
DESCRIBE alunos;

-- Atualizar a nota da aluna com ID 1.
UPDATE alunos
SET nota = 9.00
WHERE id = 1;

-- Alterar o e-mail do registro com ID 1.
UPDATE alunos
SET email = 'ana.souza@email.com'
WHERE id = 1;

-- Conferir os dados após as primeiras alterações.
SELECT * FROM alunos;

-- Atualizar várias colunas do registro com ID 2.
UPDATE alunos
SET nome = 'Bruno Venceslau',
    email = 'bruno.venceslau@email.com',
    nota = 3.50
WHERE id = 2;

-- Alterar a nota e o curso do registro com ID 3.
UPDATE alunos
SET nota = 8.50,
    curso = 'Administração'
WHERE id = 3;

-- Somar 1 ponto às notas inferiores a 6.
-- O AND id > 0 pode ajudar no Safe Update Mode do MySQL Workbench.
UPDATE alunos
SET nota = nota + 1.00
WHERE nota < 6.00
  AND id > 0;

-- Conferir o resultado final.
SELECT * FROM alunos;
