# Resumo do Módulo 6 — **Camada de enlace de dados**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy  
**Data-Modúlo-6:** 18/05/2026

# 6.1. Finalidade da camada de enlace de dados

A camada de enlace de dados é a **camada 2 do modelo OSI**. Ela prepara os pacotes da camada de rede para serem transportados pelo meio físico e controla a comunicação entre dispositivos conectados ao mesmo enlace.

Enquanto a camada física transmite bits, a camada de enlace organiza esses bits em quadros, identifica os dispositivos no enlace local e controla como o meio de transmissão será utilizado.

Suas principais funções são:

- Permitir a comunicação entre nós diretamente conectados;
- Encapsular pacotes em quadros;
- Identificar origem e destino por endereços de camada 2;
- Controlar o acesso ao meio;
- Detectar erros de transmissão;
- Trabalhar com diferentes tecnologias e topologias;
- Entregar os quadros à camada física para transmissão.

## 6.1.1 — Comunicação entre nós

A camada de enlace é responsável pela comunicação entre dois dispositivos que compartilham o mesmo enlace ou meio de transmissão.

Exemplos de nós diretamente conectados:

- Computador e switch;
- Switch e roteador;
- Dois roteadores conectados por um enlace;
- Computador e ponto de acesso sem fio;
- Dois computadores em uma conexão direta.

A camada de enlace não entrega um único quadro através de toda a internet. Ela trabalha com a comunicação local de cada enlace do caminho.

Por exemplo, quando um computador acessa um servidor remoto, ele normalmente envia um quadro ao gateway local. O roteador recebe o quadro, remove as informações de camada 2, examina o pacote IP e cria outro quadro para o próximo enlace.

Assim:

- O pacote IP contém informações relacionadas ao destino da comunicação lógica;
- O quadro é utilizado para transportar o pacote no enlace atual;
- Os endereços MAC do quadro podem mudar a cada salto;
- O roteador reencapsula o pacote em um novo quadro.

## 6.1.2 — Serviços da camada de enlace

A camada de enlace oferece dois serviços essenciais.

### Enquadramento

O enquadramento transforma o pacote da camada de rede em um quadro. Esse quadro recebe informações de controle, como endereços de origem e destino e dados para detectar erros.

### Controle de acesso ao meio

Quando vários dispositivos compartilham um meio de transmissão, é necessário definir como e quando podem transmitir. A camada de enlace utiliza regras de acesso ao meio para organizar a comunicação e tratar possíveis colisões.

## 6.1.3 — Subcamadas LLC e MAC

A camada de enlace é dividida em duas subcamadas:

- **LLC — Logical Link Control:** controle de enlace lógico;
- **MAC — Media Access Control:** controle de acesso ao meio.

### Subcamada LLC

A LLC estabelece uma interface entre a camada de rede e as tecnologias da camada de enlace. Dependendo do formato de quadro utilizado, ela pode:

- Identificar o protocolo da camada superior;
- Permitir que diferentes protocolos de camada 3 utilizem o mesmo enlace;
- Adicionar informações de controle lógico;
- Auxiliar na entrega dos dados ao protocolo correto.

A LLC funciona como uma interface entre as camadas superiores e as tecnologias específicas de enlace.

### Subcamada MAC

A subcamada MAC está relacionada à criação e ao tratamento dos quadros, ao endereçamento de camada 2 e ao controle de acesso ao meio.

Suas funções incluem:

- Definir o formato do quadro conforme a tecnologia;
- Utilizar endereços de camada 2 quando aplicável;
- Controlar como os dispositivos acessam o meio;
- Organizar a transmissão e a recepção dos quadros.

O funcionamento da subcamada MAC varia conforme a tecnologia utilizada, como Ethernet e Wi-Fi. Nem todas as tecnologias de enlace utilizam endereços MAC no mesmo formato da Ethernet.

### O que é MAC e o que é um endereço MAC?

**MAC (Media Access Control)** significa *Controle de Acesso ao Meio*. É uma função da subcamada MAC da camada de enlace de dados, relacionada ao enquadramento, ao endereçamento de camada 2 e ao controle de acesso ao meio de transmissão.

O **endereço MAC (MAC address)** é um identificador utilizado por uma interface de rede para a comunicação dentro de um enlace local. Em Ethernet, ele identifica a origem e o destino dos quadros.

