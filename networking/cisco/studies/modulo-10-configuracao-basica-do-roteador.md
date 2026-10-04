# Módulo 10 — **Configuração básica do roteador**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy  
**Data-Modúlo-10:** [inserir data]

Um roteador conecta redes diferentes e encaminha pacotes com base nos endereços IP e nas informações de sua tabela de roteamento. Para desempenhar essa função, é necessário configurar suas interfaces, endereços IPv4 e IPv6, métodos de acesso e parâmetros básicos de segurança.

Este módulo apresenta a configuração inicial de um roteador Cisco IOS, a ativação e verificação de interfaces e a configuração do gateway padrão em hosts e switches de camada 2.

# 10.1. Configurar as definições iniciais do roteador

## 10.1.1. Modos do Cisco IOS

O Cisco IOS possui modos de operação diferentes, cada um com seu próprio conjunto de comandos.

**EXEC do usuário:** modo inicial, com acesso limitado a comandos de consulta. O prompt termina em `>`.

```text
Router>
```

**EXEC privilegiado:** permite verificações mais completas e acesso à configuração. É acessado com `enable` e o prompt termina em `#`.

```text
Router> enable
Router#
```

**Configuração global:** permite alterar as configurações gerais do dispositivo.

```text
Router# configure terminal
Router(config)#
```

**Configuração de interface:** seleciona uma interface específica para configurar endereço, descrição e estado.

```text
Router(config)# interface gigabitEthernet 0/0/0
Router(config-if)#
```

**Configuração de linha:** permite configurar o acesso pelo console e pelas linhas VTY.

```text
Router(config)# line console 0
Router(config-line)#
```

```text
Router(config)# line vty 0 4
Router(config-line)#
```

## 10.1.2. Nome do dispositivo

O hostname identifica o roteador nos prompts e nas mensagens de administração.

```text
Router(config)# hostname R1
R1(config)#
```

Em uma topologia com vários dispositivos, nomes consistentes, como `R1`, `R2`, `EDGE-R1` ou `BRANCH-R1`, facilitam a identificação.

## 10.1.3. Proteção do modo EXEC privilegiado

O modo privilegiado permite acessar comandos importantes de configuração e administração. Para protegê-lo, utiliza-se preferencialmente `enable secret`.

```text
R1(config)# enable secret class
```

A senha `class` é apenas um exemplo didático. Em ambientes reais, utilize uma senha forte, exclusiva e armazenada com segurança. O comando `enable password` existe, mas `enable secret` é a opção preferível.

## 10.1.4. Proteção do console

A porta de console fornece acesso local direto ao roteador. Uma configuração introdutória é:

```text
R1(config)# line console 0
R1(config-line)# password cisco
R1(config-line)# login
R1(config-line)# exit
```

- `line console 0`: seleciona a linha de console.
- `password cisco`: define a senha da linha.
- `login`: faz o IOS solicitar a senha.
- `exit`: retorna ao modo anterior.

A senha `cisco` é apenas ilustrativa e não deve ser usada em ambientes reais.

## 10.1.5. Proteção das linhas VTY

As linhas VTY permitem acesso remoto, normalmente por Telnet ou SSH.

```text
R1(config)# line vty 0 4
R1(config-line)# password cisco
R1(config-line)# login
R1(config-line)# transport input ssh telnet
R1(config-line)# exit
```

O comando `transport input` define quais protocolos podem acessar as linhas:

- `transport input ssh telnet`: permite SSH e Telnet.
- `transport input ssh`: permite somente SSH, opção preferida em redes reais.

O Telnet não oferece proteção criptográfica adequada para as credenciais e os dados transmitidos. Para configurar SSH, normalmente também é necessário preparar o nome de domínio, um usuário local e as chaves criptográficas. A disponibilidade e a sintaxe exata podem variar conforme a plataforma e a versão do IOS.

A seleção de `line vty 0 4` cobre as linhas de 0 a 4. Algumas plataformas possuem linhas adicionais, que também devem ser avaliadas.

## 10.1.6. Criptografia de senhas em texto claro

O comando abaixo aplica uma forma de ofuscação às senhas de linha que apareceriam em texto claro na configuração:

```text
R1(config)# service password-encryption
```

Isso dificulta a leitura casual, mas não equivale a um método moderno e forte de proteção de credenciais. O uso de `enable secret` continua sendo preferível a `enable password`.

Para consultar a configuração ativa:

```text
R1# show running-config
```

## 10.1.7. Banner de aviso

Um banner pode informar que o acesso é restrito a usuários autorizados.

```text
R1(config)# banner motd # WARNING: Authorized access only! #
```

O caractere `#` funciona como delimitador da mensagem e deve aparecer no início e no fim. O texto deve respeitar as políticas administrativas e legais da organização.

## 10.1.8. Salvar a configuração

A configuração ativa é chamada de `running-config` e fica na RAM. A configuração salva para ser carregada na inicialização é a `startup-config`, armazenada normalmente na NVRAM.

Para salvar as alterações:

```text
R1# copy running-config startup-config
```

Se o IOS solicitar o nome do arquivo de destino, pressione Enter para aceitar o nome padrão. Também são comuns os comandos `write memory` e `copy run start`.

| Configuração | Local | Característica |
|---|---|---|
| `running-config` | RAM | Configuração em uso; alterações não salvas podem ser perdidas após reinicialização. |
| `startup-config` | NVRAM | Configuração salva, carregada durante a inicialização. |

## 10.1.9. Exemplo de configuração inicial

```text
Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# enable secret class
R1(config)# line console 0
R1(config-line)# password cisco
R1(config-line)# login
R1(config-line)# exit
R1(config)# line vty 0 4
R1(config-line)# password cisco
R1(config-line)# login
R1(config-line)# transport input ssh
R1(config-line)# exit
R1(config)# service password-encryption
R1(config)# banner motd #Authorized access only!#
R1(config)# end
R1# copy running-config startup-config
```

Este exemplo é didático. Em uma rede real, use credenciais fortes e configure a autenticação SSH completa conforme os recursos da plataforma.

## 10.1.10. Práticas de sintaxe e Packet Tracer

As atividades de sintaxe e Packet Tracer praticam a entrada nos modos corretos, a definição do hostname, a proteção do modo privilegiado, do console e das linhas VTY, a configuração do acesso remoto, o banner, a criptografia de senhas e o salvamento da configuração.

O objetivo é reconhecer o modo exigido por cada comando, acompanhar as mudanças do prompt e verificar se a configuração foi aplicada.

# 10.2. Configurar interfaces

## 10.2.1. Por que configurar as interfaces?

Um roteador pode estar ligado, mas ainda não estar acessível pela rede. Cada interface precisa de endereçamento correto e deve estar ativada. Interfaces comuns incluem GigabitEthernet e FastEthernet; outras, como Serial, túnel ou interfaces virtuais, dependem da plataforma e da configuração.

Em um Cisco ISR, por exemplo, podem existir interfaces como `GigabitEthernet0/0/0` e `GigabitEthernet0/0/1`. A nomenclatura varia conforme o modelo.

## 10.2.2. Comandos básicos de interface

Exemplo de configuração de uma interface conectada a uma LAN:

```text
R1(config)# interface gigabitEthernet 0/0/0
R1(config-if)# description Link to LAN
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# ipv6 address 2001:db8:acad:10::1/64
R1(config-if)# no shutdown
```

- `interface`: seleciona a interface.
- `description`: registra a finalidade do enlace.
- `ip address`: configura o IPv4 e a máscara.
- `ipv6 address`: configura o IPv6 e o tamanho do prefixo.
- `no shutdown`: ativa administrativamente a interface.

Use `exit` para voltar ao modo anterior ou `end` (também Ctrl+Z) para retornar diretamente ao modo EXEC privilegiado.

## 10.2.3. Descrição da interface

A descrição é uma boa prática operacional, pois facilita a manutenção e a solução de problemas.

```text
R1(config-if)# description Link to LAN
R1(config-if)# description Link to ISP - circuit 12345
R1(config-if)# description Link to R2 G0/0/1
```

