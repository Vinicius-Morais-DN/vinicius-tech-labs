# Relatório: Tipos Primitivos e Criação de Banco de Dados

## 1. Introdução

Um banco de dados é um container que organiza e armazena dados de forma estruturada. Para que funcione, é necessário criar bancos de dados e, dentro deles, tabelas que contêm registros. Além disso, escolher o tipo de dado correto para cada coluna é fundamental para otimizar espaço e garantir integridade dos dados.

## 2. Estrutura Hierárquica: Do Banco aos Registros

Assim como um navio é dividido em contêineres, e cada contêiner tem compartimentos, um banco de dados segue a mesma lógica:

- **Banco de Dados** = o container do navio (contém tudo)
- **Tabelas** = os compartimentos dentro do contêiner (organizadas em locais específicos)
- **Registros** = os dados armazenados nas tabelas (as coisas dentro dos compartimentos)

Todos com características separadas, mas organizados de forma estruturada.

## 3. Comandos Fundamentais

### Criar um Banco de Dados

```sql
CREATE DATABASE cadastros;
```

Este comando cria um novo banco de dados chamado "cadastros" onde você armazenará suas tabelas.

### Criar uma Tabela

```sql
CREATE TABLE pessoas (
    id INT,
    nome VARCHAR(100),
    idade INT
);
```

Cria uma tabela chamada "pessoas" com colunas de diferentes tipos de dados.

### Acessar um Banco de Dados

```sql
USE cadastros;
```

Seleciona o banco de dados para trabalhar com ele.

### Descrever uma Tabela

```sql
DESCRIBE pessoas;
```

Mostra a estrutura da tabela, incluindo nomes das colunas e tipos de dados.

## 4. Tipos Primitivos de Dados

Os tipos primitivos em SQL se dividem em **7 categorias principais**, conforme mostrado no diagrama de tipos primitivos do MySQL:

### A) NUMÉRICO

Armazena números com ou sem casa decimal.

#### Subtipo: Inteiro

| Tipo | Descrição |
|------|-----------|
| **TinyInt** | 0 a 255 (ou -128 a 127) - usa pouco espaço, ideal para valores pequenos |
| **SmallInt** | 0 a 65535 - para números pequenos a médios |
| **Int (Integer)** | Números inteiros em geral, faixa maior |
| **MediumInt** | Faixa intermediária entre SmallInt e Int |
| **BigInt** | Para números muito grandes, até bilhões |

#### Subtipo: Real

| Tipo | Descrição |
|------|-----------|
| **Decimal** | Números com precisão exata (recomendado para valores monetários) |
| **Float** | Números com vírgula, menor precisão que Decimal |
| **Double** | Maior capacidade que Float, mais espaço |
| **Real** | Similar ao Double |

**Quando usar:** Use tipos menores (TinyInt, SmallInt) quando sabe que o número é pequeno. Use Decimal para dinheiro. Float/Double para cálculos científicos.

---

### B) LÓGICO

Armazena valores verdadeiro ou falso.

| Tipo | Descrição |
|------|-----------|
| **Bit** | Armazena 0 ou 1 (um bit por valor) |
| **Boolean** | Armazena TRUE ou FALSE (mais legível) |

**Quando usar:** Para campos sim/não, ativo/inativo, verdadeiro/falso.

---

### C) DATA/TEMPO

Armazena datas e horários.

| Tipo | Descrição |
|------|-----------|
| **Date** | Apenas a data (YYYY-MM-DD) |
| **DateTime** | Data e hora completa (YYYY-MM-DD HH:MM:SS) |
| **TimeStamp** | Semelhante ao DateTime, marca automaticamente quando um registro é criado |
| **Time** | Apenas a hora (HH:MM:SS) |
| **Year** | Apenas o ano (YYYY) |

**Quando usar:** Date para datas de nascimento. DateTime para registros de transações. TimeStamp para auditorias. Year para períodos.

---

### D) LITERAL - CARACTERE