Portanto, existe uma diferença importante:

- **MAC:** refere-se à subcamada e às suas funções;
- **Endereço MAC:** é o identificador utilizado nos quadros de tecnologias como Ethernet.

### Estrutura de um endereço MAC

Em redes Ethernet, o endereço MAC tradicional possui **48 bits (6 bytes)** e costuma ser representado por 12 dígitos hexadecimais, separados em seis grupos.

Exemplo:

`00:1A:2B:3C:4D:5E`

Cada par de dígitos representa um byte, com valores que podem variar de `00` a `FF`.

Em endereços MAC globalmente administrados, os primeiros 24 bits geralmente correspondem ao OUI (*Organizationally Unique Identifier*), associado ao fabricante. Os 24 bits restantes são utilizados na identificação da interface conforme o esquema de atribuição.

O endereço também pode ser representado em outros formatos:

```text
00:1A:2B:3C:4D:5E
00-1A-2B-3C-4D-5E
001A.2B3C.4D5E
```

A representação varia, mas o valor pode ser o mesmo.

**Importante:** um endereço MAC não é necessariamente imutável nem identifica permanentemente o hardware em todas as situações. Ele pode ser alterado por software, e dispositivos podem utilizar endereços MAC aleatórios, especialmente em redes Wi-Fi.

### Endereço MAC e endereço IP

Os endereços MAC e IP possuem funções diferentes e complementares:

- **MAC:** utilizado para a entrega de quadros no enlace local;
- **IP:** utilizado no endereçamento lógico e na comunicação entre redes.

Por exemplo, quando um computador envia dados para um servidor remoto, o quadro inicial normalmente utiliza o MAC do gateway como destino, enquanto o pacote IP mantém o endereço IP do servidor como destino final.

## 6.1.4 — Tecnologias da camada de enlace

Não existe um único protocolo de camada 2 para todos os meios. A tecnologia utilizada depende do ambiente e do tipo de conexão.

Exemplos:

- **Ethernet — IEEE 802.3:** redes locais com fio;
- **Wi-Fi — IEEE 802.11:** redes locais sem fio;
- **PPP:** enlaces ponto a ponto;
- **HDLC:** comunicação por enlaces seriais;
- **Frame Relay:** tecnologia legada para redes WAN;
- **MPLS:** tecnologia utilizada em redes de provedores e ambientes corporativos.

Essas tecnologias não são todas equivalentes em funcionamento e classificação. Ethernet e Wi-Fi são tecnologias de enlace bastante comuns; PPP e HDLC são utilizados em determinados tipos de enlace. O MPLS, por sua vez, utiliza rótulos para encaminhar tráfego e é frequentemente descrito como uma tecnologia situada entre as funções tradicionais das camadas 2 e 3.

Cada tecnologia possui características próprias de encapsulamento, acesso ao meio e endereçamento.

## 6.1.5 — Enquadramento

O enquadramento possui diversas funções:

1. Delimitar os quadros dentro do fluxo de dados;
2. Identificar os dispositivos de origem e destino, quando aplicável;
3. Indicar o protocolo transportado;
4. Transportar o pacote da camada de rede;
5. Permitir a detecção de erros, quando o formato inclui esse recurso.

Sem um mecanismo de enquadramento, o receptor teria dificuldade para identificar os limites das unidades de dados e interpretar corretamente as informações recebidas.

## 6.1.6 — Campos de um quadro

Embora os campos variem de acordo com a tecnologia, um quadro pode conter:

- Informações de início ou delimitação;
- Endereço de destino;
- Endereço de origem;
- Campo de tipo ou tamanho;
- Dados encapsulados;
- Campo de verificação de erros;
- Informações de controle ou delimitação final.

A Ethernet, por exemplo, possui endereços MAC de origem e destino, um campo de tipo/tamanho, dados e FCS.

Nem todas as tecnologias possuem exatamente os mesmos campos.

## 6.1.7 — Controle de acesso ao meio

Em um enlace ponto a ponto, apenas dois dispositivos utilizam o enlace. A coordenação costuma ser mais simples.

Em um meio compartilhado, vários dispositivos podem tentar transmitir ao mesmo tempo. Nesse caso, são necessárias regras de acesso.

Os métodos de acesso podem ser:

- Baseados em contenção;
- Controlados por passagem de permissão;
- Determinísticos;
- Baseados na divisão de tempo, frequência ou código.