Ela pode identificar o dispositivo conectado, a rede atendida, o provedor, o circuito ou a equipe responsável. A descrição não ativa a interface nem substitui a configuração de endereçamento.

## 10.2.4. Endereçamento IPv4

O comando IPv4 inclui o endereço e a máscara:

```text
R1(config-if)# ip address 192.168.10.1 255.255.255.0
```

O endereço e a máscara precisam corresponder à rede conectada. Em um enlace entre roteadores, por exemplo:

```text
R1 G0/0/1: 209.165.200.225/30
R2 G0/0/0: 209.165.200.226/30
```

Os dois endereços pertencem à mesma sub-rede `209.165.200.224/30`.

## 10.2.5. Endereçamento IPv6

O comando IPv6 utiliza o endereço e o prefixo:

```text
R1(config-if)# ipv6 address 2001:db8:acad:10::1/64
```

Interfaces IPv6 também possuem normalmente um endereço link-local, que pertence ao bloco `FE80::/10`. Esse endereço é utilizado na comunicação do enlace e em funções como descoberta de vizinhos e roteamento.

É possível configurar um endereço link-local específico:

```text
R1(config-if)# ipv6 address FE80::1 link-local
```

Em muitos cenários, o IOS gera automaticamente um endereço link-local quando o IPv6 é habilitado na interface.

## 10.2.6. Ativação da interface

O comando `no shutdown` ativa administrativamente a interface:

```text
R1(config-if)# no shutdown
```

O comando contrário é `shutdown`, que desativa a interface.

Após a ativação, o IOS pode exibir mensagens indicando mudança de estado. Quando a interface aparece como `up/up`, está administrativamente ativa e o protocolo de linha está operacional.

Entretanto, `no shutdown` não corrige um cabo desconectado, uma porta remota desligada, uma VLAN incorreta ou outros problemas de enlace.

## 10.2.7. Exemplo de configuração de duas interfaces

```text
R1> enable
R1# configure terminal
R1(config)# interface gigabitEthernet 0/0/0
R1(config-if)# description Link to LAN
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# ipv6 address 2001:db8:acad:10::1/64
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface gigabitEthernet 0/0/1
R1(config-if)# description Link to R2
R1(config-if)# ip address 209.165.200.225 255.255.255.252
R1(config-if)# ipv6 address 2001:db8:feed:224::1/64
R1(config-if)# no shutdown
R1(config-if)# end
```

Em um enlace entre dois roteadores, as interfaces de ambos os lados precisam estar configuradas e ativas, com endereços compatíveis.

## 10.2.8. Verificar o estado das interfaces

Para uma visão rápida do IPv4:

```text
R1# show ip interface brief
```

Para IPv6:

```text
R1# show ipv6 interface brief
```

Para informações detalhadas:

```text
R1# show interfaces
R1# show ip interface
R1# show ipv6 interface
```

Esses comandos ajudam a verificar endereços, estado, erros, contadores e outras informações da interface.

## 10.2.9. Interpretar os estados

| Estado | Interpretação geral |
|---|---|
| `up/up` | Interface e protocolo de linha estão ativos. |
| `administratively down/down` | Interface foi desativada administrativamente, normalmente por `shutdown`. |
| `down/down` | Interface não está operacional; verifique conexão física, dispositivo remoto e enlace. |
| `up/down` | Camada física está ativa, mas o protocolo de linha não está funcionando corretamente. |
| `unassigned` | Não há endereço IP atribuído à interface; isso não significa, por si só, que a interface esteja desligada. |

O diagnóstico deve considerar a configuração, o estado físico e a conectividade do outro lado.

## 10.2.10. Tabelas de roteamento

Consulte as rotas IPv4 e IPv6 com:

```text
R1# show ip route
R1# show ipv6 route
```

Quando uma interface está configurada corretamente e operacional, o roteador normalmente instala uma rota para a rede diretamente conectada e uma rota local para o endereço da própria interface.

Exemplo conceitual IPv4:

```text
C 192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
L 192.168.10.1/32 is directly connected, GigabitEthernet0/0/0
```

- **C (Connected):** rede diretamente conectada.
- **L (Local):** endereço IP específico da própria interface.

