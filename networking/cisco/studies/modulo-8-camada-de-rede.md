# Módulo 8 — **Camada de rede**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy

**Data da aula:** 03/08/2026

A camada de rede é a camada 3 do modelo OSI. Ela permite a comunicação entre dispositivos localizados em redes diferentes por meio de endereços IP e do encaminhamento de pacotes.

Enquanto a camada de enlace entrega quadros dentro de um enlace local, a camada de rede permite que os pacotes atravessem diferentes redes até chegar ao destino.

Suas principais responsabilidades são:

- Endereçamento lógico;
- Encapsulamento de segmentos em pacotes;
- Encaminhamento de pacotes entre redes;
- Seleção de caminhos por meio do roteamento;
- Controle do tempo de vida dos pacotes;
- Interconexão de redes diferentes.

Os principais protocolos estudados são IPv4 e IPv6.

## 8.1. Características da camada de rede

### 8.1.1. Necessidade da camada de rede

Uma rede local pode entregar quadros utilizando endereços MAC, mas esses endereços, sozinhos, não são suficientes para interligar milhares de redes diferentes.

A camada de rede utiliza um sistema hierárquico de endereçamento IP, que permite identificar as redes e os dispositivos de origem e destino. Assim, os roteadores podem encaminhar pacotes sem precisar conhecer individualmente todos os dispositivos da internet.

### 8.1.2. Encapsulamento na camada de rede

A camada de transporte entrega um segmento TCP ou um datagrama UDP à camada de rede. O IP adiciona seu cabeçalho, formando um pacote.

```text
Dados da aplicação
        ↓
Segmento TCP ou datagrama UDP
        ↓
Pacote IP
        ↓
Quadro Ethernet ou Wi-Fi
        ↓
Bits transmitidos pelo meio físico
```

O pacote IP contém os endereços lógicos de origem e destino. Ele pode atravessar vários roteadores, sendo encapsulado em quadros diferentes a cada enlace.

### 8.1.3. Características do protocolo IP

O IP possui três características fundamentais:

- **Sem conexão:** não estabelece uma conexão antes de encaminhar cada pacote.
- **Melhor esforço (best effort):** não garante entrega, ordem de chegada ou ausência de duplicação e perda.
- **Independente do meio:** pode ser transportado por Ethernet, Wi-Fi, fibra óptica, redes móveis, enlaces seriais e túneis.

Quando é necessária confiabilidade na entrega, protocolos de camadas superiores, como o TCP, podem fornecer mecanismos adicionais de controle.

### 8.1.4. IPv4 e IPv6

**IPv4** utiliza endereços de 32 bits, representados normalmente por quatro octetos decimais separados por pontos.

```text
192.168.1.10
```

Cada octeto varia de 0 a 255.

**IPv6** utiliza endereços de 128 bits, representados em hexadecimal e separados por dois-pontos.

```text
2001:db8:acad:1::10
```

O IPv6 amplia significativamente o espaço de endereçamento e apresenta um cabeçalho básico simplificado em relação ao IPv4.

### 8.1.5. Funções do roteador

O roteador é um dos principais dispositivos da camada de rede. Suas funções incluem:

- Examinar o endereço IP de destino;
- Consultar a tabela de roteamento;
- Selecionar a melhor rota;
- Determinar a interface de saída e o próximo salto;
- Diminuir o TTL do IPv4 ou o Hop Limit do IPv6;
- Encapsular o pacote em um novo quadro para o próximo enlace;
- Descartar pacotes que não podem ser encaminhados.

O roteador não encaminha simplesmente o mesmo quadro recebido. Ele remove o encapsulamento da camada 2, processa o pacote IP e cria um novo quadro apropriado para o enlace de saída.

### 8.1.6. Rotas diretamente conectadas

Quando uma interface de roteador possui um endereço IP e está ativa, o roteador pode instalar uma rota para a rede diretamente conectada.

Exemplo:

```text
Interface G0/0: 192.168.1.1/24
Rede conectada: 192.168.1.0/24
```

A rede `192.168.1.0/24` está diretamente conectada à interface G0/0.

### 8.1.7. Rota padrão

A rota padrão é utilizada quando não existe uma rota mais específica correspondente ao destino.

Em IPv4:

```text
0.0.0.0/0
```

Em IPv6:

```text
::/0
```