### Acesso baseado em contenção

Os dispositivos disputam o uso do meio. Dependendo da tecnologia, verificam se o meio parece disponível antes de transmitir. Se ocorrer uma colisão, o mecanismo de acesso pode exigir uma espera antes de uma nova tentativa.

A Ethernet antiga, que utilizava meios compartilhados e hubs, empregava CSMA/CD (*Carrier Sense Multiple Access with Collision Detection*).

Em redes Wi-Fi, utiliza-se CSMA/CA (*Carrier Sense Multiple Access with Collision Avoidance*), que procura reduzir a possibilidade de colisões.

Nas redes Ethernet modernas com switches e enlaces full-duplex, colisões não ocorrem no funcionamento normal desses enlaces.

### Acesso controlado

Em algumas tecnologias, um dispositivo só transmite quando recebe uma autorização, como um token. Isso torna o acesso mais previsível, mas pode adicionar complexidade.

### Acesso por divisão

O meio pode ser compartilhado por meio da divisão de:

- Tempo;
- Frequência;
- Códigos;
- Canais.

As redes sem fio utilizam mecanismos próprios para compartilhar o espectro de rádio.

## 6.1.8 — Detecção de erros

A camada de enlace pode detectar se um quadro foi alterado durante a transmissão. Um método comum na Ethernet é o FCS (*Frame Check Sequence*).

O emissor calcula um valor com base no conteúdo do quadro e o coloca no campo FCS. O receptor calcula novamente o valor e compara os resultados.

Se os valores forem diferentes, o quadro provavelmente foi corrompido.

É importante entender que **detectar um erro não significa necessariamente corrigi-lo**. Em muitas redes Ethernet, quadros corrompidos são descartados. Uma nova transmissão, quando necessária, depende de mecanismos de protocolos superiores ou de outras tecnologias.

## 6.1.9 — Duplex

O modo duplex determina como os dispositivos podem transmitir e receber dados.

### Half-duplex

Os dispositivos podem transmitir e receber, mas não ao mesmo tempo.

Características:

- Uso compartilhado do meio em determinadas tecnologias;
- Possibilidade de colisões;
- Necessidade de coordenação;
- Menor eficiência em comparação com enlaces full-duplex.

### Full-duplex

Os dispositivos podem transmitir e receber simultaneamente.

Características:

- Comunicação bidirecional ao mesmo tempo;
- Ausência de colisões normais em um enlace Ethernet dedicado;
- Melhor desempenho;
- Uso comum entre switches e dispositivos modernos.

Em redes Ethernet comutadas, as interfaces normalmente operam em full-duplex. Problemas de negociação de velocidade ou duplex podem causar lentidão, erros e perda de desempenho.

## 6.1.10 — Tipos de endereços MAC

Os endereços MAC podem ser utilizados para diferentes tipos de entrega.

### Unicast

Identifica uma única interface. O quadro é destinado a um dispositivo específico.

### Broadcast

É destinado a todos os dispositivos do domínio de broadcast local. Na Ethernet, o endereço de broadcast é:

`FF:FF:FF:FF:FF:FF`

### Multicast

É destinado a um grupo de dispositivos interessados em receber determinado tráfego.

Esses tipos permitem entregar quadros a uma única interface, a todos os dispositivos do domínio local ou a um grupo específico.

## 6.1.11 — Relação entre camada 2 e camada 3

A camada 3 utiliza endereços IP para a comunicação lógica entre redes. A camada 2 utiliza os endereços e os quadros definidos pela tecnologia do enlace para a entrega local.

Quando um host precisa enviar dados:

1. A camada 3 determina o IP de destino;
2. O host verifica se o destino está na mesma rede IP;
3. Se o destino for local, o quadro é enviado ao MAC do destino;
4. Se o destino estiver em outra rede, o quadro é enviado ao MAC do gateway;
5. O roteador encaminha o pacote e cria um novo quadro para o próximo enlace.

Esse processo demonstra por que os endereços IP e MAC possuem funções diferentes.

# 6.2. Topologias

Uma topologia descreve como os dispositivos e enlaces estão organizados. Ela pode ser analisada de forma física ou lógica.

## 6.2.1 — Topologia física

A topologia física mostra a disposição real de:

