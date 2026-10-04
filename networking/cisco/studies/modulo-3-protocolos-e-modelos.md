# Módulo 3 — **Protocolos e modelos**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy  
**Data-Modúlo-3:** 23/03/2026

## 1. Introdução

O Módulo 3 — **Protocolos e modelos** explica como os dispositivos conseguem se comunicar de forma organizada em uma rede. Para que uma informação saia de uma origem e chegue corretamente ao destino, são necessárias regras, protocolos, padrões e modelos que definem como os dados devem ser preparados, enviados, encaminhados e interpretados.

O módulo aborda:

- Regras de comunicação;
- Protocolos de rede;
- Conjuntos de protocolos (protocol suites);
- Organizações de padronização (standards organizations);
- Modelos OSI e TCP/IP;
- Encapsulamento e desencapsulamento de dados;
- Acesso a recursos locais e remotos.

A ideia central é que a comunicação em rede não acontece de forma aleatória. Os dispositivos precisam seguir regras comuns para que equipamentos e tecnologias diferentes possam trabalhar juntos.


## 2. Regras de comunicação

As regras de comunicação são definidas por **protocolos**. Elas determinam como as mensagens devem ser criadas, transmitidas e interpretadas.

### Elementos de uma comunicação

Uma comunicação possui, de forma geral:

- **Origem:** dispositivo que envia a informação;
- **Destino:** dispositivo que recebe a informação;
- **Canal:** meio pelo qual a informação é transmitida;
- **Mensagem:** informação que está sendo comunicada;
- **Regras:** procedimentos que organizam a comunicação.

### Codificação da mensagem

A **codificação (encoding)** transforma a informação para um formato que possa ser transmitido pela rede. No destino, ocorre a **decodificação (decoding)** para que a informação possa ser interpretada.

Em uma rede digital, as informações são representadas e transmitidas na forma de bits. Para a comunicação funcionar, os dispositivos precisam utilizar formas compatíveis de representação.

### Formatação e encapsulamento da mensagem

Além do conteúdo da mensagem, podem ser adicionadas informações de controle, como identificação de origem e destino, informações de controle e outros campos definidos pelo protocolo.

Esse processo faz parte do **encapsulamento (encapsulation)**, no qual cada camada acrescenta as informações necessárias para desempenhar sua função.

### Tamanho da mensagem

Mensagens grandes podem ser divididas em partes menores, facilitando a transmissão pela rede.

A segmentação pode:

- Permitir melhor aproveitamento do meio;
- Evitar que uma única transmissão ocupe o canal por muito tempo;
- Reduzir o impacto de erros, pois apenas partes necessárias precisam ser retransmitidas em protocolos que possuem esse recurso.

### Temporização

A **temporização (timing)** define quando uma mensagem deve ser enviada e quanto tempo um dispositivo deve esperar por uma resposta.

Ela está relacionada a características como:

- Tempo limite de espera (timeout);
- Controle de fluxo;
- Sincronização;
- Procedimentos para lidar com respostas que não chegam.

### Opções de entrega

As mensagens podem ser entregues de diferentes formas:

#### Unicast

Comunicação de **um para um**. A mensagem possui um único destino.

#### Multicast

Comunicação de **um para um grupo**. A mensagem é destinada a um conjunto de dispositivos.

#### Broadcast

Comunicação de **um para todos os dispositivos** de uma rede que participam daquele domínio de broadcast.

> **Observação:** o broadcast é utilizado em IPv4. O IPv6 não utiliza broadcast tradicional.

## 3. Protocolos

Um **protocolo de rede (network protocol)** é um conjunto de regras que permite que dispositivos se comuniquem.

Cada protocolo possui sua própria função, formato e regras de funcionamento.

### Funções dos protocolos

Os protocolos podem definir aspectos como:

- Formato das mensagens;
- Significado dos campos;
- Endereçamento;
- Temporização;
- Controle de fluxo;
- Detecção de erros;
- Estabelecimento e encerramento de determinadas comunicações.

### Protocolos para diferentes funções

Não existe um único protocolo responsável por toda a comunicação. Vários protocolos trabalham juntos, cada um executando uma função específica.

Exemplos presentes na suíte TCP/IP incluem:

- **HTTP/HTTPS:** comunicação com serviços Web;
- **DNS:** resolução de nomes de domínio em endereços IP;
- **DHCP:** configuração automática de parâmetros de rede;
- **TCP:** transporte orientado à conexão e confiável;
- **UDP:** transporte sem conexão e com menor sobrecarga;
- **IP:** endereçamento lógico e encaminhamento entre redes;
- **Ethernet:** comunicação em redes locais cabeadas;
- **Wi-Fi:** comunicação em redes locais sem fio;
- **ICMP:** mensagens de controle e diagnóstico.

### Interação entre protocolos

Uma comunicação normalmente depende de vários protocolos trabalhando em conjunto.

Exemplo simplificado de acesso a um serviço Web:

1. O DNS pode ser utilizado para descobrir o endereço IP do servidor;
2. TCP ou UDP participa do transporte, dependendo da aplicação e do protocolo utilizado;
3. HTTP ou HTTPS realiza a comunicação da aplicação Web;
4. IP fornece o endereçamento lógico e permite o encaminhamento entre redes;
5. Ethernet ou Wi-Fi transporta os dados no acesso à rede local.

O ponto principal é que cada protocolo desempenha uma função específica dentro do processo.

## 4. Conjuntos de protocolos

Um **conjunto de protocolos (protocol suite)** é um grupo de protocolos relacionados que trabalham em conjunto para realizar a comunicação.

A suíte mais importante estudada neste módulo é a **suíte TCP/IP**, utilizada na Internet e em grande parte das redes atuais.

### Protocolos organizados em camadas

Os protocolos podem ser organizados em camadas para dividir uma tarefa complexa em partes menores. Cada camada possui responsabilidades próprias e utiliza os serviços fornecidos pelas camadas inferiores.

Essa organização facilita:

- O desenvolvimento de protocolos;
- A interoperabilidade entre fabricantes;
- A manutenção;
- A análise de problemas;
- A substituição de tecnologias sem reconstruir toda a arquitetura.

### Suíte TCP/IP

A suíte TCP/IP reúne vários protocolos utilizados em diferentes funções da comunicação em rede, como:

- Aplicações e serviços;
- Transporte;
- Endereçamento e roteamento;
- Acesso à rede.

O nome TCP/IP vem de dois protocolos importantes da suíte, mas o conjunto inclui muitos outros.

## 5. Organizações de padronização

Os padrões de rede permitem que produtos e tecnologias de fabricantes diferentes funcionem juntos.

### Importância da padronização

Os padrões promovem:

- Compatibilidade;
- Interoperabilidade;
- Concorrência entre fabricantes;
- Inovação;
- Maior previsibilidade no funcionamento das redes.

### ISO

A **ISO (International Organization for Standardization)** é uma organização internacional de padronização. No contexto de redes, é conhecida principalmente pelo desenvolvimento do modelo de referência OSI.

### IEEE

O **IEEE (Institute of Electrical and Electronics Engineers)** desenvolve diversos padrões de comunicação de redes.

Exemplos:

- **IEEE 802.3:** Ethernet;
- **IEEE 802.11:** redes sem fio.

### IETF

A **IETF (Internet Engineering Task Force)** desenvolve e publica padrões e documentos técnicos relacionados à Internet.

Esses documentos são publicados como **RFCs (Request for Comments)**.

### Outras organizações

Também existem outras organizações importantes, como:

- **IANA (Internet Assigned Numbers Authority):** administra recursos de identificação utilizados na Internet, como blocos de endereços, números de sistemas autônomos e números de portas;
- **ICANN (Internet Corporation for Assigned Names and Numbers):** coordena recursos relacionados a nomes e identificadores exclusivos da Internet;
- **W3C (World Wide Web Consortium):** desenvolve padrões relacionados à Web;
- **ITU (International Telecommunication Union):** atua na padronização de telecomunicações.

## 6. Modelos de referência

Os dois principais modelos estudados são o **modelo OSI** e o **modelo TCP/IP**.

Os modelos em camadas ajudam a organizar as funções da comunicação e fornecem uma linguagem comum para explicar como as redes funcionam.

### Benefícios do modelo em camadas

O uso de camadas ajuda a:

- Dividir tarefas complexas em partes menores;
- Facilitar o desenvolvimento de protocolos;
- Permitir que produtos de diferentes fabricantes trabalhem juntos;
- Reduzir o impacto de mudanças em uma camada sobre as demais;
- Criar uma linguagem comum para descrever funções de rede.

### Modelo OSI

O modelo **OSI (Open Systems Interconnection)** possui sete camadas:

| Camada | Nome | Função principal |
|---|---|---|
| 7 | Aplicação | Serviços e comunicação de rede utilizados pelas aplicações |
| 6 | Apresentação | Representação e transformação dos dados |
| 5 | Sessão | Gerenciamento de sessões e diálogo entre aplicações |
| 4 | Transporte | Segmentação, transporte e remontagem dos dados |
| 3 | Rede | Endereçamento lógico e comunicação entre redes |
| 2 | Enlace de dados | Quadros e comunicação pelo enlace local |
| 1 | Física | Transmissão de bits pelo meio físico |

#### Camada 7 — Aplicação

Relaciona-se aos serviços de rede utilizados pelos processos e aplicações.

Exemplos de protocolos relacionados incluem HTTP, HTTPS, DNS, SMTP e FTP.

#### Camada 6 — Apresentação

É responsável pela representação comum dos dados. Pode estar relacionada a:

- Tradução de formatos;
- Codificação de caracteres;
- Compressão;
- Criptografia e descriptografia.

#### Camada 5 — Sessão

Gerencia o estabelecimento, a manutenção e o encerramento de sessões de comunicação entre aplicações.

#### Camada 4 — Transporte

Oferece comunicação entre processos em dispositivos finais. Entre suas funções estão:

- Segmentação;
- Remontagem;
- Controle de fluxo;
- Confiabilidade, quando fornecida pelo protocolo;
- Identificação de processos por números de porta.

TCP e UDP são exemplos de protocolos da camada de transporte.

#### Camada 3 — Rede

Permite a comunicação entre redes diferentes por meio de:

- Endereçamento lógico;
- Seleção de caminho;
- Roteamento e encaminhamento de pacotes.

IP é o principal protocolo dessa camada.

#### Camada 2 — Enlace de dados

Organiza os dados em quadros e define procedimentos para comunicação por um enlace local. Endereços MAC são utilizados nesse nível.

Ethernet e Wi-Fi são exemplos de tecnologias relacionadas a essa camada.

#### Camada 1 — Física

É responsável pela transmissão dos bits pelo meio físico. Envolve características como sinais, cabos, conectores, frequências e métodos de transmissão.

### Modelo TCP/IP

O modelo TCP/IP normalmente é apresentado com quatro camadas:

| Camada TCP/IP | Funções principais | Exemplos |
|---|---|---|
| Aplicação | Serviços e protocolos para aplicações | HTTP, DNS, DHCP, SMTP |
| Transporte | Comunicação entre processos | TCP, UDP |
| Internet | Endereçamento e roteamento | IPv4, IPv6, ICMP |
| Acesso à rede | Acesso ao meio e transmissão local | Ethernet, Wi-Fi |

### Comparação entre OSI e TCP/IP

A correspondência aproximada entre os modelos é:

- **OSI Aplicação + Apresentação + Sessão → TCP/IP Aplicação**;
- **OSI Transporte → TCP/IP Transporte**;
- **OSI Rede → TCP/IP Internet**;
- **OSI Enlace + Física → TCP/IP Acesso à rede**.

O modelo OSI é principalmente um modelo de referência. O TCP/IP, além de ser um modelo, está diretamente associado à suíte de protocolos utilizada na Internet.

### Packet Tracer: modelos TCP/IP e OSI

O módulo também utiliza o **Cisco Packet Tracer** para observar como os modelos OSI e TCP/IP aparecem durante uma comunicação.

A atividade ajuda a relacionar os protocolos e as camadas com o tráfego que passa pela rede.

## 7. Encapsulamento de dados

O **encapsulamento (encapsulation)** é o processo no qual cada camada adiciona as informações necessárias ao protocolo enquanto os dados descem pela pilha.

No destino ocorre o **desencapsulamento (de-encapsulation)**, quando essas informações são processadas e removidas à medida que os dados sobem pelas camadas.

### Segmentação de mensagens

Mensagens grandes podem ser divididas em partes menores. A segmentação aumenta a eficiência da transmissão e permite que diferentes comunicações compartilhem o meio.

