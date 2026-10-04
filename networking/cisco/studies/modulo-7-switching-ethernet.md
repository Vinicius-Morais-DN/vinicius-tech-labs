# Módulo 7 — **Switching Ethernet**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy  
**Data-Modúlo-7:** 01/06/2026

O switching Ethernet é o processo pelo qual um switch recebe quadros, aprende endereços MAC, consulta sua tabela e encaminha cada quadro pela porta apropriada.

Um switch moderno consegue:

- Conectar vários dispositivos em uma LAN;
- Criar um domínio de colisão separado por porta;
- Operar em full-duplex;
- Aprender dinamicamente os endereços MAC;
- Encaminhar quadros unicast, broadcast e multicast;
- Reduzir tráfego desnecessário;
- Trabalhar com VLANs e portas de acesso ou trunk;
- Usar diferentes métodos de encaminhamento;
- Operar em várias velocidades e modos de duplex.

# 7.1. Quadros Ethernet

## 7.1.1 — Função dos quadros Ethernet

A Ethernet é uma tecnologia de camada 2 utilizada principalmente em redes locais com fio. Ela transporta pacotes da camada de rede dentro de quadros.

O quadro Ethernet permite:

- Identificar a origem e o destino no enlace local;
- Indicar o protocolo transportado;
- Delimitar a unidade de dados;
- Detectar erros;
- Entregar o quadro à porta correta do switch.

O quadro é válido para o enlace em que foi criado. Quando um pacote atravessa um roteador, o quadro recebido é removido e um novo quadro é criado para o próximo enlace.

## 7.1.2 — Estrutura do quadro Ethernet

A estrutura simplificada é:

```text
Preâmbulo | SFD | MAC destino | MAC origem | Tipo/Tamanho | Dados | FCS
```

### Preâmbulo

O preâmbulo é utilizado para sincronizar o emissor e o receptor e indicar que uma transmissão está começando.

### SFD — Start Frame Delimiter

O delimitador de início indica o começo efetivo do quadro depois do preâmbulo.

### Endereço MAC de destino

Indica o destino do quadro no enlace atual. Pode ser um endereço:

- Unicast;
- Broadcast;
- Multicast.

### Endereço MAC de origem

Indica a interface que enviou o quadro. O switch utiliza esse campo para aprender a localização do dispositivo.

### Campo Tipo ou Tamanho

Dependendo do formato utilizado, esse campo pode indicar:

- O protocolo encapsulado, como IPv4 ou IPv6;
- O tamanho do campo de dados.

Quando interpretado como EtherType, identifica o protocolo transportado.

### Campo de dados

Transporta o pacote da camada de rede. Se os dados forem pequenos demais, pode ser acrescentado *padding* para atingir o tamanho mínimo do quadro.

### FCS — Frame Check Sequence

O FCS é usado para detectar erros. O emissor calcula um valor com base no quadro, e o receptor recalcula o valor para verificar se o conteúdo foi alterado.

Se o resultado não coincidir, o quadro é considerado corrompido e normalmente é descartado.

## 7.1.3 — Tamanho dos quadros Ethernet

Um quadro Ethernet tradicional possui estes limites:

- **Tamanho mínimo:** 64 bytes;
- **Tamanho máximo:** 1518 bytes sem a marcação 802.1Q;
- **Com 802.1Q:** até 1522 bytes;
- **Jumbo frames:** podem ser usados quando todos os equipamentos envolvidos oferecem suporte.

Os valores de 64 e 1518 bytes consideram o quadro da área de MAC de destino até o FCS. O preâmbulo e o SFD não entram nessa contagem.

O tamanho mínimo está relacionado ao funcionamento histórico do CSMA/CD e à necessidade de detectar colisões enquanto um dispositivo ainda transmitia.

## 7.1.4 — Quadros válidos e quadros descartados

Um quadro pode ser considerado inválido ou ser descartado quando:

- Possui tamanho menor que o mínimo;
- Excede o tamanho permitido;
- Contém erro no FCS;
- Apresenta problemas de alinhamento;
- Está incompleto ou corrompido;
- Chega por uma interface com erros físicos;
- É recebido em uma configuração de VLAN que não permite aquele tráfego.

Essas condições podem aparecer em contadores de interface e ajudam no diagnóstico.

## 7.1.5 — Ethernet e full-duplex