- Cabos e conectores;
- Switches e roteadores;
- Computadores;
- Pontos de acesso;
- Patch panels;
- Outros dispositivos de rede.

Ela é útil para instalação, documentação e manutenção.

## 6.2.2 — Topologia lógica

A topologia lógica mostra como os dados circulam, independentemente da disposição física.

Ela pode representar:

- Caminho dos quadros;
- Domínios de broadcast;
- Segmentação da rede;
- VLANs;
- Relações entre dispositivos;
- Rotas e enlaces lógicos.

Uma rede pode ter uma topologia física em estrela, mas apresentar várias redes lógicas separadas por VLANs.

## 6.2.3 — Topologias WAN

As redes WAN (*Wide Area Network*) conectam redes geograficamente distantes. Entre as principais topologias estão ponto a ponto, hub-and-spoke e full mesh.

### Ponto a ponto

Conecta diretamente dois dispositivos ou duas localidades.

```text
Roteador A -------- Roteador B
```

Vantagens:

- Simplicidade;
- Caminho previsível;
- Facilidade de diagnóstico;
- Boa adequação a enlaces dedicados.

Desvantagem:

- Para conectar muitos locais diretamente, são necessários vários enlaces individuais.

### Hub-and-spoke

Um local central, chamado *hub*, conecta-se a vários locais remotos, chamados *spokes*.

```text
             Filial A
                |
Filial B ---- Hub ---- Filial C
                |
             Filial D
```

Vantagens:

- Menor custo que uma malha completa;
- Administração centralizada;
- Implantação relativamente simples.

Desvantagens:

- O hub pode se tornar um ponto de falha;
- O tráfego entre filiais pode precisar passar pelo local central;
- O desempenho depende da capacidade do hub.

### Full mesh

Cada local possui um enlace direto com todos os demais locais.

Vantagens:

- Alta redundância;
- Vários caminhos alternativos;
- Possibilidade de comunicação direta entre os locais.

Desvantagens:

- Alto custo;
- Grande quantidade de enlaces;
- Maior complexidade de instalação e gerenciamento.

## 6.2.4 — Topologias LAN

As redes locais utilizam estruturas como estrela, estrela estendida, barramento, anel, malha e híbrida.

### Estrela

Todos os dispositivos conectam-se a um dispositivo central, geralmente um switch.

```text
        PC1
         |
PC2 — Switch — PC3
         |
        PC4
```

Vantagens:

- Fácil expansão;
- A falha em um cabo normalmente afeta apenas o dispositivo conectado a ele;
- Administração simples;
- Boa adequação à Ethernet moderna.

Desvantagem:

- A falha no dispositivo central pode afetar todos os dispositivos conectados a ele.

### Estrela estendida

Várias estrelas são interligadas por switches de distribuição ou por um switch central. É comum em empresas organizadas em camadas de acesso, distribuição e núcleo.

### Barramento

Todos os dispositivos compartilham um meio principal. Foi utilizado em redes Ethernet antigas, mas é raro em redes modernas.

Problemas:

- Possibilidade de colisões;
- Dificuldade de diagnóstico;
- Dependência do meio principal;
- Desempenho reduzido com o aumento de dispositivos.

### Anel

Cada dispositivo conecta-se a dois vizinhos, formando um circuito. Uma interrupção pode afetar a comunicação, dependendo da tecnologia e da existência de caminhos redundantes.

### Malha

Os dispositivos possuem vários caminhos entre si. Essa estrutura oferece redundância, mas aumenta a quantidade de conexões e a complexidade.

### Topologia híbrida

Combina duas ou mais topologias para atender às necessidades da rede.

## 6.2.5 — Topologias ponto a ponto e multiacesso

### Rede ponto a ponto

Há apenas dois dispositivos no enlace. Como não existe disputa entre vários transmissores, o controle de acesso é simples.

Exemplos:

- Enlace serial entre roteadores;
- Conexão direta entre dois dispositivos;
- Enlace dedicado entre um switch e outro equipamento.

### Rede multiacesso

Vários dispositivos compartilham o mesmo meio.

Exemplos:

- Ethernet antiga em barramento;
- Redes sem fio;
- Outros meios de transmissão compartilhados.

Nesses ambientes, são necessários mecanismos para organizar as transmissões e evitar ou tratar colisões, conforme a tecnologia utilizada.

## 6.2.6 — Topologia física versus lógica