No IPv6, também podem aparecer rotas conectadas para o prefixo e rotas locais para o endereço da interface. A presença dessas rotas não garante que todos os outros dispositivos estejam configurados corretamente.

## 10.2.11. Práticas de sintaxe e Packet Tracer

As atividades praticam a seleção da interface, a inclusão de uma descrição, o endereçamento IPv4 e IPv6, a ativação com `no shutdown` e a verificação com comandos `show`.

A validação deve comparar os endereços com a tabela de endereçamento e testar a conectividade com os dispositivos apropriados.

# 10.3. Configurar o gateway padrão

## 10.3.1. O que é o gateway padrão?

O gateway padrão é o endereço do roteador que um dispositivo utiliza como próximo salto quando o destino está fora da rede local.

Se o destino pertence à rede local, o host tenta entregar o quadro diretamente ao dispositivo de destino. Se o destino pertence a outra rede, o host envia o quadro ao MAC do gateway, mantendo no pacote IP o endereço do destino final.

Exemplo:

```text
Host:    192.168.10.10/24
Gateway: 192.168.10.1
```

Para alcançar outro endereço de `192.168.10.0/24`, o host pode comunicar-se diretamente na LAN. Para alcançar uma rede remota, utiliza `192.168.10.1` como gateway.

## 10.3.2. Destino local e destino remoto

Considere um roteador com duas interfaces:

```text
G0/0/0: 192.168.10.1/24
G0/0/1: 192.168.11.1/24
```

**Comunicação local:** se PC1 (`192.168.10.10`) envia dados para PC2 (`192.168.10.20`), o gateway não é utilizado para encaminhar o tráfego. PC1 resolve o MAC de PC2.

**Comunicação remota:** se PC1 envia dados para PC3 (`192.168.11.20`), o destino está em outra rede. PC1 mantém `192.168.11.20` como IP de destino, mas envia o primeiro quadro ao MAC da interface do roteador na LAN. O roteador consulta a tabela de roteamento e encaminha o pacote pela interface adequada.

## 10.3.3. Gateway padrão em hosts

Em IPv4, um host normalmente precisa de endereço, máscara e gateway:

```text
Endereço IPv4: 192.168.10.10
Máscara:       255.255.255.0
Gateway:       192.168.10.1
```

Em IPv6, o gateway padrão é frequentemente aprendido por meio de mensagens Router Advertisement (RA), enviadas pelo roteador usando ICMPv6.

Um gateway incorreto pode causar sintomas como comunicação local funcionando, acesso ao roteador local funcionando e falha de comunicação com redes remotas.

## 10.3.4. Gateway padrão em um switch de camada 2

Um switch de camada 2 encaminha quadros sem precisar de um endereço IP para essa função. Porém, para gerenciamento remoto, normalmente precisa de uma SVI (Switch Virtual Interface) com endereço IP.

Exemplo de configuração da SVI:

```text
S1(config)# interface vlan 1
S1(config-if)# ip address 192.168.10.2 255.255.255.0
S1(config-if)# no shutdown
S1(config-if)# exit
```

Para alcançar redes remotas durante o gerenciamento, configure o gateway IPv4:

```text
S1(config)# ip default-gateway 192.168.10.1
```

O endereço deve corresponder à interface do roteador na mesma rede da SVI.

Essa configuração define o próximo salto usado pelo próprio switch para tráfego de gerenciamento. Ela não configura automaticamente o gateway dos computadores conectados ao switch.

A SVI também precisa estar operacional. Dependendo do equipamento e da configuração, isso pode exigir que a VLAN exista e tenha pelo menos uma porta ativa associada.

## 10.3.5. Gateway IPv6 em switches

Em redes IPv6, o gateway padrão pode ser aprendido por mensagens Router Advertisement. O mecanismo exato disponível depende da plataforma e da configuração do switch. O comando IPv4 `ip default-gateway` não configura o gateway IPv6.

## 10.3.6. Verificar o gateway e a conectividade

No Cisco IOS, consulte a configuração e as interfaces:

```text
show running-config
show ip interface brief
show ip route
```

No Windows:

```powershell
ipconfig
ipconfig /all
route print
```