Ela representa qualquer destino que não corresponda a uma rota mais específica da tabela.

## 8.2. Pacote IPv4

### 8.2.1. Estrutura do pacote

O pacote IPv4 possui um cabeçalho e os dados encapsulados. O cabeçalho contém as informações necessárias para que os dispositivos processem e encaminhem o pacote.

### 8.2.2. Principais campos do cabeçalho IPv4

| Campo | Função |
| --- | --- |
| **Version** | Identifica a versão do protocolo. Para IPv4, o valor é 4. |
| **IHL (Internet Header Length)** | Informa o tamanho do cabeçalho. O mínimo é 20 bytes, podendo aumentar quando há opções. |
| **DSCP e ECN** | Permitem classificação de tráfego e sinalização de congestionamento. |
| **Total Length** | Indica o tamanho total do pacote, incluindo cabeçalho e dados. |
| **Identification** | Ajuda a identificar fragmentos que pertencem ao mesmo pacote original. |
| **Flags** | Controlam aspectos da fragmentação, incluindo a indicação de mais fragmentos e a proibição de fragmentar. |
| **Fragment Offset** | Indica a posição dos dados de um fragmento em relação ao pacote original. |
| **TTL (Time to Live)** | Limita o número de saltos que o pacote pode percorrer. |
| **Protocol** | Identifica o protocolo transportado, como TCP, UDP ou ICMP. |
| **Header Checksum** | Verifica erros no cabeçalho IPv4. |
| **Source Address** | Contém o endereço IPv4 de origem. |
| **Destination Address** | Contém o endereço IPv4 de destino. |
| **Options e Padding** | Permitem opções adicionais e preenchimento para alinhar o cabeçalho, quando necessário. |
| **Data** | Contém os dados encapsulados, como um segmento TCP, datagrama UDP ou mensagem ICMP. |

### 8.2.3. Fragmentação IPv4

A fragmentação pode ocorrer quando um pacote IPv4 precisa atravessar um enlace cuja MTU (Maximum Transmission Unit, ou unidade máxima de transmissão) é menor que o tamanho do pacote.

- **Identification:** permite reconhecer fragmentos do mesmo pacote original.
- **Flags:** incluem informações de controle da fragmentação.
- **Fragment Offset:** indica a posição de cada fragmento.

A fragmentação pode aumentar o processamento e reduzir a eficiência. Quando um fragmento se perde, o pacote original não pode ser completamente reconstruído.

### 8.2.4. TTL (Time to Live)

O TTL limita o número de roteadores pelos quais um pacote IPv4 pode passar. Cada roteador que encaminha o pacote reduz seu valor em pelo menos 1.

Exemplo:

```text
TTL inicial:        64
Após o 1º roteador: 63
Após o 2º roteador: 62
```

Quando o TTL chega a zero, o pacote é descartado. Esse mecanismo evita que pacotes presos em loops circulem indefinidamente e também é utilizado por ferramentas como `traceroute`.

### 8.2.5. Header Checksum

O checksum verifica erros no cabeçalho IPv4, mas não verifica todos os dados transportados pelo pacote.

Como o TTL muda em cada roteador, o checksum do cabeçalho precisa ser recalculado a cada salto.

## 8.3. Pacote IPv6

### 8.3.1. Motivos para o IPv6

O IPv6 foi desenvolvido principalmente para ampliar o espaço de endereçamento disponível e melhorar a estrutura do protocolo IP.

Entre suas características estão:

- Endereços de 128 bits;
- Cabeçalho básico de tamanho fixo;
- Uso de cabeçalhos de extensão;
- Ausência de broadcast tradicional;
- Suporte a multicast e anycast;
- Suporte à autoconfiguração de endereços.

### 8.3.2. Estrutura do cabeçalho IPv6

O cabeçalho básico IPv6 possui tamanho fixo de 40 bytes.

| Campo | Função |
| --- | --- |
| **Version** | Identifica a versão do protocolo. Para IPv6, o valor é 6. |
| **Traffic Class** | Auxilia na classificação e no tratamento diferenciado do tráfego. |
| **Flow Label** | Identifica um fluxo de pacotes que pode receber tratamento consistente. |
| **Payload Length** | Indica o tamanho dos dados após o cabeçalho básico, incluindo eventuais cabeçalhos de extensão. |
| **Next Header** | Identifica o próximo cabeçalho, que pode ser um cabeçalho de extensão ou um protocolo como TCP, UDP ou ICMPv6. |
| **Hop Limit** | Limita o número de saltos, com função semelhante ao TTL do IPv4. |
| **Source Address** | Endereço IPv6 de origem, com 128 bits. |
| **Destination Address** | Endereço IPv6 de destino, com 128 bits. |