Esses conceitos não são iguais.

Por exemplo:

- Fisicamente, vários computadores podem estar conectados a um único switch em estrela;
- Logicamente, VLANs diferentes podem separar esses computadores em redes distintas;
- O tráfego lógico dependerá da configuração de VLAN, do roteamento e das políticas aplicadas.

A documentação de rede deve representar os aspectos físicos e lógicos para facilitar a administração.

## 6.2.7 — Domínio de colisão

Um domínio de colisão é uma região em que transmissões simultâneas podem interferir umas nas outras.

Em redes antigas com hubs e meios compartilhados, vários dispositivos pertenciam ao mesmo domínio de colisão.

Em redes com switches:

- Cada porta separa o domínio de colisão dos demais;
- Enlaces full-duplex não apresentam colisões normais;
- A comutação reduz a disputa pelo meio.

## 6.2.8 — Domínio de broadcast

Um domínio de broadcast é o conjunto de dispositivos que recebe um quadro de broadcast de camada 2.

Por padrão:

- Um switch encaminha broadcasts dentro da mesma VLAN;
- Um roteador não encaminha broadcasts de camada 2 entre interfaces;
- VLANs e interfaces de camada 3 permitem separar domínios de broadcast.

Uma rede pode não apresentar colisões e ainda possuir um domínio de broadcast grande demais.

## 6.2.9 — Redundância e disponibilidade

Redundância significa possuir componentes ou caminhos alternativos. Ela aumenta a disponibilidade, mas pode gerar loops de camada 2.

Em uma rede Ethernet com switches interligados por vários caminhos, quadros de broadcast podem circular indefinidamente caso exista um loop.

Para evitar isso, protocolos como o **Spanning Tree Protocol (STP)** bloqueiam logicamente alguns caminhos redundantes, mantendo uma topologia sem loops de encaminhamento.

A redundância deve ser planejada para equilibrar:

- Disponibilidade;
- Custo;
- Desempenho;
- Complexidade;
- Facilidade de manutenção.

# 6.3. Quadro de enlace de dados

## 6.3.1 — Estrutura geral de um quadro

Um quadro é a unidade de dados da camada de enlace. Embora o formato varie conforme a tecnologia, ele geralmente possui:

```text
Cabeçalho | Dados | Trailer
```

O cabeçalho contém informações necessárias para entregar o quadro. O campo de dados transporta o pacote da camada de rede. O trailer pode conter informações para detecção de erros.

## 6.3.2 — Campos do cabeçalho

Os campos variam conforme a tecnologia, mas podem incluir:

- Endereço de destino;
- Endereço de origem;
- Campo de tipo ou tamanho;
- Informações de controle;
- Identificação do protocolo transportado.

### MAC de destino

Indica o destino do quadro no enlace atual. Em Ethernet, pode representar uma entrega unicast, broadcast ou multicast.

### MAC de origem

Indica o endereço de origem do quadro. O switch utiliza esse campo para aprender em qual porta cada endereço MAC foi observado.

### Tipo ou tamanho

Em Ethernet, esse campo pode indicar o protocolo transportado no campo de dados, como IPv4 ou IPv6. Em outros formatos, pode indicar o tamanho dos dados.

## 6.3.3 — Campo de dados

O campo de dados contém o pacote da camada de rede.

A camada de enlace não precisa interpretar todo o conteúdo do pacote IP para encaminhar um quadro localmente.

Em Ethernet, existe um tamanho mínimo de quadro. Se os dados forem pequenos demais, podem ser adicionados bytes de preenchimento, chamados *padding*, para atingir o tamanho mínimo exigido.

## 6.3.4 — Trailer e FCS

O quadro Ethernet inclui o campo FCS (*Frame Check Sequence*), que permite verificar a integridade do quadro.

O processo é:

1. O emissor calcula o FCS com base no conteúdo do quadro;
2. O resultado é colocado no campo FCS;
3. O hardware receptor calcula o valor novamente;
4. O valor calculado é comparado com o recebido;
5. Se houver diferença, o quadro é considerado corrompido e normalmente descartado.

A detecção de erros não garante a correção ou retransmissão automática do quadro.

## 6.3.5 — Quadro Ethernet

A Ethernet é uma das tecnologias de camada 2 mais comuns em redes locais.

Sua estrutura pode ser representada de forma simplificada assim:

```text
Preâmbulo | SFD | MAC destino | MAC origem | Tipo/Tamanho | Dados | FCS
```

### Preâmbulo

Ajuda a sincronizar o transmissor e o receptor antes da recepção do quadro.

### SFD

O *Start Frame Delimiter* indica o início efetivo do quadro Ethernet.

### MAC de destino e origem

Identificam os endereços de destino e origem no enlace local.

### Tipo/Tamanho

Indica o protocolo transportado ou o tamanho dos dados, conforme a interpretação utilizada.

### Dados

Transportam o pacote da camada de rede e, se necessário, bytes de preenchimento.

### FCS

Permite detectar alterações no quadro durante a transmissão.

## 6.3.6 — Tamanho do quadro Ethernet

Em Ethernet tradicional, os tamanhos mais comuns são:

- **Mínimo de 64 bytes**;
- **Máximo de 1518 bytes**, sem a marcação VLAN 802.1Q.

Esses valores consideram o quadro do endereço MAC de destino até o FCS. O preâmbulo e o SFD não são incluídos nessa contagem.

Com a marcação 802.1Q, o quadro pode chegar normalmente a 1522 bytes. Também existem *jumbo frames*, maiores que o padrão tradicional, quando os equipamentos envolvidos oferecem suporte.

## 6.3.7 — Quadro 802.11

O Wi-Fi também utiliza quadros de camada 2, mas eles possuem características diferentes da Ethernet.

Um quadro 802.11 pode conter até quatro campos de endereço, dependendo do tipo de transmissão e da função dos dispositivos envolvidos. Esses campos podem identificar:

- Dispositivo transmissor;
- Dispositivo receptor;
- Ponto de acesso;
- Origem ou destino no sistema de distribuição sem fio.

Os principais tipos de quadros 802.11 são:

### Quadros de gerenciamento

Usados para descobrir redes, estabelecer associações e manter a comunicação com o ponto de acesso.

### Quadros de controle

Auxiliam na coordenação do acesso ao meio e em determinadas confirmações de transmissão.

### Quadros de dados

Transportam os dados das camadas superiores.

## 6.3.8 — Quadro PPP

O PPP é utilizado em enlaces ponto a ponto. Seu quadro possui campos de delimitação, controle, identificação do protocolo transportado, dados e verificação de erros.

Como o enlace conecta dois nós, o PPP não utiliza endereços MAC da mesma maneira que a Ethernet.

O PPP pode oferecer recursos como:

- Autenticação;
- Negociação de parâmetros;
- Suporte a diferentes protocolos de camada 3;
- Detecção de erros.

## 6.3.9 — Quadro e encapsulamento

O processo de encapsulamento pode ser representado assim:

```text
Dados da aplicação
        ↓
Segmento ou datagrama da camada de transporte
        ↓
Pacote da camada de rede
        ↓
Quadro da camada de enlace
        ↓
Bits transmitidos pela camada física
```

No destino, ocorre o desencapsulamento:

```text
Bits → quadro → pacote → segmento/datagrama → dados
```

A cada salto, o dispositivo recebe o quadro e, quando necessário, cria um novo quadro para o próximo enlace.

## 6.3.10 — Encaminhamento em um switch

Um switch utiliza sua tabela de endereços MAC para decidir por qual porta encaminhar um quadro.

O processo básico é:

1. O switch recebe o quadro;
2. Lê o MAC de origem;
3. Aprende que aquele MAC está associado à porta de entrada e à VLAN;
4. Lê o MAC de destino;
5. Consulta a tabela MAC;
6. Se conhecer o destino, encaminha o quadro pela porta correspondente;
7. Se não conhecer o destino unicast, inunda o quadro pelas portas apropriadas da mesma VLAN;
8. Não encaminha o quadro de volta pela porta de entrada.

### Aprendizagem de MAC

A tabela é construída dinamicamente. Se um dispositivo mudar de porta, o switch pode atualizar a associação ao receber novos quadros.

### Unicast conhecido

Se o MAC de destino estiver na tabela, o switch encaminha o quadro pela porta correspondente.

### Unicast desconhecido

Se o destino não estiver na tabela, o switch inunda o quadro dentro da VLAN, exceto pela porta de entrada.

### Broadcast

O switch encaminha o broadcast para as portas da mesma VLAN, exceto pela porta pela qual o quadro chegou.

