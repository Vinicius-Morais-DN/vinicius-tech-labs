# Módulo 9 — **Resolução de endereços**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy  
**Data-Modúlo-9:** 07/08/2026 e 14/08/2026

A resolução de endereços permite que um dispositivo descubra o endereço de camada 2 necessário para entregar um quadro ao próximo dispositivo. Esse processo conecta a camada de rede (camada 3) à camada de enlace (camada 2).

No IPv4, o **ARP (Address Resolution Protocol)** associa um endereço IPv4 a um endereço MAC. No IPv6, essa função é realizada pelo **Neighbor Discovery (ND)**, que utiliza mensagens ICMPv6.

O ponto central do módulo é compreender que o endereço IP identifica a origem e o destino do pacote, enquanto o endereço MAC permite entregar cada quadro no enlace local.

# 9.1. Endereços MAC e IP

Os dispositivos utilizam endereços MAC e IP com funções diferentes.

- **Endereço MAC:** utilizado na camada de enlace para entregar quadros dentro do enlace local.
- **Endereço IP:** utilizado na camada de rede para identificar a origem e o destino dos pacotes e permitir a comunicação entre redes.

## 9.1.1. Destino na mesma rede

Quando o destino está na mesma rede local, o quadro Ethernet utiliza o MAC do dispositivo de destino. O pacote IP transportado pelo quadro mantém os endereços IP de origem e destino.

## 9.1.2. Destino em uma rede remota

Quando o destino está em outra rede, o dispositivo envia o quadro ao **gateway padrão**, normalmente a interface de um roteador conectada à rede local.

Nesse caso:

- O IP de destino continua sendo o do host remoto.
- O MAC de destino do quadro é o do gateway.
- O roteador recebe o quadro, remove o encapsulamento da camada 2 e cria outro quadro para o próximo enlace.

Em uma comunicação comum sem NAT, os endereços IP de origem e destino permanecem os mesmos durante o encaminhamento, enquanto os endereços MAC utilizados nos quadros podem mudar a cada enlace.

## 9.1.3. Packet Tracer: identificar endereços MAC e IP

A atividade permite observar as informações das PDUs em uma comunicação local e em uma comunicação com uma rede remota.

O objetivo é identificar os endereços presentes no pacote IP e no quadro de camada 2, percebendo que o MAC de destino depende do próximo salto.

# 9.2. ARP — Address Resolution Protocol

O ARP é utilizado no IPv4 para descobrir o endereço MAC associado a um endereço IPv4 conhecido na rede local.

As associações aprendidas são armazenadas temporariamente em uma tabela chamada **cache ARP**, evitando que o dispositivo precise realizar uma nova consulta a cada comunicação.

## 9.2.1. Funcionamento do ARP

Antes de enviar um quadro Ethernet, o dispositivo verifica se conhece o MAC do próximo destinatário local.

- Se o destino estiver na mesma rede, procura o MAC associado ao IPv4 do host de destino.
- Se o destino estiver em outra rede, procura o MAC associado ao IPv4 do gateway padrão.

Se a associação estiver no cache, o dispositivo poderá utilizá-la diretamente. Caso contrário, precisará realizar uma solicitação ARP.

## 9.2.2. Solicitação ARP

Quando não encontra a associação no cache, o dispositivo envia uma solicitação ARP em broadcast Ethernet.

O endereço MAC de destino utilizado é:

```text
FF:FF:FF:FF:FF:FF
```

A solicitação pergunta qual dispositivo possui determinado endereço IPv4.

O switch propaga o broadcast pelas portas apropriadas da mesma LAN, exceto pela porta de entrada. Os dispositivos verificam se o IPv4 consultado corresponde ao deles. Roteadores não encaminham esse broadcast Ethernet para outras redes.

A mensagem ARP é transportada diretamente em um quadro Ethernet, sem ser encapsulada em um pacote IPv4.

## 9.2.3. Resposta ARP

