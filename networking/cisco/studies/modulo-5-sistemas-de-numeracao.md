# Módulo 5 — **Sistemas de numeração**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy  
**Data do módulo:** 06/04/2026

## 1. Sistema de numeração binário

### 1.1 — Bases numéricas

Um sistema de numeração utiliza símbolos e posições para representar valores. A base indica quantos símbolos diferentes são utilizados.

| Sistema | Base | Símbolos |
|---|---:|---|
| Decimal | 10 | 0 a 9 |
| Binário | 2 | 0 e 1 |
| Hexadecimal | 16 | 0 a 9 e A a F |

No sistema decimal, as posições representam potências de 10. No binário, representam potências de 2.

**Exemplo decimal:**

```text
583 = 5 × 100 + 8 × 10 + 3
583 = 500 + 80 + 3
```

**Exemplo binário:**

```text
1011₂ = 1 × 8 + 0 × 4 + 1 × 2 + 1 × 1
1011₂ = 8 + 0 + 2 + 1 = 11₁₀
```

Os subscritos indicam a base: ₂ para binário e ₁₀ para decimal.

### 1.2 — Bits, bytes e octetos

- **Bit:** menor unidade de informação, que pode assumir o valor `0` ou `1`.
- **Byte:** conjunto de 8 bits.
- **Octeto:** termo utilizado em redes para representar um grupo de 8 bits.

Exemplo de um octeto:

```text
10101100
```

Cada posição possui um valor correspondente a uma potência de 2:

| Posição | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Valor | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

O bit mais à esquerda é o **mais significativo**, enquanto o mais à direita é o **menos significativo**.

### 1.3 — Conversão de binário para decimal

Para converter um número binário em decimal:

1. Alinhe cada bit com seu valor posicional.
2. Considere apenas as posições que possuem `1`.
3. Some os valores correspondentes.

**Exemplo: 11010110₂**

```text
1 × 128 + 1 × 64 + 0 × 32 + 1 × 16
+ 0 × 8 + 1 × 4 + 1 × 2 + 0 × 1

128 + 64 + 16 + 4 + 2 = 214
```

Resultado:

```text
11010110₂ = 214₁₀
```

Outro exemplo:

```text
10101010₂ = 128 + 32 + 8 + 2
10101010₂ = 170₁₀
```

O maior valor representável por um octeto é:

```text
11111111₂ = 255₁₀
```

### 1.4 — Conversão de decimal para binário

Existem dois métodos principais.

**Método 1: subtração de potências de 2**

Verifique quais potências de 2 podem ser subtraídas do número. Quando uma potência puder ser utilizada, registre `1`; caso contrário, registre `0`.

Exemplo: converter 156 para binário.

| Valor posicional | Operação | Bit |
|---:|---|---:|
| 128 | 156 − 128 = 28 | 1 |
| 64 | Não cabe em 28 | 0 |
| 32 | Não cabe em 28 | 0 |
| 16 | 28 − 16 = 12 | 1 |
| 8 | 12 − 8 = 4 | 1 |
| 4 | 4 − 4 = 0 | 1 |
| 2 | Não utilizado | 0 |
| 1 | Não utilizado | 0 |

Resultado:

```text
156₁₀ = 10011100₂
```

Conferência: 128 + 16 + 8 + 4 = 156.

**Método 2: divisões sucessivas por 2**

Divida o número por 2 e anote os restos. Depois, leia os restos de baixo para cima.

Exemplo: converter 25 para binário.

| Divisão | Quociente | Resto |
|---|---:|---:|
| 25 ÷ 2 | 12 | 1 |
| 12 ÷ 2 | 6 | 0 |
| 6 ÷ 2 | 3 | 0 |
| 3 ÷ 2 | 1 | 1 |
| 1 ÷ 2 | 0 | 1 |

Resultado:

```text
25₁₀ = 11001₂
```

Para representar o número em um octeto, adicione zeros à esquerda:

```text
25₁₀ = 00011001₂
```