Em uma rede com switches, cada porta normalmente forma um enlace dedicado com o dispositivo conectado. Isso permite a operação full-duplex.

Em full-duplex:

- O dispositivo pode transmitir e receber simultaneamente;
- Não há disputa normal pelo meio;
- Colisões não devem ocorrer;
- O enlace pode transmitir nos dois sentidos ao mesmo tempo;
- O desempenho é melhor que em half-duplex.

Se uma interface opera em full-duplex e a outra em half-duplex, pode ocorrer *duplex mismatch*, gerando lentidão, erros, colisões tardias e baixo desempenho.

## 7.1.6 — VLAN e quadro Ethernet

Em redes com VLANs, o quadro pode receber uma marcação IEEE 802.1Q.

Em uma porta de acesso:

- O dispositivo final normalmente envia quadros sem tag;
- O switch associa a porta a uma VLAN;
- O tráfego recebido pertence à VLAN configurada.

Em uma porta trunk:

- Quadros de várias VLANs podem atravessar o enlace;
- A identificação da VLAN normalmente é transportada por meio da tag 802.1Q;
- O equipamento receptor consegue identificar a VLAN de cada quadro;
- Dependendo da configuração, a VLAN nativa pode ser transportada sem tag.

## 7.1.7 — Encaminhamento de unicast, broadcast e multicast

O switch trata os tipos de endereço de forma diferente.

### Unicast conhecido

É encaminhado somente pela porta associada ao MAC de destino.

### Unicast desconhecido

É inundado dentro da VLAN, exceto pela porta de entrada, porque o switch ainda não conhece a localização do destino.

### Broadcast

É encaminhado para as portas da mesma VLAN, exceto pela porta de origem.

### Multicast

Pode ser inundado ou tratado de maneira otimizada, dependendo da configuração e dos mecanismos de controle de multicast, como IGMP snooping em cenários apropriados.

# 7.2. Endereços MAC Ethernet

## 7.2.1 — Função do endereço MAC

O endereço MAC identifica uma interface de rede na camada de enlace e é usado para a entrega local dos quadros Ethernet.

Um endereço MAC não identifica uma rede da mesma forma que um endereço IP. Ele é utilizado para identificar a interface no contexto da comunicação de camada 2.

Exemplo:

```text
00:1A:2B:3C:4D:5E
```

## 7.2.2 — Estrutura de um endereço MAC

Um endereço MAC Ethernet possui **48 bits**, ou **6 bytes**, e costuma ser escrito como 12 dígitos hexadecimais.

```text
48 bits = 6 bytes = 12 dígitos hexadecimais
```

Cada dígito hexadecimal representa 4 bits:

```text
12 × 4 = 48 bits
```

Formatos comuns:

```text
00:1A:2B:3C:4D:5E
00-1A-2B-3C-4D-5E
001A.2B3C.4D5E
```

Os separadores são diferentes, mas representam o mesmo valor.

## 7.2.3 — OUI e identificador da interface

Em endereços MAC globalmente administrados, os primeiros 24 bits normalmente correspondem ao **OUI (Organizationally Unique Identifier)** associado a uma organização ou fabricante.

De forma simplificada:

```text
Primeiros 24 bits → OUI
Últimos 24 bits  → identificação da interface conforme o esquema de atribuição
```

Em tecnologias modernas, existem endereços administrados localmente e endereços aleatórios, especialmente em dispositivos móveis e redes Wi-Fi. Por isso, um MAC observado na rede não deve ser tratado automaticamente como uma identificação permanente do hardware ou do fabricante.

## 7.2.4 — Endereço unicast

Um endereço unicast representa uma interface individual.

Quando um quadro possui um MAC unicast de destino, o switch tenta encaminhá-lo para uma única porta.

Exemplo:

```text
Destino: 00:11:22:33:44:55
```

Se o endereço estiver na tabela MAC, o switch encaminha diretamente.

## 7.2.5 — Endereço broadcast

O broadcast é destinado a todos os dispositivos do domínio de broadcast local.

O endereço Ethernet de broadcast é:

```text
FF:FF:FF:FF:FF:FF
```

O switch encaminha um broadcast pelas portas da mesma VLAN, exceto a porta de entrada.

Exemplos de situações que podem utilizar broadcast incluem:

- Descoberta de endereços em IPv4;
- Algumas solicitações iniciais de configuração;
- Alguns mecanismos de descoberta dentro da rede local.