O dispositivo que reconhece o IPv4 consultado responde informando seu endereço MAC. Normalmente, essa resposta é enviada em unicast ao solicitante.

Após receber a resposta, o dispositivo registra a associação no cache ARP e pode utilizar o MAC descoberto para construir o quadro Ethernet.

Se nenhum dispositivo responder, a resolução poderá falhar e impedir a comunicação.

## 9.2.4. ARP em comunicações remotas

Quando o destino está em outra rede, o host não procura diretamente o MAC do dispositivo remoto. Ele resolve o endereço MAC do gateway padrão.

O roteador recebe o pacote IP, consulta sua tabela de roteamento e encaminha o pacote pelo próximo enlace. Se necessário, realiza sua própria resolução de camada 2 para determinar o MAC do próximo salto.

## 9.2.5. Cache e tabela ARP

As entradas dinâmicas do cache ARP são temporárias e expiram conforme os temporizadores do sistema. Um administrador também pode remover associações manualmente.

Comandos úteis:

**Cisco IOS:**

```text
show ip arp
```

**Windows:**

```powershell
arp -a
```

Esses comandos permitem consultar as associações IPv4–MAC conhecidas pelo dispositivo.

## 9.2.6. Problemas de ARP e segurança

As solicitações ARP são broadcasts locais. Uma quantidade excessiva de solicitações pode aumentar a carga da rede e dos dispositivos.

Outro risco é o **ARP spoofing (falsificação de ARP)** ou **ARP poisoning (envenenamento de ARP)**. Nesse ataque, um agente malicioso anuncia uma associação falsa entre um endereço IPv4 e um MAC, podendo fazer com que o tráfego seja encaminhado ao dispositivo incorreto.

Em redes corporativas, mecanismos como **Dynamic ARP Inspection (DAI)** podem ajudar a detectar e bloquear mensagens ARP inválidas, quando devidamente configurados.

## 9.2.7. Packet Tracer: examinar a tabela ARP

A atividade permite observar solicitações e respostas ARP, a tabela MAC do switch e a resolução de endereços durante uma comunicação.

É importante distinguir as duas tabelas:

- **Tabela MAC do switch:** associa endereços MAC às portas do switch.
- **Tabela ARP:** associa endereços IPv4 aos respectivos endereços MAC.

# 9.3. Descoberta de vizinhos no IPv6

O IPv6 não utiliza ARP. Em seu lugar, emprega o **Neighbor Discovery (ND)**, um conjunto de mecanismos baseado em ICMPv6.

O ND permite resolver endereços de camada de enlace e também auxilia na descoberta de roteadores e na configuração da rede. Diferentemente do ARP, utiliza mensagens multicast específicas, em vez de broadcast Ethernet para a resolução de endereços.

## 9.3.1. Mensagens do Neighbor Discovery

O ND utiliza cinco tipos principais de mensagens ICMPv6:

| Mensagem | Sigla | Função |
|---|---|---|
| Neighbor Solicitation | NS | Solicita informações sobre um vizinho e participa da resolução de endereços. |
| Neighbor Advertisement | NA | Anuncia informações sobre um vizinho em resposta a uma solicitação ou em outras situações previstas pelo protocolo. |
| Router Solicitation | RS | Permite que um host solicite informações de roteadores. |
| Router Advertisement | RA | Anuncia a presença de roteadores e parâmetros da rede IPv6. |
| Redirect | — | Informa que existe um próximo salto mais adequado para determinado destino. |

## 9.3.2. Resolução de endereços IPv6

Quando um dispositivo conhece o IPv6 de um vizinho, mas ainda não conhece seu MAC, envia uma mensagem **Neighbor Solicitation (NS)** para o grupo multicast associado ao endereço do alvo.

O dispositivo correspondente pode responder com uma mensagem **Neighbor Advertisement (NA)**, fornecendo as informações necessárias para a resolução.