Os zeros à esquerda não alteram o valor numérico.

### 1.5 — Potências de 2 importantes

| Potência | Valor |
|---|---:|
| 2⁰ | 1 |
| 2¹ | 2 |
| 2² | 4 |
| 2³ | 8 |
| 2⁴ | 16 |
| 2⁵ | 32 |
| 2⁶ | 64 |
| 2⁷ | 128 |
| 2⁸ | 256 |
| 2⁹ | 512 |
| 2¹⁰ | 1024 |
| 2¹¹ | 2048 |
| 2¹² | 4096 |
| 2¹⁶ | 65536 |
| 2³² | 4294967296 |

Para um octeto, utilizamos as potências de 2⁰ até 2⁷.

### 1.6 — Operações binárias básicas

**Soma binária**

| Operação | Resultado |
|---|---|
| 0 + 0 | 0 |
| 0 + 1 | 1 |
| 1 + 0 | 1 |
| 1 + 1 | 10 |

Quando `1 + 1 = 10`, escrevemos `0` e transportamos `1` para a próxima posição.

Exemplo:

```text
   1011
 + 0110
 -------
  10001
```

A conferência em decimal é 11 + 6 = 17.

**Operações lógicas**

| A | B | AND | OR | XOR |
|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

- **AND:** resulta em `1` somente quando os dois bits são `1`.
- **OR:** resulta em `1` quando pelo menos um bit é `1`.
- **XOR:** resulta em `1` quando os bits são diferentes.

Essas operações são úteis para compreender máscaras de sub-rede e outros processos de rede.

### 1.7 — Binário em endereços IPv4

Um endereço IPv4 possui **32 bits**, divididos em quatro octetos de 8 bits.

Exemplo:

```text
IPv4: 192.168.10.25

192 = 11000000
168 = 10101000
10  = 00001010
25  = 00011001
```

Representação completa:

```text
192.168.10.25 =
11000000.10101000.00001010.00011001
```

Cada octeto pode representar valores de 0 a 255.

**Máscaras de sub-rede em binário**

Uma máscara IPv4 também possui 32 bits.

```text
255.255.255.0
= 11111111.11111111.11111111.00000000
= /24
```

O prefixo `/24` indica 24 bits com valor `1`.

Outro exemplo:

```text
255.255.255.192
= 11111111.11111111.11111111.11000000
= /26
```

Nesse caso, existem 26 bits `1`.

## 2. Sistema de numeração hexadecimal

### 2.1 — O que é hexadecimal?

O sistema hexadecimal possui base 16. Ele utiliza os algarismos de `0` a `9` e as letras de `A` a `F`.

Cada dígito hexadecimal representa exatamente **4 bits**, o que facilita a leitura de sequências binárias.

### 2.2 — Tabela de conversão: decimal, hexadecimal e binário

Esta é uma das tabelas mais importantes para memorizar para a prova.

| Decimal | Hexadecimal | Binário |
|---:|:---:|:---:|
| 0 | 0 | 0000 |
| 1 | 1 | 0001 |
| 2 | 2 | 0010 |
| 3 | 3 | 0011 |
| 4 | 4 | 0100 |
| 5 | 5 | 0101 |
| 6 | 6 | 0110 |
| 7 | 7 | 0111 |
| 8 | 8 | 1000 |
| 9 | 9 | 1001 |
| 10 | A | 1010 |
| 11 | B | 1011 |
| 12 | C | 1100 |
| 13 | D | 1101 |
| 14 | E | 1110 |
| 15 | F | 1111 |

Memorize principalmente a correspondência de `A` a `F`, pois ela aparece frequentemente nas conversões.

### 2.3 — Conversão de hexadecimal para decimal

Multiplique cada dígito pela potência de 16 correspondente à sua posição e some os resultados.

Exemplo: converter 2F₁₆ para decimal.

```text
2F₁₆ = 2 × 16¹ + 15 × 16⁰
     = 32 + 15
     = 47₁₀
```