Como broadcasts são replicados para vários dispositivos, uma quantidade excessiva pode consumir recursos.

## 7.2.6 — Endereço multicast

O multicast identifica um grupo de interfaces. O quadro é destinado a dispositivos que participam desse grupo quando a rede possui mecanismos para controlar a entrega.

Multicast é útil para:

- Distribuição de vídeo;
- Protocolos de roteamento;
- Descoberta de serviços;
- Aplicações que enviam o mesmo conteúdo para vários receptores.

Sem otimização, alguns fluxos multicast podem ser inundados dentro da VLAN.

## 7.2.7 — MAC de origem e aprendizagem

O switch aprende com o **MAC de origem**, e não com o MAC de destino.

Exemplo:

1. Um quadro chega pela porta Fa0/1;
2. O quadro possui MAC de origem AA:AA:AA:AA:AA:AA;
3. O switch registra esse MAC na Fa0/1, associado à VLAN;
4. Um quadro futuro destinado a esse MAC poderá ser encaminhado para Fa0/1.

Se o dispositivo for conectado a uma nova porta, o switch pode atualizar a associação quando receber novos quadros.

# 7.3. A tabela de endereços MAC

## 7.3.1 — Função da tabela MAC

A tabela MAC, também chamada de **CAM table (Content Addressable Memory)** em muitos switches, associa endereços MAC a portas do switch e, quando aplicável, a VLANs.

Exemplo simplificado:

| VLAN | Endereço MAC | Tipo | Porta |
| --- | --- | --- | --- |
| 1 | 00:11:22:33:44:55 | Dinâmico | Fa0/1 |
| 1 | 00:AA:BB:CC:DD:EE | Dinâmico | Fa0/2 |
| 10 | 00:12:34:56:78:90 | Estático | Fa0/10 |

A tabela permite que o switch encaminhe quadros sem inundar o tráfego para todas as portas.

## 7.3.2 — Aprendizagem dinâmica

Quando recebe um quadro, o switch examina o MAC de origem e associa esse MAC à interface de entrada.

Processo:

1. Receber o quadro;
2. Ler o MAC de origem;
3. Verificar a VLAN de entrada;
4. Registrar ou atualizar a associação MAC/VLAN/porta;
5. Consultar o MAC de destino;
6. Encaminhar, filtrar ou inundar o quadro conforme a tabela e o tipo de tráfego.

A aprendizagem acontece automaticamente, sem que o administrador precise cadastrar todos os dispositivos.

## 7.3.3 — Envelhecimento das entradas

As entradas dinâmicas não ficam armazenadas indefinidamente. Se o switch não receber novos quadros de determinado MAC durante um período, a entrada pode expirar.

Esse processo é chamado de *aging* ou envelhecimento.

A finalidade é:

- Liberar espaço na tabela;
- Atualizar a localização de dispositivos;
- Remover informações antigas;
- Evitar encaminhamento com base em dados obsoletos.

O tempo de envelhecimento pode variar conforme o fabricante e a configuração.

## 7.3.4 — Entradas estáticas

Uma entrada estática é configurada manualmente pelo administrador.

Vantagens:

- Previsibilidade;
- Controle sobre o encaminhamento;
- Possibilidade de fixar um MAC a uma porta;
- Uso em situações específicas de projeto ou segurança.

Desvantagens:

- Exige administração manual;
- Pode ficar desatualizada;
- Não escala bem em redes grandes;
- Pode causar problemas se o dispositivo mudar de porta.

## 7.3.5 — Como o switch encaminha um unicast conhecido

Quando o MAC de destino está na tabela:

1. O quadro chega pela porta de entrada;
2. O switch consulta MAC, VLAN e porta;
3. Encontra a porta de destino;
4. Encaminha o quadro somente por essa porta;
5. As demais portas não recebem esse unicast.

Isso reduz tráfego desnecessário na LAN.

## 7.3.6 — Como o switch trata um unicast desconhecido

Quando o MAC de destino não está na tabela:

1. O switch aprende o MAC de origem;
2. Consulta o MAC de destino;
3. Não encontra uma entrada correspondente;
4. Inunda o quadro dentro da mesma VLAN, exceto pela porta de entrada;
5. O dispositivo correto pode responder;
6. O switch aprende a localização do destino a partir do MAC de origem dos próximos quadros.

A inundação aumenta temporariamente o tráfego, mas permite localizar o destino.