No Linux:

```bash
ip addr
ip route
```

Verifique o endereço do host, a máscara ou prefixo, o gateway, o estado da interface, a rota padrão e a conectividade com o gateway e com uma rede remota.

## 10.3.7. Atividades de Packet Tracer

As atividades de configuração e troubleshooting (solução de problemas) praticam o endereçamento das interfaces, as rotas diretamente conectadas, o gateway dos hosts e do switch e os testes de conectividade.

Uma sequência organizada de diagnóstico é:

1. Conferir a topologia e a tabela de endereçamento.
2. Testar a conectividade para isolar a falha.
3. Verificar endereços, máscaras, gateways e estados das interfaces.
4. Conferir as rotas e o caminho de retorno.
5. Corrigir o problema.
6. Testar novamente e registrar a solução.

# 10.4. Prática e revisão do módulo

## 10.4.1. Diferenças entre roteadores e switches

Os dispositivos podem variar em quantidade e tipo de interfaces, recursos de hardware, capacidade de encaminhamento, suporte a IPv4/IPv6 e comandos disponíveis. A nomenclatura das portas também depende do modelo.

Apesar dessas diferenças, o processo básico permanece: entrar no modo correto, aplicar os comandos, verificar o resultado e salvar a configuração.

## 10.4.2. Laboratório: construir uma rede com switch e roteador

O laboratório propõe uma topologia com um roteador conectando LANs. O aluno deve conectar os dispositivos às interfaces corretas, configurar os endereços e verificar a comunicação.

As tarefas podem incluir:

- Configuração básica do roteador.
- Endereçamento IPv4 e IPv6 das interfaces.
- Ativação das interfaces.
- Configuração da SVI de gerenciamento do switch.
- Configuração do gateway padrão.
- Configuração de endereços nos hosts.
- Testes de conectividade local e remota.
- Verificação das tabelas e da configuração.

Comandos úteis:

```text
show running-config
show ip interface brief
show ipv6 interface brief
show ip route
show ipv6 route
show interfaces
```

## 10.4.3. Revisão: principais conceitos

**Definições iniciais:** hostname, enable secret, proteção do console e das linhas VTY, acesso remoto, banner e salvamento da configuração.

**Interfaces:** descrição, endereço IPv4 e máscara, endereço IPv6 e prefixo, ativação com `no shutdown` e verificação com comandos `show`.

**Gateway padrão:** próximo salto utilizado para destinos fora da rede local. Em um switch de camada 2, `ip default-gateway` permite alcançar redes remotas para fins de gerenciamento IPv4.

## 10.4.4. Quiz do módulo

O quiz verifica se o aluno consegue:

- Identificar os modos do IOS.
- Configurar hostname, senhas, console, VTY e banner.
- Diferenciar SSH de Telnet.
- Salvar a configuração ativa na configuração de inicialização.
- Configurar endereços IPv4 e IPv6 nas interfaces.
- Ativar interfaces com `no shutdown`.
- Interpretar os estados das interfaces.
- Consultar as tabelas de roteamento.
- Configurar o gateway padrão de hosts e switches.
- Identificar falhas de endereçamento, interface, gateway ou rota.

# 10.5. Sequência de configuração e verificação

O exemplo abaixo reúne os comandos principais do módulo. Os endereços e as interfaces são ilustrativos e devem ser adaptados à topologia.

```text
Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# enable secret class
R1(config)# line console 0
R1(config-line)# password cisco
R1(config-line)# login
R1(config-line)# exit
R1(config)# line vty 0 4
R1(config-line)# password cisco
R1(config-line)# login
R1(config-line)# transport input ssh
R1(config-line)# exit
R1(config)# service password-encryption
R1(config)# banner motd #Authorized access only!#
R1(config)# interface gigabitEthernet 0/0/0
R1(config-if)# description Link to LAN
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# ipv6 address 2001:db8:acad:10::1/64
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface gigabitEthernet 0/0/1
R1(config-if)# description Link to R2
R1(config-if)# ip address 209.165.200.225 255.255.255.252
R1(config-if)# ipv6 address 2001:db8:feed:224::1/64
R1(config-if)# no shutdown
R1(config-if)# end
R1# show ip interface brief
R1# show ipv6 interface brief
R1# show ip route
R1# show ipv6 route
R1# copy running-config startup-config
```

