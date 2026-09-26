# RELATÓRIO — TIPOS PRIMITIVOS E CRIAÇÃO DE BANCO DE DADOS

## 1. Introdução

O conteúdo apresentou os conceitos relacionados à criação de bancos de dados e aos tipos primitivos utilizados no MySQL. Um banco de dados organiza e armazena informações de maneira estruturada. Dentro dele, as tabelas armazenam registros, e cada coluna deve utilizar um tipo de dado adequado.

A escolha correta dos tipos de dados é importante para economizar espaço, melhorar o desempenho e garantir a integridade das informações armazenadas.

## 2. Estrutura de um banco de dados

A estrutura de um banco de dados pode ser compreendida por meio de uma hierarquia. O banco de dados funciona como um container que reúne as tabelas. As tabelas são organizadas em colunas e armazenam os registros, que representam os dados cadastrados.

Essa organização permite separar as informações de forma estruturada, facilitando seu gerenciamento e sua consulta.

## 3. Comandos fundamentais

Entre os comandos básicos apresentados estão os comandos para criar, acessar e consultar bancos de dados e tabelas.

### Criar um banco de dados

```sql
CREATE DATABASE cadastros;
```

Esse comando cria um banco de dados chamado `cadastros`.

### Criar uma tabela

```sql
CREATE TABLE pessoas (
    id INT,
    nome VARCHAR(100),
    idade INT
);
```

O comando cria uma tabela chamada `pessoas` com colunas para identificação, nome e idade.

### Acessar um banco de dados

```sql
USE cadastros;
```

O comando `USE` seleciona o banco de dados que será utilizado nos comandos seguintes.

### Descrever uma tabela

```sql
DESCRIBE pessoas;
```

Esse comando exibe a estrutura da tabela, incluindo suas colunas e os respectivos tipos de dados.

## 4. Tipos primitivos de dados

Os tipos de dados apresentados no MySQL podem ser organizados em categorias conforme o tipo de informação armazenada.

### 4.1 Tipos numéricos

Os tipos numéricos armazenam valores inteiros ou valores com casas decimais.

- **TINYINT:** indicado para números pequenos e ocupa pouco espaço.
- **SMALLINT:** utilizado para números pequenos ou médios.
- **MEDIUMINT:** possui uma faixa intermediária entre `SMALLINT` e `INT`.
- **INT (INTEGER):** utilizado para números inteiros em geral.
- **BIGINT:** indicado para números inteiros muito grandes.
- **DECIMAL:** armazena números com precisão exata e é recomendado para valores monetários.
- **FLOAT:** armazena números decimais com menor precisão.
- **DOUBLE:** possui maior capacidade e precisão que `FLOAT` em diversas situações.
- **REAL:** pode ser utilizado de forma semelhante ao `DOUBLE`, conforme a configuração do banco.

A escolha deve considerar o tamanho máximo esperado. Para valores financeiros, o tipo `DECIMAL` é mais adequado do que `FLOAT` ou `DOUBLE`.

### 4.2 Tipos lógicos

Os tipos lógicos representam valores verdadeiros ou falsos. O tipo `BOOLEAN` melhora a legibilidade do código, enquanto `BIT` pode armazenar valores binários, como `0` e `1`.

Esses tipos são úteis para campos como `ativo`, `aprovado` ou `disponivel`.

### 4.3 Tipos de data e hora

Os tipos de data e hora armazenam diferentes componentes temporais:

- **DATE:** armazena somente a data no formato `YYYY-MM-DD`.
- **DATETIME:** armazena data e hora completas.
- **TIMESTAMP:** armazena data e hora e pode ser usado para registrar automaticamente momentos de criação ou alteração.
- **TIME:** armazena somente o horário.
- **YEAR:** armazena somente o ano.

Por exemplo, `DATE` pode ser utilizado para uma data de nascimento, enquanto `DATETIME` pode registrar o momento de uma transação.

### 4.4 Tipos de texto e caracteres

Os tipos `CHAR` e `VARCHAR` armazenam caracteres. O `CHAR` possui tamanho fixo, enquanto o `VARCHAR` possui tamanho variável e utiliza somente o espaço necessário para o conteúdo.

Para nomes, endereços e e-mails, o `VARCHAR` costuma ser mais adequado por ser flexível e evitar desperdício de espaço.

Para textos maiores, existem os tipos `TINYTEXT`, `TEXT`, `MEDIUMTEXT` e `LONGTEXT`, que possuem diferentes limites de armazenamento.

### 4.5 Tipos binários

Os tipos `BLOB` armazenam dados binários, como imagens, arquivos e documentos. Eles podem ser divididos em `TINYBLOB`, `BLOB`, `MEDIUMBLOB` e `LONGBLOB`, de acordo com a quantidade de dados que precisam armazenar.

A escolha do tamanho deve considerar o conteúdo esperado e o impacto no desempenho do banco de dados.

### 4.6 Tipos de coleção

O tipo `ENUM` permite escolher um único valor entre opções predefinidas. Já o tipo `SET` permite armazenar uma ou mais opções de uma lista.

Um exemplo de uso seria utilizar `ENUM` para definir um tipo de acesso, como `admin` ou `user`.

### 4.7 Tipos espaciais

Os tipos espaciais armazenam dados geográficos e formas geométricas. Entre eles estão `GEOMETRY`, `POINT`, `POLYGON` e `MULTIPOLYGON`.

Esses tipos são utilizados em aplicações de mapas, localização e cálculo de áreas.

## 5. Dimensionamento dos tipos de dados

O dimensionamento correto dos tipos de dados é um dos pontos mais importantes no planejamento de um banco de dados. Um `TINYINT` utiliza menos espaço que um `BIGINT`, e essa diferença pode ser significativa quando a tabela possui milhões de registros.

Além da economia de espaço, tipos adequados podem melhorar o desempenho das consultas e impedir o armazenamento de valores inválidos. Também é necessário considerar a precisão: `DECIMAL` evita perdas em valores monetários, enquanto tipos de ponto flutuante podem apresentar pequenas diferenças de precisão.

## 6. Exemplo prático

Um exemplo de tabela que combina diferentes tipos de dados é:

```sql
CREATE TABLE usuario (
    id INT,
    nome VARCHAR(100),
    email VARCHAR(150),
    data_nascimento DATE,
    ativo BOOLEAN,
    salario DECIMAL(10,2),
    foto_perfil BLOB,
    tipo_acesso ENUM('admin', 'user')
);
```

Nesse exemplo, cada coluna foi definida de acordo com o tipo de informação que será armazenada: `INT` para o identificador, `VARCHAR` para textos, `DATE` para a data, `BOOLEAN` para uma condição lógica, `DECIMAL` para o salário, `BLOB` para uma imagem e `ENUM` para uma lista limitada de opções.

## 7. O que compreendi

Compreendi que os tipos primitivos são fundamentais para a criação de bancos de dados eficientes. Cada tipo possui uma finalidade específica, e sua escolha influencia o espaço ocupado, o desempenho e a integridade dos dados.

Também compreendi que o dimensionamento deve ser planejado desde o início. Utilizar `TINYINT` ou `SMALLINT` quando os valores são pequenos pode economizar espaço, assim como utilizar `VARCHAR` para textos de tamanho variável. Para valores monetários, o uso de `DECIMAL` oferece maior segurança e precisão.

Como foi ressaltado por Gustavo Guanabara, dimensionar corretamente no começo ajuda a evitar problemas futuros. Esse cuidado é uma boa prática importante para o desenvolvimento de aplicações robustas com MySQL.
