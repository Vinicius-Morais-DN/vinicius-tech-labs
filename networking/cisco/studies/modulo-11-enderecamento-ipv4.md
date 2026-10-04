# Módulo 11 — Endereçamento IPv4

## Anotações de aula + conteúdo da Cisco

Este relatório reúne as anotações feitas em aula com os principais pontos do Módulo 11 da Cisco sobre endereçamento IPv4.

## 1. Internet, WWW, DNS e ISP

A **Internet** é formada pela interligação de várias redes, permitindo a comunicação entre dispositivos que podem estar muito distantes uns dos outros.

A **WWW (World Wide Web)** é um serviço que funciona sobre a Internet e permite o acesso a sites e páginas por meio de navegadores.

O **DNS (Domain Name System)** é responsável por relacionar nomes de domínio a endereços IP. Assim, em vez de precisar decorar um endereço numérico, podemos usar nomes como `google.com`.

O **ISP (Internet Service Provider)** é o provedor de Internet. É ele que fornece a conexão e, dependendo do serviço, pode fornecer um endereço IPv4 público.

Nem todo equipamento conectado à Internet possui um IP público próprio. Em redes domésticas e empresariais, é comum vários dispositivos usarem endereços privados e compartilharem uma saída para a Internet.

## 2. O que é um endereço IP

O **IP (Internet Protocol)** é usado para o endereçamento lógico dos dispositivos em uma rede.

No IPv4, o endereço possui **32 bits**, divididos em quatro grupos de 8 bits, chamados de **octetos (octets)**.

Exemplo:

```text
192.168.10.25
```

Os quatro octetos são:

```text
192 . 168 . 10 . 25
```

Em binário:

```text
11000000 . 10101000 . 00001010 . 00011001
```

Cada octeto pode representar valores de `0` a `255`.

O endereço IPv4 é dividido, de forma lógica, em duas partes:

```text
[ parte da rede ][ parte do host ]
```

A máscara de sub-rede ou o prefixo define onde termina uma parte e começa a outra.

## 3. IP público e IP privado

### IP público

O **IP público (public IP)** é usado na Internet pública e precisa ser roteável globalmente para que possa participar da comunicação entre redes na Internet.

Um serviço que precisa ser acessado pela Internet pode utilizar um endereço público. Isso não significa que todos os computadores da rede precisem possuir um endereço público próprio.

### IP privado

O **IP privado (private IP)** é usado dentro de redes internas. Esses endereços podem ser reutilizados em redes diferentes porque não são roteados diretamente pela Internet pública.

Uma máquina com IP privado normalmente precisa passar por um roteador e por uma forma de tradução de endereços para acessar a Internet.

## 4. Private Address Blocks — RFC 1918

A **RFC 1918** define os blocos de endereços IPv4 reservados para uso privado.

| Bloco | Prefixo | Intervalo |
|---|---:|---|
| `10.0.0.0` | `/8` | `10.0.0.0` – `10.255.255.255` |
| `172.16.0.0` | `/12` | `172.16.0.0` – `172.31.255.255` |
| `192.168.0.0` | `/16` | `192.168.0.0` – `192.168.255.255` |

Esses blocos são usados em redes internas e não são anunciados diretamente como redes públicas na Internet.

## 5. Intranet

A **intranet** é uma rede privada usada dentro de uma organização. Ela pode oferecer sistemas, arquivos, impressoras e outros serviços internos sem que tudo isso precise ficar disponível para a Internet pública.

A diferença principal é que a intranet é voltada para um ambiente controlado, enquanto a Internet conecta redes de forma global.

## 6. Firewall, proxy e DMZ

O **firewall (firewall)** controla o tráfego de rede de acordo com regras configuradas. Ele pode permitir ou bloquear determinadas comunicações.

Um firewall pode ser usado, por exemplo, para restringir acesso a portas, protocolos, endereços ou determinados serviços. Bloqueios específicos de sites também podem envolver outros mecanismos, como filtragem DNS ou proxy.

O **proxy (proxy/intermediário)** recebe uma solicitação e atua como intermediário entre o cliente e o serviço acessado. Ele pode ser usado para controle de acesso, filtragem e registro.

