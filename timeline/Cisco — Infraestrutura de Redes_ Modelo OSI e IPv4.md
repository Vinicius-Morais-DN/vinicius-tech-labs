# Cisco — Infraestrutura de Redes: Modelo OSI e IPv4

**Data:** 14/08/2026  
**Área:** Redes  
**Tecnologia:** Cisco / Infraestrutura de Redes  
**Tópicos:** Modelo OSI, IPv4, endereçamento, máscara de sub-rede e subnetting  
**Nível:** Fundamentos

---

## 1. Modelo OSI — revisão

Durante a aula, revisei o **modelo OSI** e a relação entre suas camadas, suas funções e as unidades de dados utilizadas durante a comunicação.

| Camada | Nome | PDU / unidade de dados | Conceito principal |
|---|---|---|---|
| 7 | Aplicação | Dados | Serviços de rede utilizados pelas aplicações |
| 6 | Apresentação | Dados | Formatação, representação, criptografia e compressão |
| 5 | Sessão | Dados | Estabelecimento e gerenciamento de sessões |
| 4 | Transporte | Segmento / Datagrama | Comunicação fim a fim e controle da entrega |
| 3 | Rede | Pacote | Endereçamento lógico e roteamento |
| 2 | Enlace de Dados | Quadro (Frame) | Comunicação entre dispositivos na rede local |
| 1 | Física | Bits | Transmissão dos bits pelo meio físico |

### Encapsulamento

Ao enviar dados, as informações passam pelas camadas do modelo, recebendo as informações necessárias para serem transmitidas.

De forma simplificada:

**Dados → Segmento → Pacote → Quadro → Bits**

No destino ocorre o processo inverso, chamado **desencapsulamento**.

### Observação

A camada Física trabalha com **bits**, enquanto a camada de Enlace trabalha com **quadros (frames)** e a camada de Rede trabalha com **pacotes**.

> **Megabits por segundo (Mbps)** ou **Megabytes por segundo (MB/s)** representam taxas de transferência/banda, e não são a unidade de dados da camada Física.

---

# 2. NIC — Network Interface Card

Revisei também o conceito de **NIC (Network Interface Card)**, ou placa/interface de rede.

A NIC é responsável por fornecer a interface necessária para que um dispositivo possa se comunicar através de uma rede.

Ela trabalha principalmente com informações relacionadas ao acesso à rede e possui um **endereço MAC**, utilizado na comunicação da camada de Enlace.

Uma analogia utilizada durante o aprendizado foi pensar na NIC como uma espécie de **"porteiro" da comunicação de rede**: ela é a interface pela qual o dispositivo entra e se comunica com a rede.

---

# 3. ARP

O **ARP (Address Resolution Protocol)** é utilizado em redes IPv4 para descobrir o endereço MAC associado a um determinado endereço IP dentro da rede local.

A ideia básica é:

**IP → MAC**

Por exemplo:

```text
192.168.1.10 → AA:BB:CC:DD:EE:FF
```

O dispositivo pode manter informações aprendidas em uma **tabela/cache ARP**.

### Comando estudado

No Windows:

```bash
arp -a
```

Esse comando pode mostrar entradas ARP conhecidas pelo computador.

### ⚠️ Correção importante

O `arp -a` **não mostra os sites que você acessou**.

Ele mostra informações relacionadas ao mapeamento **IP ↔ endereço MAC** que o computador possui em sua tabela ARP.

Portanto:

```text
ARP ≠ histórico de navegação
```

Para descobrir histórico de sites acessados, seriam necessários outros mecanismos e registros, como histórico do navegador, logs de DNS, logs de firewall/proxy etc., dependendo do ambiente.

---

# 4. Endereçamento IPv4

O IPv4 utiliza endereços de **32 bits**.

Esses 32 bits são divididos em quatro grupos de 8 bits:

```text
8 bits . 8 bits . 8 bits . 8 bits
```

Cada grupo de 8 bits é chamado de **octeto**.

Exemplo:

```text
192.168.1.10
```

Em binário:

```text
11000000.10101000.00000001.00001010
```

Como cada octeto possui 8 bits, cada um pode representar valores de:

```text
0 até 255
```

O IPv4 possui, portanto:

```text
2³² = 4.294.967.296
```

combinações de endereços.

---

# 5. Binário e decimal

IPv4 utiliza representação decimal na forma como normalmente escrevemos os endereços, mas os computadores trabalham com bits.

Os valores de cada posição de um octeto são:

```text
128 64 32 16 8 4 2 1
```

Exemplo:

```text
11000000
```

Calculando:

```text
128 + 64 = 192
```

Portanto:

```text
11000000 = 192
```

---

# 6. Máscara de sub-rede

A máscara de sub-rede determina quais bits do endereço representam a **rede** e quais representam os **hosts**.

Exemplo:

```text
255.255.255.192
```

Em binário:

```text
11111111.11111111.11111111.11000000
```

Nesse caso temos:

```text
11111111 = 8 bits
11111111 = 8 bits
11111111 = 8 bits
11000000 = 2 bits
```

Portanto:

```text
8 + 8 + 8 + 2 = 26
```

A máscara é:

```text
255.255.255.192 = /26
```

---

# 7. Descobrindo o tamanho do bloco

Para descobrir o tamanho do bloco no octeto onde a máscara mudou de `255`, podemos utilizar:

```text
256 - valor da máscara
```

No exemplo:

```text
256 - 192 = 64
```

Portanto, o tamanho do bloco é:

```text
64
```

As redes começam em intervalos de 64:

```text
0
64
128
192
```

Por exemplo:

```text
192.168.1.0/26
192.168.1.64/26
192.168.1.128/26
192.168.1.192/26
```

---

# 8. Quantidade de endereços

Uma rede `/26` possui:

```text
32 - 26 = 6 bits
```

disponíveis para hosts.

Portanto:

```text
2⁶ = 64 endereços
```

Em uma subnet IPv4 tradicional, normalmente temos:

```text
64 endereços totais
- 1 endereço de rede
- 1 endereço de broadcast
= 62 endereços utilizáveis para hosts
```

---

# 9. Empréstimo de bits

Ao criar sub-redes, podemos utilizar alguns bits que anteriormente pertenciam à parte de hosts.

Por exemplo:

```text
/24
```

possui:

```text
11111111.11111111.11111111.00000000
```

Se utilizarmos 2 bits para criar sub-redes:

```text
11111111.11111111.11111111.11000000
```

Passamos de:

```text
/24
```

para:

```text
/26
```

Como foram utilizados 2 bits:

```text
2² = 4 sub-redes
```

E os bits restantes para hosts são:

```text
32 - 26 = 6
```

Logo:

```text
2⁶ = 64 endereços por sub-rede
```

### Importante

"Cada bit que retiro multiplica por 2" precisa ser entendido com contexto.

Ao **emprestar bits para a parte de rede**, cada bit adicional dobra a quantidade de sub-redes possíveis:

```text
1 bit → 2 sub-redes
2 bits → 4 sub-redes
3 bits → 8 sub-redes
4 bits → 16 sub-redes
```

Ao mesmo tempo, diminuem os bits disponíveis para hosts.

---

# 10. Rede, host e prefixo

Uma forma simples de visualizar um endereço IPv4 é dividi-lo entre:

```text
[ parte da rede ][ parte do host ]
```

O **prefixo** indica quantos bits pertencem à rede.

Por exemplo:

```text
192.168.1.0/26
```

significa que:

```text
26 bits → rede
6 bits  → hosts
```

O `/26` é chamado de **prefixo CIDR**.

---

# 11. Broadcast

O endereço de **broadcast** é utilizado para enviar uma comunicação para todos os hosts de uma determinada rede IPv4.

Em uma sub-rede `/26`, por exemplo:

```text
Rede:      192.168.1.0
Broadcast: 192.168.1.63
```

Os endereços ficam:

```text
192.168.1.0    → endereço de rede
192.168.1.1    → primeiro host
...
192.168.1.62   → último host
192.168.1.63   → broadcast
```

> `11111111` representa o valor decimal `255` em um octeto, mas isso não significa que todo endereço de broadcast seja simplesmente `255.255.255.255`. O broadcast depende da sub-rede específica.

---

# 12. Classificação histórica de IPv4

Também revisei a classificação tradicional de endereços IPv4 em classes:

```text
Classe A
Classe B
Classe C
Classe D
Classe E
```

Historicamente, as classes A, B e C eram utilizadas para definir tamanhos de redes.

Atualmente, o modelo **CIDR (Classless Inter-Domain Routing)** é utilizado para trabalhar de maneira mais flexível com prefixos, como:

```text
/24
/25
/26
/27
/28
```

Por isso, ao estudar subnetting moderno, é mais importante compreender **prefixo, máscara, bits de rede, bits de host, blocos e CIDR** do que depender apenas das antigas classes A/B/C.

---

# 13. O que consolidei nesta revisão

Nesta aula/revisão, trabalhei principalmente:

- Modelo OSI;
- PDU de cada camada;
- encapsulamento e desencapsulamento;
- NIC;
- ARP;
- endereço MAC;
- IPv4;
- bits e octetos;
- conversão binário → decimal;
- máscara de sub-rede;
- prefixo CIDR;
- divisão entre rede e host;
- empréstimo de bits;
- tamanho do bloco;
- quantidade de endereços;
- endereço de rede;
- endereço de broadcast;
- conceitos históricos de classes IPv4.

---

## 🧠 Pontos que ainda preciso reforçar

Durante a revisão, percebi que ainda preciso consolidar:

- cálculo de subnetting sem depender de decorar;
- identificação rápida da rede e do broadcast;
- quantidade de hosts por sub-rede;
- relação entre prefixo CIDR e máscara decimal;
- funcionamento detalhado do ARP;
- diferença entre pacote, quadro e segmento;
- relação entre IPv4, MAC e NIC;
- aplicação desses conceitos em equipamentos Cisco.

---

## 🧪 Próximo laboratório sugerido

Aplicar os conceitos estudados em um cenário prático no **Cisco Packet Tracer**:

**Cenário:**

```text
PC1 ──┐
      │
    Switch
      │
PC2 ──┘
```

Configurar uma rede IPv4, identificar:

- endereço de rede;
- máscara;
- primeiro host;
- último host;
- broadcast;
- quantidade de hosts disponíveis.

Depois, avançar para a divisão dessa rede em sub-redes e testar a comunicação entre os dispositivos.

---

## 📌 Registro de evolução

Este documento representa uma **revisão dos conceitos estudados**, incluindo pontos que ainda estão sendo consolidados. Novos laboratórios e aplicações práticas serão adicionados conforme o aprendizado avançar.