Se uma parte da transmissão precisar ser enviada novamente, protocolos que oferecem confiabilidade podem retransmitir apenas a parte necessária.

### Sequenciamento

Quando uma mensagem é dividida em várias partes, elas podem chegar fora de ordem. Informações de sequência permitem ao destino reorganizar as partes corretamente.

### Unidades de dados do protocolo (PDUs)

A forma que os dados assumem em cada camada é chamada de **PDU (Protocol Data Unit)**.

A sequência estudada no processo de encapsulamento é:

**Dados → Segmento/Datagrama → Pacote → Quadro → Bits**

- **Dados:** informação da aplicação;
- **Segmento:** PDU de transporte do TCP;
- **Datagrama:** PDU de transporte do UDP;
- **Pacote:** PDU da camada de rede;
- **Quadro:** PDU da camada de enlace;
- **Bits:** representação transmitida pela camada física.

### Exemplo de encapsulamento

Em uma comunicação simplificada:

1. A aplicação produz os dados;
2. A camada de transporte adiciona suas informações;
3. A camada de rede adiciona as informações de endereçamento lógico;
4. A camada de enlace organiza o pacote em um quadro;
5. A camada física transmite os bits.

### Exemplo de desencapsulamento

No destino, o processo ocorre no sentido contrário:

**Bits → Quadro → Pacote → Segmento/Datagrama → Dados**

Cada camada interpreta as informações que lhe pertencem antes de entregar o conteúdo à camada superior.

## 8. Acesso a dados

Esta seção explica como os dispositivos utilizam endereços de camada 2 e camada 3 para acessar recursos locais e remotos.

### Endereços de rede e endereços de enlace

Dois tipos importantes de endereço são utilizados no processo:

- **Endereço IP:** endereço lógico utilizado para identificar a origem e o destino na comunicação de camada 3;
- **Endereço MAC:** endereço utilizado na comunicação do enlace local.

Os dois trabalham em conjunto, mas possuem funções diferentes.

### Comunicação com um dispositivo na mesma rede

Quando o destino está na mesma rede, o host envia os dados diretamente para o dispositivo de destino no enlace local.

De forma simplificada:

1. O host verifica se o destino pertence à mesma rede;
2. O destino local é identificado na comunicação de enlace;
3. Um quadro é criado com o endereço MAC apropriado;
4. O dispositivo de rede local encaminha o quadro ao destino.

### Comunicação com um dispositivo em uma rede remota

Quando o destino está em outra rede:

1. O host identifica que o destino não está na rede local;
2. O tráfego é enviado para o **gateway padrão (default gateway)**;
3. O roteador encaminha o pacote em direção à rede de destino;
4. Em cada enlace, um novo quadro é utilizado para transportar o pacote.

O ponto principal é que os endereços IP identificam a comunicação entre redes, enquanto os endereços MAC são utilizados para a entrega no enlace local.

### Função do gateway padrão

O **gateway padrão** é o dispositivo utilizado por um host para alcançar outras redes. Em uma rede local, normalmente é uma interface de roteador ou de um dispositivo de camada 3.

Sem um gateway padrão adequado, um host pode continuar alcançando recursos da própria rede local, mas não terá um caminho configurado para redes remotas.

### Acesso local e remoto

A diferença principal pode ser resumida assim:

| Situação | Próximo destino do tráfego |
|---|---|
| Recurso na mesma rede | Dispositivo de destino no enlace local |
| Recurso em outra rede | Gateway padrão |

O detalhamento de mecanismos específicos de resolução de endereços e das tabelas de dispositivos é aprofundado em módulos posteriores do curso.


## Conclusão

O Módulo 3 mostra que a comunicação em rede depende de regras e padrões organizados. Protocolos definem como os dispositivos se comunicam; suítes de protocolos reúnem funções diferentes; organizações de padronização promovem interoperabilidade; os modelos OSI e TCP/IP ajudam a dividir as responsabilidades; e o encapsulamento permite que cada camada acrescente as informações necessárias.

A compreensão de protocolos, camadas, PDUs, endereços IP e MAC e do uso do gateway padrão cria a base para os módulos seguintes, nos quais esses conceitos serão aprofundados em Ethernet, camada de rede, resolução de endereços, roteamento e transporte.