### 8.3.3. Hop Limit

O Hop Limit possui função equivalente ao TTL do IPv4. Cada roteador reduz seu valor antes de encaminhar o pacote. Quando chega a zero, o pacote é descartado.

A diferença é que o Hop Limit representa o número máximo de saltos, e não um tempo medido em segundos.

### 8.3.4. Cabeçalhos de extensão

O IPv6 utiliza cabeçalhos de extensão para funções adicionais, como roteamento, fragmentação, opções e recursos de segurança.

O campo Next Header permite encadear esses cabeçalhos sem aumentar o tamanho do cabeçalho básico.

Diferentemente do IPv4, **os roteadores IPv6 não fragmentam os pacotes**. Quando necessário, a fragmentação é realizada pelo host de origem utilizando um cabeçalho de extensão específico.

### 8.3.5. Por que o IPv6 não utiliza broadcast?

O IPv6 não possui broadcast tradicional. Em vez disso, utiliza multicast e anycast para alcançar grupos de dispositivos ou um destino apropriado dentro de um conjunto de interfaces.

O Neighbor Discovery, baseado em ICMPv6, realiza funções como descoberta de vizinhos e resolução de endereços na rede local, substituindo o uso do ARP no IPv4.

### 8.3.6. Diferenças entre IPv4 e IPv6

| Característica | IPv4 | IPv6 |
| --- | --- | --- |
| Tamanho do endereço | 32 bits | 128 bits |
| Representação | Decimal pontuada | Hexadecimal com dois-pontos |
| Cabeçalho básico | Variável, mínimo de 20 bytes | Fixo, 40 bytes |
| Campo de saltos | TTL | Hop Limit |
| Broadcast | Existe | Não existe broadcast tradicional |
| Descoberta de vizinhos | ARP | Neighbor Discovery/ICMPv6 |
| Checksum do cabeçalho | Existe | Não existe no cabeçalho básico |
| Fragmentação | Pode ser realizada por roteadores, conforme as condições | Realizada pelo host de origem |
| Multicast | Suportado | Amplamente utilizado |

## 8.4. Como um host decide para onde enviar um pacote

### 8.4.1. Destino local ou remoto

Antes de enviar um pacote, o host verifica se o endereço de destino pertence à mesma rede local ou a uma rede remota. Essa decisão considera o endereço IP e a máscara ou o prefixo configurado.

- **Destino local:** o host envia o quadro diretamente ao dispositivo de destino.
- **Destino remoto:** o host envia o quadro ao gateway padrão.

### 8.4.2. Gateway padrão

O gateway padrão é o endereço da interface do roteador utilizada pelo host para alcançar outras redes.

Exemplo:

```text
IP do host:      192.168.1.10
Máscara:         255.255.255.0
Gateway padrão:  192.168.1.1
```

O host utiliza o gateway para alcançar destinos fora da rede `192.168.1.0/24`.

Se o gateway estiver incorreto ou ausente, o host ainda poderá se comunicar com dispositivos da rede local, mas terá dificuldades para alcançar redes remotas.

### 8.4.3. Exemplo de decisão do host

Considere:

```text
Host:      192.168.10.25/24
Destino A: 192.168.10.50
Destino B: 192.168.20.50
```

O host pertence à rede `192.168.10.0/24`.

- **Destino A:** está na mesma rede; o host envia o quadro diretamente ao destino.
- **Destino B:** está em outra rede; o host envia o quadro ao gateway padrão.

O endereço MAC de destino do quadro será o do dispositivo final no primeiro caso e o do gateway no segundo. O endereço IP de destino continua sendo o do destino final em ambos os casos.

### 8.4.4. Tabelas de roteamento dos hosts

A tabela de roteamento de um host pode conter rotas locais, redes diretamente conectadas, rotas estáticas e uma rota padrão. Dependendo do sistema, outras rotas também podem ser instaladas automaticamente.