A configuração acima permite praticar os comandos do módulo, mas não substitui uma configuração completa de SSH nem as rotas necessárias para alcançar redes que não estejam diretamente conectadas.

# 10.6. Diagnóstico de problemas comuns

## 10.6.1. O roteador não responde pela rede

Verifique se a interface possui endereço correto, se está ativa, se o cabo e a porta remota estão funcionando e se a máscara ou o prefixo correspondem à rede.

```text
show ip interface brief
show interfaces
show running-config
```

## 10.6.2. Interface administratively down

Esse estado normalmente indica que a interface foi desativada administrativamente. Entre na interface e ative-a:

```text
R1(config)# interface gigabitEthernet 0/0/0
R1(config-if)# no shutdown
```

## 10.6.3. Interface down/down

Verifique cabo, porta do switch, estado do dispositivo remoto, transceptor ou módulo, e se a conexão foi feita na interface correta.

## 10.6.4. Interface up/down

A camada física está ativa, mas o protocolo de linha não está operacional. Verifique a configuração do enlace, o encapsulamento quando aplicável e o dispositivo remoto.

## 10.6.5. Configuração perdida após reinicialização

Se as alterações foram feitas apenas na `running-config`, podem ser perdidas após a reinicialização. Salve com:

```text
copy running-config startup-config
```

## 10.6.6. O host alcança a LAN, mas não uma rede remota

Verifique o gateway padrão do host, os endereços das interfaces do roteador, as rotas de ida e retorno e a existência de ACLs ou filtros que possam bloquear o tráfego.

## 10.6.7. O switch não pode ser gerenciado remotamente

Verifique o endereço e o estado da SVI, a VLAN associada, o gateway padrão, a interface do roteador e a conectividade da rede de gerenciamento.

Para conferir o gateway na configuração:

```text
show running-config
```

Procure uma linha semelhante a:

```text
ip default-gateway 192.168.10.1
```

# Conclusão

O Módulo 10 ensina a transformar um roteador Cisco IOS sem configuração em um dispositivo básico, identificado, protegido e conectado às redes necessárias.

A configuração inicial define a identidade do dispositivo, protege o acesso local e remoto, apresenta um banner e salva as alterações. A configuração das interfaces associa o roteador às redes por meio de endereços IPv4 e IPv6. O gateway padrão permite que hosts e switches de camada 2 alcancem redes diferentes da rede local.

Os conceitos centrais são:

- **Hostname:** identifica o dispositivo.
- **Enable secret:** protege o modo EXEC privilegiado.
- **Console e VTY:** controlam o acesso local e remoto.
- **SSH:** opção preferível para acesso remoto seguro em relação ao Telnet.
- **Service password-encryption:** dificulta a leitura casual de senhas de linha na configuração.
- **Running-config e startup-config:** distinguem a configuração ativa da configuração salva.
- **Interface e no shutdown:** conectam o roteador à rede e ativam administrativamente a interface.
- **Comandos show:** ajudam a verificar configuração, estado e rotas.
- **Gateway padrão:** próximo salto para destinos fora da rede local.
- **SVI:** interface virtual usada, entre outras funções, para gerenciamento de um switch.
- **Ip default-gateway:** define o gateway IPv4 utilizado pelo switch de camada 2 para tráfego de gerenciamento.

# Fontes consultadas

- [Cisco Networking Academy — CCNA: Introdução às Redes](https://www.netacad.com/)
- [Cisco — Documentação de configuração do IOS](https://www.cisco.com/)
- [Currículo público CCNA 1 v7.0 — Módulo 10: Basic Router Configuration](https://itexamanswers.net/ccna-1-v7-0-curriculum-module-10-basic-router-configuration.html)

**Nota:** este documento é um resumo didático autoral baseado no material de estudo do módulo. Os endereços e as senhas são exemplos ilustrativos; adapte-os à topologia e às políticas de segurança do ambiente.
