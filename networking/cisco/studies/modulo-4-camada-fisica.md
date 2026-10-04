# Resumo do Módulo 4 — **Camada física**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy  
**Data-Modúlo-4:** a confirmar

## 1. Introdução

O Módulo 4 — **Camada física (Physical Layer)** explica como os bits são representados e transmitidos por diferentes meios físicos. Essa é a primeira camada do modelo OSI e faz a ligação entre os quadros recebidos da camada de enlace e o meio usado para transmitir os dados.

O módulo aborda:

- Propósito da camada física;
- Características dos meios físicos;
- Cabeamento de cobre;
- Cabeamento UTP;
- Fibra óptica;
- Meios sem fio;
- Critérios para escolha do meio de transmissão.

A ideia central é que a camada física não interpreta o significado dos dados. Ela transporta os bits por meio de sinais elétricos, ópticos ou de rádio.

## 2. Propósito da camada física

A camada física transporta os bits que formam os quadros da rede. Ela recebe um quadro da camada de enlace, transforma os bits em sinais e transmite esses sinais pelo meio físico. No destino, os sinais são convertidos novamente em bits.

Entre suas principais funções estão:

- Representar bits por sinais;
- Definir cabos, conectores e interfaces;
- Especificar características elétricas, ópticas e de rádio;
- Definir a duração e a taxa de transmissão dos bits;
- Garantir a compatibilidade física entre os dispositivos.

### Representação dos bits

A forma de representar os bits depende do meio:

- **Cobre:** sinais elétricos;
- **Fibra óptica:** pulsos de luz;
- **Sem fio:** ondas eletromagnéticas, principalmente ondas de rádio.

Os dispositivos precisam utilizar formas compatíveis de representação e transmissão para que os bits sejam interpretados corretamente.

## 3. Características da camada física

Os padrões da camada física especificam principalmente **componentes físicos, codificação e sinalização**.

### Componentes físicos

Incluem:

- Placas de rede;
- Interfaces de switches e roteadores;
- Cabos;
- Conectores;
- Antenas;
- Transceptores.

Os padrões também definem características como pinagem, materiais, distância máxima e velocidade de transmissão.

### Codificação e sinalização

A **codificação (encoding)** define como os bits serão representados em um padrão reconhecível pelo receptor.

A **sinalização (signaling)** transforma essa representação em sinais físicos, como variações elétricas, pulsos de luz ou ondas de rádio.

### Largura de banda

A **largura de banda (bandwidth)** representa a capacidade de transmissão de um meio em determinado período.

Unidades comuns:

- bps — bits por segundo;
- Kbps — milhares de bits por segundo;
- Mbps — milhões de bits por segundo;
- Gbps — bilhões de bits por segundo;
- Tbps — trilhões de bits por segundo.

A largura de banda depende das características do meio, da tecnologia utilizada e das técnicas de sinalização.

### Latência, throughput e goodput

A **latência (latency)** é o tempo necessário para os dados percorrerem o caminho entre dois pontos.

O **throughput (taxa de transferência)** é a quantidade de bits realmente transferida em determinado período.

O **goodput** representa a quantidade de dados úteis transferidos, descontando informações de controle e outras sobrecargas.

De forma simplificada:

`Goodput ≤ Throughput ≤ Largura de banda`

### Atenuação e interferência

A **atenuação (attenuation)** é a perda de força do sinal durante a transmissão. Ela tende a aumentar com a distância.

Em meios de cobre também podem ocorrer:

- **EMI (Electromagnetic Interference):** interferência eletromagnética;
- **RFI (Radio Frequency Interference):** interferência de radiofrequência;
- **Diafonia (crosstalk):** interferência entre pares próximos.

A escolha correta do meio, a instalação adequada e o respeito aos limites de distância ajudam a reduzir esses problemas.

## 4. Cabeamento de cobre

O cobre é um dos meios mais utilizados em redes por apresentar custo relativamente baixo, facilidade de instalação e bom desempenho em distâncias adequadas.

Os principais tipos são:

- **Coaxial (coaxial cable);**
- **UTP (Unshielded Twisted-Pair);**
- **STP (Shielded Twisted-Pair).**

