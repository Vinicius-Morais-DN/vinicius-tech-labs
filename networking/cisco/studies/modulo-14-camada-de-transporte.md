# Módulo 14 — **Camada de transporte**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy  
**Data-Modúlo-14:** 05/10/2026

## 1. Introdução

A camada de transporte corresponde à camada 4 do modelo OSI. Sua função é permitir a comunicação entre aplicações em dispositivos diferentes, utilizando números de porta para identificar os processos que enviam e recebem dados.

Entre suas principais funções estão a segmentação e a remontagem dos dados, a identificação das aplicações, o controle de fluxo e a entrega dos dados ao processo correto. Também permite que várias comunicações ocorram simultaneamente pela mesma interface de rede.

## 2. Protocolos TCP e UDP

Os principais protocolos da camada de transporte são TCP e UDP.

### TCP — Transmission Control Protocol

O **TCP** é orientado à conexão e oferece mecanismos de confiabilidade, ordenação dos dados, confirmações de recebimento, retransmissões e controle de fluxo. É utilizado quando a entrega correta e ordenada dos dados é importante.

### UDP — User Datagram Protocol

O **UDP** não estabelece uma conexão antes de enviar os dados e não oferece confirmações ou retransmissões automáticas. Seu cabeçalho é menor, com 8 bytes, e gera menos sobrecarga. É comum em aplicações que priorizam a baixa latência, como DNS, chamadas de voz, transmissões de vídeo e jogos online.

## 3. Números de porta

O endereço IP identifica o dispositivo na rede, enquanto o número de porta ajuda a identificar o serviço ou processo responsável pela comunicação.

As portas são divididas em três faixas:

- **0–1023:** portas conhecidas;
- **1024–49151:** portas registradas;
- **49152–65535:** portas dinâmicas ou privadas, geralmente utilizadas temporariamente pelos clientes.

Alguns exemplos de portas conhecidas:

| Serviço | Porta comum |
|---|---:|
| FTP | 20 e 21 |
| SSH | 22 |
| DNS | 53 |
| HTTP | 80 |
| HTTPS | 443 |

A porta de origem normalmente é escolhida temporariamente pelo cliente, enquanto a porta de destino costuma indicar o serviço acessado no servidor.

## 4. Multiplexação e demultiplexação

A **multiplexação** permite que várias aplicações utilizem a rede ao mesmo tempo, mantendo suas comunicações identificadas por meio das informações de origem e destino.

A **demultiplexação** acontece no dispositivo receptor, que utiliza as informações de transporte para entregar os dados à aplicação correta.

Uma comunicação pode ser identificada pelo endereço IP de origem, porta de origem, endereço IP de destino, porta de destino e protocolo utilizado. Isso permite que um dispositivo mantenha várias comunicações simultâneas, inclusive com o mesmo servidor.

## 5. Funcionamento do TCP

Antes de transmitir dados, o TCP estabelece uma conexão por meio do *three-way handshake*, que ocorre em três etapas:

1. **SYN:** o cliente inicia a conexão;
2. **SYN-ACK:** o servidor responde e confirma o início da comunicação;
3. **ACK:** o cliente confirma a resposta do servidor.

Durante a transmissão, o TCP utiliza números de sequência e confirmações para acompanhar os dados recebidos. Se houver perda, pode realizar retransmissões. Também consegue reorganizar segmentos que chegam fora de ordem.

O controle de fluxo limita a quantidade de dados enviados de acordo com a capacidade de recebimento do destino. Já o controle de congestionamento ajuda a evitar sobrecarregar a rede.

## 6. Funcionamento do UDP

O UDP envia datagramas sem estabelecer previamente uma conexão. Seu cabeçalho possui quatro campos principais: porta de origem, porta de destino, comprimento e checksum, totalizando 8 bytes.

Como não possui confirmação nem retransmissão automática, os datagramas podem ser perdidos, duplicados ou chegar fora de ordem. Caso a aplicação precise de confiabilidade, ela deve implementar os mecanismos necessários.

O UDP é utilizado em serviços como DNS e DHCP, além de aplicações de voz, vídeo e jogos online, nas quais esperar por retransmissões pode causar atrasos.

## 7. Comparação entre TCP e UDP

| Característica | TCP | UDP |
|---|---|---|
| Conexão | Orientado à conexão | Sem conexão |
| Confirmações | Sim | Não por padrão |
| Retransmissão automática | Sim | Não |
| Ordem dos dados | Garantida | Não garantida |
| Controle de fluxo | Sim | Não da mesma forma |
| Cabeçalho mínimo | 20 bytes | 8 bytes |
| Aplicações comuns | Web, arquivos e SSH | DNS, DHCP, voz, vídeo e jogos |

A escolha depende das necessidades da aplicação. O TCP prioriza a confiabilidade, enquanto o UDP oferece uma comunicação mais simples e com menor sobrecarga.

## 8. Diagnóstico de problemas

Para investigar falhas na comunicação, é importante verificar o endereço IP, a porta de destino, o estado do serviço, as regras de firewall, o protocolo utilizado e a conectividade entre os dispositivos.

Alguns comandos úteis para observar conexões e portas são:

**Windows:**

```bash
netstat -ano
```

**Linux:**

```bash
ss -tuln
ss -tan
```

No Windows, `netstat -ano` permite visualizar conexões e portas associadas a identificadores de processos. No Linux, `ss -tuln` mostra portas TCP e UDP em escuta, enquanto `ss -tan` apresenta sockets TCP.

O comando `ping` pode ajudar a verificar a conectividade IP, mas uma resposta positiva não garante que uma porta específica esteja aberta.

## 9. Resumo

A camada de transporte permite a comunicação entre aplicações por meio de protocolos e números de porta. O TCP oferece confiabilidade, ordenação, retransmissões e controle de fluxo. O UDP possui menor sobrecarga e é adequado para aplicações que priorizam a baixa latência.

Compreender esses mecanismos ajuda a entender como os dados são entregues às aplicações e a diagnosticar problemas de comunicação em redes de computadores.