## 7.3.7 — Quadro destinado à própria porta

Se o MAC de destino estiver associado à mesma porta pela qual o quadro entrou, o switch normalmente filtra o quadro e não o envia de volta pela mesma interface.

Isso evita tráfego desnecessário.

## 7.3.8 — Comandos de consulta

Em switches Cisco, comandos comuns incluem:

```text
show mac address-table
```

Exibe a tabela de endereços MAC.

```text
show mac address-table dynamic
```

Exibe entradas aprendidas dinamicamente.

```text
show mac address-table static
```

Exibe entradas configuradas manualmente.

```text
show mac address-table interface fa0/1
```

Exibe entradas associadas a uma interface.

Para remover entradas dinâmicas, a sintaxe pode variar conforme o IOS e o modelo do equipamento. Um exemplo comum é:

```text
clear mac address-table dynamic
```

Também pode ser útil verificar:

```text
show interfaces
show interfaces status
show vlan brief
show interfaces fa0/1 switchport
```

Esses comandos ajudam a confirmar a tabela MAC, o estado das portas e a configuração de VLAN.

# 7.4. Métodos de encaminhamento e velocidades de switches

## 7.4.1 — Store-and-forward

No método *store-and-forward*, o switch recebe o quadro inteiro antes de encaminhá-lo.

Processo:

1. Receber o quadro completo;
2. Armazenar o quadro em um buffer;
3. Verificar tamanho e integridade;
4. Consultar o MAC de destino;
5. Encaminhar o quadro se ele for válido.

Vantagens:

- Detecta quadros corrompidos antes de encaminhá-los;
- Pode lidar com portas de velocidades diferentes;
- Permite maior controle sobre o quadro;
- Reduz a propagação de erros.

Desvantagem:

- Introduz mais latência, pois o switch precisa aguardar a recepção do quadro.

## 7.4.2 — Cut-through

No método *cut-through*, o switch começa a encaminhar o quadro antes de recebê-lo completamente.

Ele lê os campos iniciais, especialmente o MAC de destino, e inicia o encaminhamento.

Vantagem:

- Menor latência.

Desvantagens:

- Pode encaminhar quadros corrompidos;
- A verificação completa do FCS ainda não foi realizada;
- O ganho depende do ambiente e do equipamento.

## 7.4.3 — Fast-forward switching

O *fast-forward* é uma forma de *cut-through*. O switch lê rapidamente o MAC de destino e começa a transmitir o quadro.

Ele oferece baixa latência, mas pode propagar erros porque não espera a recepção do quadro completo.

## 7.4.4 — Fragment-free switching

O *fragment-free* também pertence à família *cut-through*, mas espera receber os primeiros 64 bytes do quadro antes de encaminhá-lo.

A lógica é evitar a maioria dos fragmentos de colisão, que historicamente apareciam no início do quadro em redes Ethernet compartilhadas.

Ele fica entre o *fast-forward* e o *store-and-forward* em termos de latência e verificação.

## 7.4.5 — Comparação dos métodos

| Método | Quando encaminha? | Verifica FCS antes? | Latência | Possibilidade de encaminhar erro |
| --- | --- | --- | --- | --- |
| Store-and-forward | Após receber o quadro inteiro | Sim | Maior | Menor |
| Fast-forward | Após ler o MAC de destino | Não | Muito baixa | Maior |
| Fragment-free | Após os primeiros 64 bytes | Não completamente | Baixa/intermediária | Menor que fast-forward |

Os switches modernos normalmente utilizam *store-and-forward*, pois a confiabilidade e o suporte a diferentes velocidades são mais importantes do que uma pequena redução de latência.

## 7.4.6 — Buffer de memória

O switch utiliza memória para armazenar quadros temporariamente. O buffer é importante quando:

- A porta de entrada é mais rápida que a porta de saída;
- Muitos quadros chegam ao mesmo destino;
- Existe congestionamento;
- O switch precisa aguardar uma porta ficar disponível;
- As portas operam em velocidades diferentes.

### Buffer baseado em porta

Os quadros são associados a uma fila específica. Um quadro bloqueado pode impedir o avanço de outros quadros na mesma fila.

### Buffer compartilhado

A memória é compartilhada entre as portas. O espaço pode ser utilizado de forma mais flexível.

## 7.4.7 — Velocidades Ethernet

As interfaces Ethernet podem operar em diferentes velocidades, por exemplo:

- 10 Mbps — Ethernet;
- 100 Mbps — Fast Ethernet;
- 1 Gbps — Gigabit Ethernet;
- 10 Gbps — 10 Gigabit Ethernet;
- 25, 40, 100 Gbps ou mais em ambientes de data center e backbone.

A velocidade efetiva depende de:

- Capacidade da porta;
- Cabo ou fibra utilizados;
- Transceptor;
- Padrão Ethernet;
- Configuração de duplex;
- Negociação entre as extremidades;
- Qualidade do enlace.

## 7.4.8 — Auto-negociação

A auto-negociação permite que duas interfaces conectadas troquem informações e escolham parâmetros compatíveis, como:

- Velocidade;
- Duplex;
- Recursos suportados.

Em geral, deixar as duas extremidades em auto-negociação é a prática recomendada, desde que os equipamentos sejam compatíveis.

Problemas podem ocorrer quando:

- Uma ponta está configurada manualmente e a outra em automático;
- Existe incompatibilidade de parâmetros;
- O cabo não suporta a velocidade desejada;
- Há incompatibilidade de transceptores.

## 7.4.9 — Velocidade e duplex em switches Cisco

Comandos de configuração comuns:

```text
interface gigabitEthernet 0/1
speed 1000
duplex full
```

Para retornar ao padrão automático:

```text
interface gigabitEthernet 0/1
speed auto
duplex auto
```

A sintaxe e as opções disponíveis podem variar conforme o modelo do equipamento.

Comandos de verificação:

```text
show interfaces status
show interfaces gigabitEthernet 0/1
```

Procure informações como:

- Speed;
- Duplex;
- Input errors;
- CRC;
- Collisions;
- Interface status;
- Tipo de mídia.

## 7.4.10 — Auto-MDIX

O Auto-MDIX permite que a interface detecte automaticamente a disposição dos pares do cabo e faça a correção necessária.

Assim, em muitos equipamentos modernos, o dispositivo pode aceitar cabo direto ou cruzado sem exigir que o administrador escolha manualmente o tipo.

Em equipamentos antigos ou configurações específicas, a distinção entre cabo direto e cruzado ainda pode ser importante.

## 7.4.11 — Switching simétrico e assimétrico

### Switching simétrico

As portas de entrada e saída operam na mesma velocidade. Exemplo:

```text
100 Mbps ↔ 100 Mbps
```

É mais simples e normalmente exige menos armazenamento temporário.

### Switching assimétrico

As portas possuem velocidades diferentes. Exemplo:

```text
100 Mbps ↔ 1 Gbps
```

Nesse caso, o switch precisa armazenar quadros em buffer para compensar a diferença entre a velocidade de entrada e a velocidade de saída.

## 7.4.12 — Half-duplex e CSMA/CD

O CSMA/CD (*Carrier Sense Multiple Access with Collision Detection*) foi utilizado em redes Ethernet compartilhadas e half-duplex.

Funcionamento simplificado:

1. O dispositivo escuta o meio;
2. Se o meio estiver livre, transmite;
3. Enquanto transmite, verifica se ocorreu colisão;
4. Se ocorrer colisão, interrompe a transmissão;
5. Envia um sinal de *jam*;
6. Aguarda um período aleatório;
7. Tenta novamente.

Nas redes Ethernet modernas com switches e full-duplex, o CSMA/CD não participa da operação normal, porque cada porta possui um enlace dedicado e não são esperadas colisões.

## 7.4.13 — Problemas de incompatibilidade

### Duplex mismatch

Pode ocorrer quando uma interface está em full-duplex e a outra em half-duplex.

Sintomas:

- Lentidão;
- Colisões tardias;
- Erros de entrada;
- Baixo throughput;
- Retransmissões.

### Velocidade incompatível

Se a velocidade configurada não for suportada pelo cabo ou pelo dispositivo remoto, a interface pode ficar inoperante ou negociar uma velocidade menor, conforme o equipamento.

### Cabo inadequado

Um cabo danificado, incompatível com a velocidade desejada ou fora das especificações do padrão pode impedir a operação na velocidade esperada.

# Funcionamento completo do switching

Considere três computadores conectados a um switch:

```text
PC-A ── Fa0/1
           \
            Switch
           /       \
PC-B ── Fa0/2    PC-C ── Fa0/3
```

## Primeiro quadro de PC-A