**Windows:**

```powershell
ipconfig
route print
```

**Linux:**

```bash
ip addr
ip route
```

Esses comandos ajudam a verificar endereços, interfaces, gateways e rotas.

## 8.5. Introdução ao roteamento

### 8.5.1. Roteamento e encaminhamento

Embora estejam relacionados, os termos possuem significados diferentes:

- **Roteamento (routing):** processo de aprender, selecionar e manter caminhos até redes de destino.
- **Encaminhamento (forwarding):** ação de enviar um pacote recebido pela interface de entrada para a interface de saída apropriada.

O roteador utiliza as informações de roteamento para tomar decisões de encaminhamento.

### 8.5.2. Etapas do encaminhamento

Em linhas gerais, quando um roteador recebe um pacote:

1. Recebe o quadro pela interface de entrada.
2. Verifica se o quadro foi recebido corretamente.
3. Remove o encapsulamento da camada 2.
4. Examina o endereço IP de destino.
5. Consulta as informações de encaminhamento derivadas da tabela de roteamento.
6. Seleciona a rota correspondente e determina a interface de saída e o próximo salto.
7. Reduz o TTL ou Hop Limit.
8. Encapsula o pacote em um novo quadro.
9. Encaminha o quadro pelo enlace de saída.

### 8.5.3. Tabela de roteamento

A tabela de roteamento contém informações sobre os caminhos disponíveis. Uma entrada pode indicar:

- Rede de destino;
- Prefixo ou máscara;
- Próximo salto;
- Interface de saída;
- Origem da rota;
- Distância administrativa;
- Métrica.

Exemplo conceitual:

| Destino | Próximo salto | Interface |
| --- | --- | --- |
| `192.168.1.0/24` | Diretamente conectado | G0/0 |
| `192.168.2.0/24` | `10.0.0.2` | G0/1 |
| `0.0.0.0/0` | `10.0.0.2` | G0/1 |

Essa tabela é ilustrativa; os valores dependem da topologia e da configuração da rede.

### 8.5.4. Origem das rotas

**Redes diretamente conectadas:** são instaladas quando uma interface possui endereço IP e está operacional.

**Rotas locais:** representam os endereços IP configurados nas próprias interfaces do roteador.

**Rotas estáticas:** são configuradas manualmente pelo administrador.

Vantagens:

- Oferecem controle e previsibilidade;
- Consomem poucos recursos;
- São úteis em redes pequenas e em caminhos específicos.

Limitações:

- Exigem manutenção manual;
- Não se adaptam automaticamente a falhas, a menos que sejam configuradas alternativas apropriadas;
- Podem se tornar difíceis de administrar em redes grandes.

**Rotas dinâmicas:** são aprendidas por protocolos de roteamento que trocam informações entre roteadores.

Vantagens:

- Podem se adaptar a mudanças na topologia;
- Descobrem caminhos automaticamente;
- Facilitam a administração de redes maiores.

Limitações:

- Exigem configuração e planejamento;
- Consomem recursos de processamento, memória e, dependendo do protocolo, largura de banda;
- Podem aumentar a complexidade da rede.

### 8.5.5. Melhor correspondência de prefixo

Quando várias rotas correspondem ao endereço de destino, o roteador utiliza a regra do **prefixo mais longo (longest prefix match)**: vence a rota mais específica.

Exemplo:

```text
0.0.0.0/0
192.168.0.0/16
192.168.10.0/24
192.168.10.128/25
```

Para o destino `192.168.10.140`, a rota `192.168.10.128/25` é a mais específica entre as rotas apresentadas.

Regra geral:

```text
/25 é mais específico que /24
/24 é mais específico que /16
/16 é mais específico que /0
```

A distância administrativa e a métrica são utilizadas em outras etapas da seleção de rotas. Elas não substituem a regra do prefixo mais longo para determinar qual rota corresponde melhor ao endereço de destino.

### 8.5.6. Próximo salto e interface de saída

Uma rota pode indicar o endereço IP do próximo roteador, a interface de saída ou ambos.

O próximo salto é o dispositivo que receberá o pacote em seguida, não necessariamente o destino final.

Se a rede estiver diretamente conectada, o roteador poderá encaminhar o pacote diretamente ao host final, após resolver o endereço de camada 2 necessário para o enlace.