## 6.3.11 — Função do roteador na troca de quadros

Quando um quadro chega ao roteador, o dispositivo processa o cabeçalho de camada 2 e verifica se o quadro foi recebido corretamente. O processamento típico é:

1. A interface recebe o quadro e verifica sua integridade;
2. O roteador processa o endereço de destino de camada 2;
3. Remove as informações de camada 2;
4. Examina o pacote IP;
5. Consulta a tabela de roteamento;
6. Escolhe a interface de saída;
7. Cria um novo quadro adequado ao próximo enlace;
8. Encapsula o pacote no novo quadro;
9. Envia o quadro pela interface de saída.

Os endereços MAC do quadro de entrada e do quadro de saída podem ser diferentes. O pacote IP é encaminhado pela rede lógica, enquanto os quadros são específicos de cada enlace.

## 6.3.12 — MTU e fragmentação

A MTU (*Maximum Transmission Unit*) é o maior tamanho de pacote da camada de rede que pode ser transportado pelo enlace sem fragmentação ou outro tratamento adicional.

Quando um pacote excede a MTU do enlace, podem ocorrer situações como:

- Fragmentação IPv4, quando permitida;
- Descarte do pacote e envio de uma mensagem de erro;
- Ajuste do tamanho dos segmentos pela origem;
- Uso do *Path MTU Discovery* para identificar o tamanho máximo suportado pelo caminho.

A MTU precisa ser considerada ao diagnosticar problemas de conectividade e desempenho.

## 6.3.13 — Relação entre quadros e VLANs

Em redes Ethernet com VLANs, um quadro pode receber uma marcação adicional, como a etiqueta IEEE 802.1Q.

Essa marcação identifica a VLAN e permite transportar tráfego de várias VLANs por um enlace trunk.

### Porta de acesso

Normalmente conecta um dispositivo final a uma VLAN. Os quadros do dispositivo final geralmente não precisam incluir a etiqueta 802.1Q.

### Porta trunk

Transporta tráfego de várias VLANs. Os quadros normalmente incluem uma etiqueta que identifica a VLAN, com exceções conforme a configuração, como a VLAN nativa em determinadas implementações.

## 6.3.14 — Erros e descarte de quadros

Um quadro pode ser descartado por diferentes motivos, incluindo:

- FCS incorreto;
- Tamanho inválido;
- Congestionamento ou falta de espaço no buffer;
- VLAN não permitida no enlace;
- Interface desativada;
- Problemas de velocidade ou duplex;
- Erros físicos no meio ou nos conectores.

Ferramentas e comandos de diagnóstico podem mostrar contadores de erros de entrada, CRC, colisões, quadros descartados e erros de alinhamento.

Em switches Cisco, alguns comandos úteis são:

```text
show interfaces
show interfaces counters errors
show mac address-table
show vlan brief
show interfaces switchport
```

Os comandos disponíveis e os detalhes da saída podem variar conforme o modelo do equipamento e a versão do IOS.

# 6.4. Integração dos principais conceitos

## Exemplo: PC acessando um servidor remoto

Considere um computador conectado a um switch que acessa um servidor localizado em outra rede.

### No PC

1. A aplicação cria os dados;
2. A camada de transporte adiciona suas informações;
3. A camada de rede cria um pacote com o IP do servidor;
4. O PC identifica que o servidor está em outra rede;
5. O PC determina o endereço MAC do gateway, utilizando o mecanismo apropriado, como ARP no IPv4;
6. A camada de enlace cria um quadro com:
   - **MAC de origem:** MAC do PC;
   - **MAC de destino:** MAC do gateway;
   - **Dados:** pacote IP destinado ao servidor.

### No switch

1. O switch recebe o quadro;
2. Aprende o MAC de origem pela porta de entrada e pela VLAN;
3. Consulta o MAC de destino;
4. Encaminha o quadro pela porta correspondente ao roteador, se o destino for conhecido.

### No roteador

1. O roteador recebe e processa o quadro;
2. Verifica a integridade recebida pela interface;
3. Remove as informações de camada 2;
4. Consulta o pacote IP;
5. Escolhe a rota para o servidor;
6. Cria outro quadro adequado ao próximo enlace;
7. Utiliza endereços de camada 2 apropriados para esse enlace.

### No destino