A **DMZ (Demilitarized Zone)** é uma área separada da rede interna, normalmente usada para serviços que precisam ficar acessíveis de fora, como um servidor web. A separação ajuda a evitar que um serviço exposto tenha acesso direto a toda a rede interna.

## 7. NAT

O **NAT (Network Address Translation)** faz a tradução de endereços IP durante a comunicação.

Um exemplo comum é uma rede doméstica em que vários dispositivos usam IPs privados e o roteador faz a tradução para a comunicação com a Internet.

```text
PC        192.168.1.10
Celular   192.168.1.11
Notebook  192.168.1.12
             |
             v
          Roteador
             |
         IP público
             |
          Internet
```

Com o **PAT (Port Address Translation)**, vários dispositivos podem compartilhar o mesmo endereço IPv4 público usando portas diferentes para separar as conexões.

## 8. Máscara e prefixo CIDR

A máscara mostra qual parte do endereço pertence à rede.

Exemplo:

```text
IP:       192.168.10.25
Máscara:  255.255.255.0
Prefixo:  /24
```

O `/24` significa que:

```text
24 bits → rede
8 bits  → host
```

Alguns exemplos comuns:

| Prefixo | Máscara | Bits de host |
|---:|---|---:|
| `/8` | `255.0.0.0` | 24 |
| `/16` | `255.255.0.0` | 16 |
| `/24` | `255.255.255.0` | 8 |
| `/26` | `255.255.255.192` | 6 |
| `/27` | `255.255.255.224` | 5 |
| `/30` | `255.255.255.252` | 2 |

O **CIDR (Classless Inter-Domain Routing)** permite trabalhar com prefixos de tamanho variável, sem depender apenas da classificação tradicional por classes.

## 9. Quantidade de hosts

Para calcular a quantidade tradicional de hosts utilizáveis em uma sub-rede, usamos:

```text
2^h - 2
```

`h` é a quantidade de bits disponíveis para hosts.

Os dois endereços retirados são o endereço de rede e o endereço de broadcast.

### Exemplo — /24

```text
32 - 24 = 8 bits para hosts

2^8 - 2 = 254 hosts utilizáveis
```

### Exemplo — /26

```text
32 - 26 = 6 bits para hosts

2^6 - 2 = 62 hosts utilizáveis
```

## 10. Classes A, B e C

A classificação tradicional do IPv4 divide os endereços em classes. As mais conhecidas são A, B e C.

| Classe | Primeiro octeto | Máscara tradicional |
|---|---:|---:|
| A | `1–126` | `/8` |
| B | `128–191` | `/16` |
| C | `192–223` | `/24` |

Essa classificação é importante para entender a evolução do IPv4, mas atualmente o planejamento de redes é feito principalmente com CIDR e prefixos.

## 11. Loopback

O **loopback** é usado para testar o próprio dispositivo.

A faixa IPv4 reservada para loopback é:

```text
127.0.0.0/8
```

O endereço mais conhecido é:

```text
127.0.0.1
```

Também é chamado de **localhost**. O tráfego para esse endereço permanece no próprio dispositivo.

## 12. Unicast, broadcast e multicast

### Unicast

Comunicação de um dispositivo para um destino específico.

```text
PC-A → PC-B
```

### Broadcast

Comunicação de um dispositivo para todos os hosts do mesmo domínio de broadcast.

```text
PC-A → todos os hosts da sub-rede
```

O broadcast IPv4 normalmente não é encaminhado por roteadores para outras redes.

### Multicast

Comunicação de um remetente para um grupo específico de receptores.

```text
Origem → grupo multicast
```

## 13. Rede, host e broadcast

Considere a rede:

```text
192.168.10.0/24
```

Temos:

```text
Endereço de rede: 192.168.10.0
Primeiro host:    192.168.10.1
Último host:      192.168.10.254
Broadcast:        192.168.10.255
```

O endereço de rede identifica a sub-rede e o broadcast representa a comunicação para todos os hosts daquela sub-rede.

Por isso, em uma rede `/24`, o `.0` e o `.255` não são usados como endereços normais de hosts.

## 14. Segmentação de rede

**Segmentar uma rede** significa dividir uma rede maior em partes menores.

A segmentação pode ajudar a:

- reduzir os domínios de broadcast;
- organizar setores e funções;
- facilitar o gerenciamento;
- aplicar regras de segurança;
- utilizar melhor o espaço de endereçamento.