### 8.5.7. TTL, loops e descarte

O TTL do IPv4 e o Hop Limit do IPv6 impedem que pacotes circulem indefinidamente em loops de roteamento.

Quando esse valor chega a zero, o roteador descarta o pacote e normalmente envia uma mensagem ICMP de tempo excedido, se permitido. Ferramentas como `traceroute` e `tracert` utilizam esse comportamento para identificar os saltos do caminho.

Outras causas de descarte incluem:

- Ausência de rota correspondente e de rota padrão;
- Interface de saída inativa;
- Próximo salto inacessível;
- Problemas relacionados à MTU;
- Políticas de filtragem, como ACLs.

## 8.6. Caminho de um pacote entre redes

Considere um PC na rede `192.168.1.0/24` acessando um servidor na rede `192.168.3.0/24`.

### No host de origem

1. A aplicação gera os dados.
2. TCP ou UDP cria o segmento ou datagrama.
3. IP cria o pacote com o endereço IP do servidor como destino.
4. O host identifica que o destino está em outra rede.
5. Seleciona o gateway padrão, por exemplo, `192.168.1.1`.
6. Descobre o endereço MAC do gateway, utilizando ARP no IPv4 ou Neighbor Discovery no IPv6.
7. Cria um quadro com o MAC de origem do PC e o MAC de destino do gateway.

O pacote IP continua contendo o endereço do servidor como destino.

### No primeiro roteador

1. O roteador recebe e verifica o quadro.
2. Remove o encapsulamento da camada 2.
3. Examina o endereço IP de destino.
4. Consulta a tabela de roteamento e escolhe a melhor rota.
5. Reduz o TTL ou Hop Limit.
6. Determina a interface de saída e o próximo salto.
7. Resolve o endereço de camada 2 necessário para o próximo enlace.
8. Cria um novo quadro e encaminha o pacote.

### Nos roteadores seguintes

O processo se repete em cada roteador do caminho. Os endereços MAC do quadro normalmente mudam a cada enlace, enquanto os endereços IP de origem e destino permanecem os mesmos durante o encaminhamento comum, sem considerar mecanismos como NAT.

### No destino

O servidor recebe o quadro, remove o encapsulamento da camada 2 e entrega o pacote IP ao protocolo da camada superior correspondente.

## 8.7. Comandos úteis

### Consultar tabelas de roteamento em roteadores Cisco

```text
show ip route
```

Exibe a tabela de roteamento IPv4.

```text
show ipv6 route
```

Exibe a tabela de roteamento IPv6.

### Consultar interfaces e configuração

```text
show ip interface brief
show ipv6 interface brief
show interfaces
show running-config
```

Esses comandos ajudam a verificar o estado das interfaces, os endereços configurados, informações detalhadas dos enlaces e a configuração ativa.

### Testar conectividade

```text
ping 192.168.1.1
```

Testa a alcançabilidade do destino usando ICMP.

Em roteadores Cisco:

```text
traceroute 192.168.3.10
```

No Windows:

```powershell
tracert 192.168.3.10
```

No Linux:

```bash
traceroute 192.168.3.10
```

O resultado depende da configuração da rede e de eventuais filtros de ICMP.

## Conclusão

A camada de rede permite a comunicação entre redes diferentes por meio do endereçamento IP e do encaminhamento de pacotes. O IPv4 e o IPv6 identificam os dispositivos de origem e destino, enquanto os roteadores utilizam tabelas de roteamento para selecionar caminhos.

O host decide se o destino é local ou remoto. Para destinos locais, envia o quadro diretamente ao dispositivo. Para destinos remotos, utiliza o gateway padrão. Os roteadores analisam o endereço IP de destino, reduzem o TTL ou Hop Limit e criam novos quadros para encaminhar o pacote pelo próximo enlace.

Os conceitos centrais do módulo são:

- **Host:** decide se o destino é local ou remoto.
- **Switch:** encaminha quadros com base nos endereços MAC.
- **Roteador:** encaminha pacotes com base nas informações IP e de roteamento.
- **Tabela de roteamento:** contém caminhos conhecidos para redes de destino.
- **Prefixo mais longo:** seleciona a rota mais específica correspondente ao destino.
- **TTL/Hop Limit:** limita os saltos e ajuda a evitar que pacotes circulem indefinidamente em loops.