Outro exemplo:

```text
A3₁₆ = 10 × 16 + 3
     = 160 + 3
     = 163₁₀
```

Para números com mais dígitos, as posições continuam seguindo as potências de 16: 16⁰, 16¹, 16² e assim por diante.

### 2.4 — Conversão de decimal para hexadecimal

Divida sucessivamente o número por 16 e leia os restos de baixo para cima. Os restos de 10 a 15 são representados pelas letras A a F.

Exemplo: converter 254 para hexadecimal.

| Divisão | Quociente | Resto |
|---|---:|---|
| 254 ÷ 16 | 15 | 14 = E |
| 15 ÷ 16 | 0 | 15 = F |

Resultado:

```text
254₁₀ = FE₁₆
```

Conferência: 15 × 16 + 14 = 254.

Outro exemplo:

```text
200₁₀ = C8₁₆
```

### 2.5 — Conversão de binário para hexadecimal

Agrupe os bits de quatro em quatro, começando pela direita. Se o grupo da esquerda ficar incompleto, complete-o com zeros à esquerda.

Exemplo:

```text
10101110₂
1010 1110
  A    E
```

Resultado:

```text
10101110₂ = AE₁₆
```

Outro exemplo:

```text
1101011₂
0110 1011
  6    B
```

Resultado:

```text
1101011₂ = 6B₁₆
```

### 2.6 — Conversão de hexadecimal para binário

Substitua cada dígito hexadecimal pelo grupo de quatro bits correspondente na tabela.

Exemplo:

```text
4D₁₆

4 = 0100
D = 1101

4D₁₆ = 01001101₂
```

Outro exemplo:

```text
B7₁₆

B = 1011
7 = 0111

B7₁₆ = 10110111₂
```

Ao trabalhar com redes, manter os grupos de quatro bits organizados facilita a leitura e a conferência.

### 2.7 — Hexadecimal em endereços de rede

**Endereço MAC**

Um endereço MAC possui 48 bits e costuma ser representado por seis grupos de dois dígitos hexadecimais.

Exemplo:

```text
00:1A:2B:3C:4D:5E
```

Como cada dígito hexadecimal representa 4 bits:

```text
12 dígitos × 4 bits = 48 bits
```

**Endereço IPv6**

Um endereço IPv6 possui 128 bits e é representado por oito grupos de até quatro dígitos hexadecimais.

Exemplo:

```text
2001:0DB8:0000:0000:0000:FF00:0042:8329
```

Cada grupo completo de quatro dígitos representa 16 bits:

```text
4 dígitos × 4 bits = 16 bits
8 grupos × 16 bits = 128 bits
```

O hexadecimal torna a representação dos endereços IPv6 mais compacta e legível.

## 3. Exercícios resolvidos

### Exercício 1 — Binário para decimal

Converter 10110101₂:

```text
128 + 32 + 16 + 4 + 1 = 181
```

**Resposta:** 10110101₂ = 181₁₀.

### Exercício 2 — Decimal para binário

Converter 173₁₀:

```text
173 - 128 = 45  → 1
45 - 64 não cabe → 0
45 - 32 = 13    → 1
13 - 16 não cabe → 0
13 - 8 = 5      → 1
5 - 4 = 1       → 1
1 - 2 não cabe  → 0
1 - 1 = 0       → 1
```

**Resposta:** 173₁₀ = 10101101₂.

### Exercício 3 — Binário para hexadecimal

Converter 110011001111₂:

```text
1100 1100 1111
  C    C    F
```

**Resposta:** 110011001111₂ = CCF₁₆.

### Exercício 4 — Hexadecimal para binário

Converter 9A3₁₆:

```text
9 = 1001
A = 1010
3 = 0011
```

**Resposta:** 9A3₁₆ = 100110100011₂.

### Exercício 5 — Hexadecimal para decimal

Converter D4₁₆:

```text
D × 16 + 4
13 × 16 + 4
208 + 4 = 212
```