## 15. Sub-redes

Ao criar uma sub-rede, alguns bits que antes eram usados para hosts passam a fazer parte da identificação da rede.

Exemplo:

```text
/24 → /26
```

Foram emprestados 2 bits para a rede.

Quantidade de sub-redes:

```text
2^2 = 4
```

Bits restantes para hosts:

```text
32 - 26 = 6
```

Hosts utilizáveis por sub-rede:

```text
2^6 - 2 = 62
```

As quatro sub-redes são:

| Rede | Hosts | Broadcast |
|---|---|---|
| `192.168.10.0/26` | `.1 – .62` | `.63` |
| `192.168.10.64/26` | `.65 – .126` | `.127` |
| `192.168.10.128/26` | `.129 – .190` | `.191` |
| `192.168.10.192/26` | `.193 – .254` | `.255` |

## 16. Determinando a rede — lógica AND

Para descobrir a rede de um endereço, podemos fazer uma operação lógica **AND** entre o IP e a máscara.

Exemplo:

```text
IP:       192.168.10.25
Máscara:  255.255.255.0
Prefixo:  /24
```

Resultado:

```text
192.168.10.0
```

As regras do AND são simples:

| IP | Máscara | Resultado |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

Ou seja, o resultado só será `1` quando os dois bits forem `1`.

Esse cálculo ajuda a descobrir a rede à qual o IP pertence e a verificar se um destino está na mesma sub-rede.

## 17. Incremento da sub-rede

Também podemos encontrar as redes usando o **incremento**.

Para uma rede `/26`:

```text
Máscara: 255.255.255.192

256 - 192 = 64
```

O incremento é `64`, então as redes começam em:

```text
0
64
128
192
```

O método do incremento é útil para calcular rapidamente os limites das sub-redes.

## 18. VLSM

O **VLSM (Variable Length Subnet Mask)** permite usar diferentes tamanhos de sub-rede dentro de uma mesma rede maior.

Isso é útil porque cada setor pode precisar de uma quantidade diferente de endereços.

Exemplo:

| Setor | Hosts necessários | Prefixo |
|---|---:|---:|
| Administração | 50 | `/26` |
| Laboratório | 25 | `/27` |
| Gerência | 10 | `/28` |
| Enlace | 2 | `/30` |

O VLSM ajuda a evitar desperdício de endereços, já que cada segmento recebe um tamanho mais próximo da sua necessidade.

Uma boa prática é começar pelo maior requisito e depois alocar os menores blocos.

## 19. Exemplo de cálculo — 172.16.35.77/20

Considere:

```text
172.16.35.77/20
```

### Máscara

```text
255.255.240.0
```

### Incremento

O octeto relevante é o terceiro:

```text
256 - 240 = 16
```

As redes começam em:

```text
0, 16, 32, 48, 64...
```

O valor `35` está entre `32` e `47`, então a rede é:

```text
172.16.32.0/20
```

A próxima rede começa em `172.16.48.0`, então o broadcast é:

```text
172.16.47.255
```

Faixa de hosts:

```text
Primeiro host: 172.16.32.1
Último host:   172.16.47.254
```

Portanto:

```text
IP:        172.16.35.77/20
Rede:      172.16.32.0/20
Broadcast: 172.16.47.255
Hosts:     172.16.32.1 – 172.16.47.254
```

## 20. Pontos principais

O que ficou como base deste módulo:

```text
IPv4
↓
IP público e IP privado
↓
Private Address Blocks / RFC 1918
↓
Máscara e prefixo CIDR
↓
Rede e host
↓
Broadcast
↓
Unicast / Broadcast / Multicast
↓
Segmentação
↓
Sub-redes
↓
VLSM
↓
Lógica AND
```

A ideia principal é deixar de olhar o IP como apenas uma sequência de números. Para entender uma rede, é preciso relacionar o **endereço IP com a máscara**, encontrar a **rede**, identificar os **hosts** e o **broadcast** e, quando necessário, dividir o espaço de endereçamento em sub-redes.

## Referências

- Cisco Networking Academy — CCNA: Introdução às Redes, Módulo 11: Endereçamento IPv4.
- RFC 1918 — Address Allocation for Private Internets.