1. PC-A envia um quadro;
2. O switch recebe o quadro pela Fa0/1;
3. Aprende o MAC de PC-A na Fa0/1;
4. Consulta o MAC de destino;
5. Se não conhecer o destino unicast, inunda o quadro dentro da VLAN;
6. O dispositivo correto pode responder.

## Resposta do destino

1. O switch recebe a resposta pela porta correspondente;
2. Aprende o MAC de origem observado nessa resposta;
3. Registra a associação MAC/VLAN/porta;
4. Da próxima vez, encaminha diretamente.

## Comunicação posterior

Quando PC-A envia outro quadro para PC-B:

1. O switch lê o MAC de origem de PC-A;
2. Confirma ou atualiza a entrada de PC-A;
3. Consulta o MAC de PC-B;
4. Encontra PC-B na Fa0/2;
5. Encaminha somente pela Fa0/2.

PC-C não recebe esse unicast conhecido.

# Comandos importantes de revisão

## Consultar a tabela MAC

```text
show mac address-table
```

## Consultar uma interface

```text
show interfaces fa0/1
```

## Consultar status resumido

```text
show interfaces status
```

## Consultar VLANs

```text
show vlan brief
```

## Consultar o modo de switchport

```text
show interfaces fa0/1 switchport
```

## Configurar velocidade e duplex

```text
configure terminal
interface fa0/1
speed auto
duplex auto
end
```

## Limpar entradas MAC dinâmicas

```text
clear mac address-table dynamic
```

O comando exato pode variar conforme a versão do IOS e o modelo do switch.

# Comparações importantes

## MAC versus IP

| Característica | MAC | IP |
| --- | --- | --- |
| Camada | Enlace, camada 2 | Rede, camada 3 |
| Função | Entrega local no enlace | Comunicação lógica entre redes |
| Equipamento principal | Switch | Roteador |
| Formato comum | Hexadecimal de 48 bits | IPv4 de 32 bits ou IPv6 de 128 bits |
| Após o roteamento | O quadro muda e os MACs podem mudar | O endereço IP de destino normalmente continua sendo o do destino final |

## Unicast, broadcast e multicast

| Tipo | Destino |
| --- | --- |
| Unicast | Uma interface |
| Broadcast | Todos os dispositivos do domínio de broadcast |
| Multicast | Um grupo de interfaces |

## Store-and-forward versus cut-through

- **Store-and-forward:** recebe o quadro inteiro, verifica-o e depois encaminha;
- **Cut-through:** começa a encaminhar antes de receber o quadro completo;
- **Fast-forward:** encaminha logo após ler o MAC de destino;
- **Fragment-free:** espera os primeiros 64 bytes do quadro antes de encaminhar.

## Switch versus hub

| Característica | Switch | Hub |
| --- | --- | --- |
| Trabalha principalmente com | Endereços MAC | Sinais elétricos |
| Encaminhamento | Porta específica quando conhece o destino | Todas as portas |
| Domínio de colisão | Separado por porta | Compartilhado |
| Duplex | Normalmente full-duplex | Normalmente half-duplex |
| Eficiência | Alta | Baixa |
| Uso atual | Comum | Obsoleto em redes modernas |

# Conclusão

O switching Ethernet permite que os switches encaminhem quadros de forma eficiente dentro de uma rede local. Para isso, o switch analisa os endereços MAC, aprende a localização dos dispositivos, mantém uma tabela dinâmica e seleciona a porta de saída correta.

Os quadros Ethernet possuem campos para endereçamento, identificação de protocolos, dados e detecção de erros. O switch trata unicast conhecido, unicast desconhecido, broadcast e multicast de formas diferentes.

A escolha do método de encaminhamento envolve um equilíbrio entre latência e confiabilidade. O *store-and-forward* verifica o quadro completo e é muito comum em equipamentos atuais, enquanto métodos *cut-through* reduzem a latência, mas podem encaminhar quadros antes da verificação completa.

A velocidade e o duplex devem ser compatíveis nas duas extremidades. Recursos como auto-negociação, Auto-MDIX, buffers e operação full-duplex ajudam o switch a obter melhor desempenho. Quando há incompatibilidade de velocidade, duplex ou cabeamento, podem surgir erros, perda de desempenho e conectividade instável.

O conceito central do módulo é:

```text
O switch aprende pelo MAC de origem,
consulta o MAC de destino
e encaminha o quadro pela porta correta dentro da VLAN.
```