| Tipo | Descrição |
|------|-----------|
| **Char(n)** | Tamanho fixo - ocupa sempre o mesmo espaço (ex: Char(10) sempre usa 10 caracteres) |
| **VarChar(n)** | Tamanho variável - usa apenas o espaço necessário (mais eficiente) |

**Quando usar:** VarChar é preferível a Char (economiza espaço). Use para nomes, endereços, e-mails.

---

### E) LITERAL - TEXTO

| Tipo | Descrição |
|------|-----------|
| **TinyText** | Até 255 caracteres - pequenos textos |
| **Text** | Até 65.535 caracteres - textos médios |
| **MediumText** | Até 16 milhões de caracteres - textos longos |
| **LongText** | Até 4 bilhões de caracteres - muito grande |

**Quando usar:** TinyText para descrições curtas. Text para comentários. MediumText/LongText para grandes documentos.

---

### F) LITERAL - BINÁRIO

Armazena dados não-texto (imagens, arquivos, etc).

| Tipo | Descrição |
|------|-----------|
| **TinyBlob** | Até 255 bytes - arquivos muito pequenos |
| **Blob** | Até 65.535 bytes - fotos, PDFs pequenos |
| **MediumBlob** | Até 16 MB - vídeos curtos, arquivos médios |
| **LongBlob** | Até 4 GB - arquivos grandes |

**Quando usar:** Blob para fotos de perfil. MediumBlob para vídeos. LongBlob para armazenamentos grandes (cuidado com desempenho).

---

### G) LITERAL - COLEÇÃO

Armazena múltiplos valores em um único campo.

| Tipo | Descrição |
|------|-----------|
| **Enum** | Escolher um valor de uma lista pré-definida (ex: Enum('M', 'F') para sexo) |
| **Set** | Escolher múltiplos valores de uma lista (ex: Set('leitura', 'games', 'esportes')) |

**Quando usar:** Enum para dados limitados e bem-definidos. Set para múltiplas seleções.

---

### H) ESPACIAL

Armazena dados geográficos.

| Tipo | Descrição |
|------|-----------|
| **Geometry** | Formas geométricas em geral |
| **Point** | Um ponto específico (latitude, longitude) |
| **Polygon** | Um polígono (área com múltiplos pontos) |
| **MultiPolygon** | Múltiplos polígonos |

**Quando usar:** Para aplicações de mapa, geolocalização, cálculo de áreas.

---

## 5. Dimensionamento: O Ponto Crítico

### Por que é importante dimensionar corretamente?

**Economia de espaço** - Um TinyInt usa 1 byte. Um BigInt usa 8 bytes. Se você armazena 1 milhão de registros, a diferença é gigantesca.

**Desempenho** - Bancos de dados menores são mais rápidos. Menos dados = menos tempo de busca.

**Integridade** - Escolher o tipo correto evita dados inválidos (ex: texto em campo numérico).

**Compatibilidade** - Cada tipo tem precisão diferente (Float pode perder casas decimais; Decimal não).

### Exemplo Prático

```sql
CREATE TABLE usuario (
    id INT,                          -- Números inteiros para ID
    nome VARCHAR(100),               -- Texto variável, máximo 100 caracteres
    email VARCHAR(150),              -- Email tem tamanho variável
    data_nascimento DATE,            -- Apenas data
    ativo BOOLEAN,                   -- Sim ou não
    salario DECIMAL(10,2),           -- Dinheiro: 10 dígitos, 2 casas decimais
    foto_perfil BLOB,                -- Imagem
    tipo_acesso ENUM('admin','user') -- Escolher um
);
```

---

## 6. Conclusão

O domínio de tipos primitivos é fundamental para criar bancos de dados eficientes. Cada tipo tem seu lugar e propósito. A escolha correta economiza espaço, melhora performance e garante integridade dos dados.

Como Gustavo Guanabara ressaltou, **dimensionar corretamente no começo evita problemas futuros**. Um banco de dados bem planejado é a base de qualquer aplicação robusta. Compreender as diferenças entre TinyInt e BigInt, entre VarChar e Char, entre Decimal e Float, não é apenas uma questão técnica — é uma questão de profissionalismo e boas práticas em desenvolvimento.