A associação aprendida é armazenada no cache de vizinhos, permitindo que o dispositivo construa o quadro Ethernet destinado ao MAC correto.

As mensagens NS e NA também participam da verificação de alcançabilidade de vizinhos.

## 9.3.3. Descoberta de vizinhos em redes remotas

Assim como no IPv4, um host IPv6 precisa identificar o próximo salto para alcançar um destino remoto.

Quando o destino está fora da rede local, o quadro é enviado ao roteador escolhido como próximo salto. O dispositivo utiliza o Neighbor Discovery para resolver o endereço de camada 2 necessário no enlace local.

## 9.3.4. Packet Tracer: Neighbor Discovery IPv6

A atividade permite acompanhar mensagens de descoberta de vizinhos em uma rede local e em uma comunicação com destino remoto.

O objetivo é comparar o funcionamento do ND no IPv6 com o ARP no IPv4 e identificar como o dispositivo descobre o MAC do próximo salto.

# 9.4. Prática e revisão do módulo

## 9.4.1. Quiz do módulo: resolução de endereços

O quiz verifica a compreensão dos endereços MAC e IP, do funcionamento do ARP, das mensagens de solicitação e resposta, do cache ARP e do Neighbor Discovery no IPv6.

O objetivo é conseguir explicar o processo de resolução de endereços e interpretar quais endereços aparecem nos quadros e pacotes durante uma comunicação.

# 9.5. Comparação entre ARP e Neighbor Discovery

| Característica | IPv4 — ARP | IPv6 — Neighbor Discovery |
|---|---|---|
| Protocolo utilizado | ARP | ND sobre ICMPv6 |
| Função principal | Resolver IPv4 para MAC | Resolver IPv6 para endereço de camada 2 |
| Mensagens de resolução | Solicitação e resposta ARP | Neighbor Solicitation e Neighbor Advertisement |
| Método de solicitação | Broadcast Ethernet | Multicast direcionado ao grupo do vizinho |
| Informações armazenadas | Cache ARP | Cache de vizinhos |
| Funções adicionais | Resolução IPv4–MAC | Descoberta de roteadores, verificação de vizinhos e redirecionamento |

# Conclusão

A resolução de endereços permite que um dispositivo transforme o endereço IP conhecido do próximo destino na informação de camada 2 necessária para transmitir um quadro.

No IPv4, essa função é realizada pelo ARP. No IPv6, é realizada pelo Neighbor Discovery, baseado em ICMPv6.

A distinção mais importante é que **o endereço IP de destino não determina necessariamente o MAC de destino do quadro local**. Quando o destino está em outra rede, o dispositivo envia o quadro ao gateway ou próximo salto, mantendo o IP do destino final no pacote.

Compreender esse processo ajuda a interpretar tabelas de endereços, diagnosticar problemas de conectividade e reconhecer riscos de segurança relacionados a associações falsas entre IP e MAC.

# Fontes consultadas

- [Cisco Networking Academy — CCNA: Introdução às Redes](https://www.netacad.com/)
- [Currículo público CCNA 1 v7.0 — Módulo 9: Address Resolution](https://itexamanswers.net/ccna-1-v7-0-curriculum-module-9-address-resolution.html)
- [Cisco Learning Network — Fundamentals of ARP](https://learningnetwork.cisco.com/s/article/fundamentals-of-arp-address-resolution-protocol)
- [Cisco — IPv6 Neighbor Discovery](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6_basic/configuration/xe-3se/3850/ip6-neighb-disc-xe.html)
- [IETF RFC 4861 — Neighbor Discovery for IPv6](https://www.ietf.org/ietf-ftp/rfc/rfc4861.html)
- [Cisco IOS — Comando show ipv6 neighbors](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6/command/ipv6-cr-book/ipv6-s4.html)

**Nota:** o conteúdo foi organizado com base no material de estudo enviado, mantendo a estrutura curricular do módulo e priorizando os conceitos necessários para compreender a resolução de endereços.