### Cabo coaxial

Possui um condutor central, isolamento, blindagem metálica e revestimento externo.

Foi muito utilizado em redes Ethernet antigas e hoje é encontrado principalmente em aplicações como:

- Televisão a cabo;
- Modems a cabo;
- Sistemas de antena.

### UTP

O **UTP** utiliza pares de fios de cobre trançados. O trançamento ajuda a reduzir interferências e diafonia.

Suas principais vantagens são:

- Baixo custo;
- Flexibilidade;
- Facilidade de instalação;
- Uso amplo em redes Ethernet.

### STP

O **STP** possui blindagem para reduzir a interferência eletromagnética. Pode ser usado em ambientes com maior quantidade de ruído elétrico.

Em comparação com o UTP, costuma ser mais caro e exige maior cuidado na instalação.

### Limitações do cobre

O cobre apresenta:

- Distância limitada;
- Atenuação com o aumento da distância;
- Sensibilidade a EMI, RFI e diafonia;
- Possibilidade de interferência elétrica em ambientes inadequados.

## 5. Cabeamento UTP

Um cabo UTP normalmente possui quatro pares trançados, totalizando oito condutores.

As cores seguem padrões de cabeamento estruturado, como:

- Branco/laranja e laranja;
- Branco/verde e verde;
- Branco/azul e azul;
- Branco/marrom e marrom.

### Categorias

As categorias definem características de desempenho do cabo.

Exemplos:

- Cat 5e;
- Cat 6;
- Cat 6A.

A categoria, o comprimento, os conectores e a qualidade da instalação influenciam o desempenho final.

### Conector RJ-45

O conector utilizado em muitos cabos Ethernet de par trançado possui oito posições para os oito condutores.

As terminações seguem padrões como:

- **T568A;**
- **T568B.**

O mais importante é manter a ordem correta dos pares e seguir o padrão escolhido.

### Tipos de cabo UTP

**Cabo direto (straight-through):** utiliza o mesmo padrão nas duas extremidades. Tradicionalmente é usado para conectar dispositivos de tipos diferentes, como PC e switch.

**Cabo cruzado (crossover):** utiliza padrões diferentes nas extremidades, normalmente T568A de um lado e T568B do outro. Tradicionalmente é usado entre dispositivos semelhantes, como switch e switch.

Equipamentos modernos podem utilizar **auto-MDIX**, detectando automaticamente a disposição dos pares.

**Cabo de console (console cable):** utilizado para conectar um computador à porta de console de equipamentos Cisco para configuração e gerenciamento local.

### Boas práticas

- Respeitar o comprimento máximo do padrão;
- Evitar dobras e esmagamentos excessivos;
- Manter distância de cabos de energia;
- Preservar o trançamento dos pares na terminação;
- Utilizar conectores e ferramentas adequados;
- Testar continuidade e pinagem;
- Identificar as extremidades do cabo.

Problemas comuns incluem fios rompidos, pares invertidos, pares divididos e conectores mal terminados.

## 6. Cabeamento de fibra óptica

A fibra óptica transmite dados por pulsos de luz.

Sua estrutura básica possui:

- **Núcleo (core):** região por onde a luz se propaga;
- **Revestimento (cladding):** mantém a luz dentro do núcleo;
- **Revestimento externo:** protege a fibra.

### Vantagens

- Alta capacidade de transmissão;
- Grandes distâncias;
- Baixa atenuação;
- Imunidade do meio a EMI e RFI;
- Isolamento elétrico entre as extremidades.

### Desvantagens

- Instalação mais especializada;
- Conectores e componentes mais delicados;
- Necessidade de limpeza e cuidados com a curvatura;
- Equipamentos ópticos e testes podem ter custo maior.

### Fibra monomodo

A **fibra monomodo (single-mode)** possui um núcleo menor e permite a propagação de um único modo de luz.

É utilizada principalmente em:

- Longas distâncias;
- Enlaces de alta capacidade;
- Redes de provedores e outros enlaces extensos.

### Fibra multimodo

A **fibra multimodo (multimode)** possui um núcleo maior e permite vários modos de propagação da luz.

É comum em:

- Redes internas;
- Prédios;
- Data centers;
- Enlaces de menor distância.

### Comparação

| Característica | Monomodo | Multimodo |
|---|---|---|
| Núcleo | Menor | Maior |
| Modos de propagação | Um | Vários |
| Distância | Longa | Menor |
| Dispersão | Menor | Maior |
| Aplicações | Enlaces longos | LANs e data centers |

### Conectores e transceptores

Entre os conectores encontrados em redes estão:

- LC;
- SC;
- ST.

Os **transceptores (transceivers)** realizam a conversão entre sinais elétricos e ópticos. A compatibilidade deve considerar fatores como tipo de fibra, velocidade, distância e equipamento.

A fibra também pode sofrer atenuação, dispersão, sujeira nos conectores, curvaturas excessivas e problemas de instalação.

## 7. Meios sem fio

As redes sem fio utilizam ondas eletromagnéticas para transmitir os dados pelo ar.

Elementos básicos incluem:

- Dispositivo cliente;
- Interface sem fio;
- Ponto de acesso;
- Antena;
- Canal de rádio.

Uma das principais vantagens é a mobilidade. Entre as limitações estão a interferência, o alcance e a necessidade de planejamento da cobertura.

### Padrões IEEE 802.11

As redes Wi-Fi fazem parte da família **IEEE 802.11**.

Algumas versões conhecidas são:

- 802.11a;
- 802.11b;
- 802.11g;
- 802.11n;
- 802.11ac;
- 802.11ax.

As diferentes versões utilizam técnicas e características distintas de transmissão.

### Frequências e alcance

As redes Wi-Fi podem operar principalmente em 2,4 GHz e 5 GHz, com características diferentes.

**2,4 GHz:**
- Maior alcance em muitos ambientes;
- Melhor propagação através de alguns obstáculos;
- Maior congestionamento.

**5 GHz:**
- Mais canais disponíveis;
- Pode oferecer maior desempenho;
- Normalmente possui menor alcance em comparação com 2,4 GHz.

O alcance real depende de fatores como potência, antena, obstáculos, interferência e sensibilidade do receptor.

### Interferência e segurança

A interferência pode ser causada por outras redes Wi-Fi, Bluetooth, micro-ondas, equipamentos industriais e obstáculos físicos.

Ela pode provocar:

- Redução de velocidade;
- Retransmissões;
- Aumento da latência;
- Instabilidade.

Como o sinal sem fio se propaga pelo ar, mecanismos de autenticação e criptografia são importantes para proteger a comunicação.

## 8. Comparações essenciais

### Cobre, fibra e sem fio

| Característica | Cobre | Fibra óptica | Sem fio |
|---|---|---|---|
| Sinal | Elétrico | Luz | Rádio |
| Distância | Curta ou média | Média ou longa | Variável |
| Interferência | Sensível a EMI/RFI | Imune no meio físico | Sensível a interferência de rádio |
| Instalação | Simples | Mais especializada | Requer planejamento |
| Mobilidade | Baixa | Baixa | Alta |
| Uso comum | LANs | Backbones e enlaces | Acesso sem fio |

### UTP, STP e fibra

- **UTP:** baixo custo e fácil instalação;
- **STP:** maior proteção contra interferência;
- **Fibra:** maior distância e alta capacidade, indicada para enlaces que exigem essas características.

## Conclusão

O Módulo 4 mostra como a camada física transforma bits em sinais e os transporta por cobre, fibra óptica ou meios sem fio.

O cobre oferece baixo custo e facilidade de instalação, mas possui limitações de distância e maior sensibilidade a interferências. A fibra atende a maiores distâncias e oferece alta capacidade e imunidade a interferência eletromagnética. Já os meios sem fio oferecem mobilidade, mas dependem de cobertura adequada e controle de interferência.

A escolha do meio deve considerar principalmente velocidade, distância, ambiente, interferência, custo, instalação e necessidade de mobilidade.

A sequência central do módulo pode ser resumida como:

`Quadro da camada de enlace → codificação → sinalização → meio físico → recepção dos sinais → bits`

A camada física é a base da comunicação de rede: sem uma transmissão física adequada, as camadas superiores não conseguem funcionar corretamente.