**Resposta:** D4₁₆ = 212₁₀.

### Exercício 6 — Decimal para hexadecimal

Converter 190₁₀:

```text
190 ÷ 16 = 11, resto 14 = E
11 ÷ 16 = 0, resto 11 = B
```

Lendo os restos de baixo para cima:

**Resposta:** 190₁₀ = BE₁₆.

### Exercício 7 — IPv4 para binário

Converter `10.20.30.40`:

```text
10 = 00001010
20 = 00010100
30 = 00011110
40 = 00101000
```

**Resposta:**

```text
10.20.30.40 =
00001010.00010100.00011110.00101000
```

### Exercício 8 — Máscara para binário

Converter `255.255.255.224`:

```text
255 = 11111111
255 = 11111111
255 = 11111111
224 = 11100000
```

**Resposta:**

```text
255.255.255.224 =
11111111.11111111.11111111.11100000
```

A máscara possui 8 + 8 + 8 + 3 = 27 bits `1`. Portanto, corresponde ao prefixo **/27**.

### Exercício 9 — Soma binária

```text
   11010110
 + 00101101
 ----------
  100000011
```

Conferência: 214 + 45 = 259.

**Resposta:** 11010110₂ + 00101101₂ = 100000011₂.

O resultado possui 9 bits. Se fosse armazenado em apenas 8 bits, o bit excedente seria transportado para fora do octeto (*carry-out*).

## 4. Dicas rápidas para a prova

### Regras fundamentais

- 1 bit pode assumir `0` ou `1`.
- 1 byte possui 8 bits.
- 1 octeto possui 8 bits.
- 1 dígito hexadecimal equivale a 4 bits.
- Um endereço IPv4 possui 32 bits.
- Um endereço MAC possui 48 bits.
- Um endereço IPv6 possui 128 bits.
- O maior valor de um octeto é 255.
- Para converter binário em hexadecimal, agrupe os bits de quatro em quatro, começando pela direita.
- Para converter hexadecimal em binário, substitua cada dígito por quatro bits.
- Nas divisões sucessivas para conversão de decimal em binário ou hexadecimal, leia os restos de baixo para cima.
- Confira os resultados utilizando os valores posicionais.

### Erros comuns

**Confundir bit com byte:** lembre-se de que 1 byte = 8 bits.

**Esquecer zeros à esquerda:** o número decimal 5 pode ser representado como `101` em binário, mas, para completar um octeto, utilize `00000101`.

**Ler os restos na ordem errada:** nas divisões sucessivas, os restos devem ser lidos de baixo para cima.

**Confundir as letras hexadecimais:** `A = 10`, `B = 11`, `C = 12`, `D = 13`, `E = 14` e `F = 15`.

**Agrupar os bits do lado errado:** na conversão de binário para hexadecimal, comece pela direita e complete o grupo inicial com zeros, se necessário.

## 5. Resumo final

O sistema binário utiliza apenas `0` e `1`, sendo fundamental para o funcionamento dos computadores e equipamentos de rede. O hexadecimal utiliza os símbolos `0–9` e `A–F`, facilitando a representação de sequências binárias.

As conversões essenciais são:

| Conversão | Método |
|---|---|
| Binário → decimal | Somar os valores posicionais dos bits `1` |
| Decimal → binário | Subtrações de potências de 2 ou divisões por 2 |
| Binário → hexadecimal | Agrupar os bits de quatro em quatro |
| Hexadecimal → binário | Substituir cada dígito por quatro bits |
| Hexadecimal → decimal | Multiplicar pelas potências de 16 e somar |
| Decimal → hexadecimal | Divisões sucessivas por 16 |

```text
1 dígito hexadecimal = 4 bits
2 dígitos hexadecimais = 1 octeto = 8 bits
IPv4 = 32 bits
MAC = 48 bits
IPv6 = 128 bits
```

Dominar essas conversões ajuda na leitura de endereços IPv4, máscaras de sub-rede, endereços MAC e endereços IPv6.