1. O servidor recebe o quadro;
2. A interface verifica sua integridade;
3. O servidor processa o endereço de destino de camada 2;
4. Remove o cabeçalho e o trailer da camada 2;
5. Entrega o pacote à camada de rede;
6. O pacote sobe pelas camadas até chegar à aplicação.

Esse exemplo demonstra que:

- A camada 2 trabalha com a entrega local;
- A camada 3 permite a comunicação entre redes;
- O quadro é substituído a cada salto roteado;
- O pacote IP acompanha a comunicação lógica até o destino, embora alguns campos, como o TTL no IPv4, sejam alterados durante o roteamento;
- Switches Ethernet utilizam endereços MAC para encaminhar quadros;
- Roteadores utilizam endereços IP para tomar decisões de roteamento.

# 6.5. Comparação entre Ethernet, Wi-Fi e PPP

| Característica      | Ethernet                                                           | Wi-Fi                                                     | PPP                              |
| ------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- | -------------------------------- |
| Meio comum          | Cabo                                                               | Rádio                                                     | Enlace ponto a ponto             |
| Padrão ou protocolo | IEEE 802.3                                                         | IEEE 802.11                                               | Protocolo de enlace              |
| Endereço MAC        | Sim                                                                | Sim, com formato de quadro próprio                        | Não da mesma forma que Ethernet  |
| Acesso ao meio      | Depende do meio e do modo de operação; comum em redes com switches | Acesso compartilhado sem fio, com mecanismos como CSMA/CA | Controle de enlace ponto a ponto |
| Uso comum           | LAN com fio                                                        | LAN sem fio                                               | Enlaces ponto a ponto            |
| Formato de quadro   | Ethernet                                                           | 802.11                                                    | PPP                              |
| Interferência       | Pode sofrer efeitos de EMI, RFI e diafonia, dependendo do meio     | Rádio, obstáculos e interferências                        | Depende do meio físico utilizado |

# 6.6. Conceitos fundamentais para dominar

## Camada 2 não é camada 3

A camada de enlace entrega quadros no enlace local. A camada de rede encaminha pacotes entre redes.

## MAC e endereço MAC não são a mesma coisa

MAC significa *Media Access Control* e identifica uma subcamada da camada de enlace. O endereço MAC é um identificador utilizado por tecnologias como Ethernet para a entrega local de quadros.

## O quadro é local ao enlace

O quadro criado por um host não atravessa necessariamente todo o caminho até o destino. Roteadores removem as informações de camada 2 recebidas e criam um novo quadro para o próximo enlace.

## Endereço MAC e endereço IP têm funções diferentes

O MAC é utilizado na entrega local. O IP permite o endereçamento lógico e a comunicação entre redes.

## O switch aprende com o MAC de origem

O switch aprende a localização de um endereço MAC observando os quadros recebidos e associando o endereço à porta de entrada e à VLAN.

## O roteador separa domínios de broadcast

Broadcasts de camada 2 normalmente não atravessam um roteador. VLANs e interfaces de camada 3 ajudam a organizar os domínios de broadcast.

## A camada de enlace detecta, mas nem sempre corrige erros

O FCS pode indicar que um quadro foi corrompido. A recuperação pode depender de protocolos superiores ou de outros mecanismos de retransmissão.

## Full-duplex evita colisões normais

Em um enlace Ethernet dedicado full-duplex, os dispositivos transmitem e recebem simultaneamente. Isso elimina as colisões normais associadas à disputa pelo meio em ambientes half-duplex compartilhados.

# Conclusão

A camada de enlace de dados transforma pacotes em quadros, identifica dispositivos no enlace local e controla como os dados utilizam o meio de transmissão. Ela possui as subcamadas LLC e MAC e desempenha funções de enquadramento, endereçamento, controle de acesso e detecção de erros.

As topologias físicas e lógicas mostram como os dispositivos estão conectados e como o tráfego circula. Redes ponto a ponto possuem dois nós e um controle de acesso simples; redes multiacesso exigem mecanismos para organizar as transmissões; redes modernas com fio normalmente utilizam topologias em estrela com switches.

Os quadros Ethernet, Wi-Fi e PPP possuem estruturas diferentes, mas transportam dados das camadas superiores. Em uma comunicação entre redes, o pacote IP é encaminhado pelo caminho lógico, enquanto os quadros são criados e substituídos conforme o pacote atravessa cada enlace.
