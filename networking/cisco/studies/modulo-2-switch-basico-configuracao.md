# Resumo do Módulo 2 — **Switch básico e configuração de dispositivo final**

**Curso:** CCNA — Introdução às Redes  
**Referência:** Cisco Networking Academy
**Data-Modúlo-2:** 16/02/2026

## 1. Introdução

O Módulo 2 ensina a configurar inicialmente um switch Cisco e dispositivos finais, como computadores. O principal objetivo é aprender a acessar o **Cisco IOS**, utilizar comandos básicos, configurar endereços IP e verificar a conectividade da rede.

Neste módulo, são trabalhados conceitos como:

- Acesso ao sistema operacional Cisco IOS;
- Navegação pelos modos de comando;
- Configuração de nome e senhas;
- Configuração de portas;
- Configuração de endereços IP;
- Salvamento das configurações;
- Testes de conectividade.

O **Cisco IOS** é o sistema operacional utilizado em roteadores e switches Cisco.

---

## 2. Acesso ao Cisco IOS

O acesso ao IOS pode ser feito de diferentes maneiras.

### Console

A conexão de console é utilizada principalmente na configuração inicial do dispositivo. Ela permite acessar o switch mesmo quando ele ainda não possui endereço IP.

### Acesso remoto

Depois que o dispositivo possui uma configuração de rede, pode ser possível acessá-lo remotamente usando tecnologias como:

- SSH;
- Telnet.

O **SSH** é preferível porque protege a comunicação por meio de criptografia. O Telnet transmite os dados sem criptografia e, por isso, é considerado menos seguro.

### Cisco Packet Tracer

O Packet Tracer permite simular o acesso ao console e praticar comandos sem utilizar um equipamento físico.

---

## 3. Modos do Cisco IOS

O IOS possui diferentes modos de operação. Cada modo permite executar determinados comandos.

### Modo EXEC do usuário

Indicado pelo símbolo:

```text
Switch>
```

Permite executar comandos básicos de consulta, mas não permite alterar a configuração do dispositivo.

Para entrar no modo privilegiado:

```text
enable
```

### Modo EXEC privilegiado

Indicado pelo símbolo:

```text
Switch#
```

Permite visualizar informações detalhadas e entrar no modo de configuração.

Para retornar ao modo de usuário:

```text
disable
```

### Modo de configuração global

Acessado com:

```text
configure terminal
```

Indicado por:

```text
Switch(config)#
```

Nesse modo, são realizadas configurações gerais, como:

- Nome do dispositivo;
- Senhas;
- Banner;
- Configurações de segurança.

### Modo de configuração de interface

Acessado, por exemplo, com:

```text
interface gigabitEthernet 0/1
```

Indicado por:

```text
Switch(config-if)#
```

É utilizado para configurar uma porta específica do switch.

### Modo de configuração de linha

Usado para configurar linhas de console ou acesso remoto:

```text
line console 0
```

Indicado por:

```text
Switch(config-line)#
```

---

## 4. Navegação no IOS

Alguns comandos importantes para navegar no IOS são:

| Comando | Função |
|---|---|
| `enable` | Entra no modo EXEC privilegiado |
| `disable` | Retorna ao modo EXEC do usuário |
| `configure terminal` | Entra no modo de configuração global |
| `exit` | Volta um nível na configuração |
| `end` | Retorna diretamente ao modo privilegiado |
| `Ctrl + Z` | Sai do modo de configuração |
| `?` | Exibe ajuda contextual |
| `show` | Mostra informações do dispositivo |
| `do` | Permite executar comandos EXEC dentro do modo de configuração |

Exemplo:

```text
Switch(config)# do show running-config
```

O IOS também permite abreviar comandos, desde que a abreviação seja suficiente para identificar apenas um comando.

Exemplo:

```text
en
conf t
```

Correspondem a:

```text
enable
configure terminal
```

---

## 5. Estrutura dos comandos

Os comandos do IOS normalmente seguem uma estrutura formada por:

1. Comando principal;
2. Palavra ou parâmetro adicional;
3. Valor ou opção específica.

Exemplo:

```text
hostname SW1
```

Nesse caso:

- `hostname` é o comando;
- `SW1` é o valor configurado.

Outro exemplo:

```text
ip address 192.168.1.2 255.255.255.0
```

Esse comando configura:

- Endereço IP: `192.168.1.2`;
- Máscara de sub-rede: `255.255.255.0`.

### Comandos show

Os comandos `show` permitem consultar o estado do dispositivo.

Exemplos:

```text
show running-config
show startup-config
show interfaces
show ip interface brief
show version
```

### Remoção de comandos

Para desfazer uma configuração, normalmente utiliza-se `no` antes do comando.

Exemplo:

```text
no shutdown
```

`no shutdown` habilita uma interface, enquanto:

```text
shutdown
```

desabilita a interface.

---

## 6. Configuração básica dos dispositivos

A configuração inicial recomendada inclui a identificação do dispositivo, senhas e mensagens de segurança.

### Definir o nome do switch

```text
enable
configure terminal
hostname SW1
```

O nome ajuda a identificar o equipamento na rede.

### Configurar senha do modo privilegiado

```text
enable secret senha-segura
```

A senha `enable secret` é preferível à senha `enable password` porque é armazenada de forma mais segura.

### Proteger o acesso pelo console

```text
line console 0
password senha-console
login
```

### Proteger linhas de acesso remoto

```text
line vty 0 15
password senha-remota
login
```

Em ambientes reais, deve-se preferir o uso de SSH e autenticação mais forte.

### Criptografar senhas simples

```text
service password-encryption
```

Esse comando evita que algumas senhas apareçam em texto simples na configuração.

### Criar um banner

```text
banner motd #Acesso autorizado somente#
```

O banner informa que o acesso ao dispositivo é restrito a usuários autorizados.

### Desativar a busca de DNS

Quando um comando é digitado incorretamente, o switch pode tentar interpretá-lo como um nome DNS. Para evitar essa espera:

```text
no ip domain-lookup
```

---

## 7. Salvamento das configurações

O IOS trabalha principalmente com dois tipos de configuração.

### Running-config

É a configuração atualmente ativa na memória do dispositivo.

```text
show running-config
```

Ela é perdida quando o equipamento é reiniciado, caso não seja salva.

### Startup-config

É a configuração armazenada na memória NVRAM e carregada quando o dispositivo é inicializado.

```text
show startup-config
```

### Salvar a configuração

Para copiar a configuração atual para a configuração de inicialização:

```text
copy running-config startup-config
```

Também é possível utilizar:

```text
write memory
```

ou:

```text
copy run start
```

É importante salvar a configuração depois de qualquer alteração relevante.

---

## 8. Portas e endereços

Os dispositivos de rede usam diferentes tipos de identificação.

### Endereço MAC

O endereço MAC identifica fisicamente uma interface de rede. Ele é associado à placa de rede e normalmente é representado em hexadecimal.

Exemplo:

```text
00:1A:2B:3C:4D:5E
```

Os switches utilizam endereços MAC para encaminhar quadros dentro da rede local.

### Endereço IP

O endereço IP identifica logicamente um dispositivo na rede. Ele permite a comunicação entre redes diferentes.

Exemplo de IPv4:

```text
192.168.1.10
```

### Portas do switch

As portas físicas do switch conectam computadores, impressoras, pontos de acesso e outros equipamentos.

Uma porta pode ser configurada para:

- Ter uma descrição;
- Ser ativada ou desativada;
- Trabalhar com determinada velocidade;
- Trabalhar em modo duplex;
- Participar de uma VLAN.

### Configurar uma descrição

```text
interface gigabitEthernet 0/1
description Conexao-com-PC1
```

### Ativar uma interface

```text
no shutdown
```

Por padrão, algumas interfaces de roteadores podem começar desativadas. O comando `no shutdown` ativa a interface.

---

## 9. Configuração de endereços IP

### Endereço IP em um dispositivo final

Em um computador, é necessário configurar:

- Endereço IP;
- Máscara de sub-rede;
- Gateway padrão;
- Servidor DNS, quando necessário.

Exemplo:

| Configuração | Valor |
|---|---|
| Endereço IP | `192.168.1.10` |
| Máscara | `255.255.255.0` |
| Gateway | `192.168.1.1` |

O **gateway padrão** é o dispositivo usado para enviar dados para outras redes.

### Endereço IP de gerenciamento no switch

Um switch de camada 2 normalmente recebe um endereço IP em uma interface virtual chamada **SVI**, geralmente associada à VLAN 1.

Exemplo:

```text
enable
configure terminal
interface vlan 1
ip address 192.168.1.2 255.255.255.0
no shutdown
exit
ip default-gateway 192.168.1.1
```

O endereço IP do switch serve principalmente para:

- Gerenciamento remoto;
- Monitoramento;
- Testes de conectividade.

Ele não é usado pelo switch para encaminhar quadros Ethernet como ocorre com um roteador.

---

## 10. Verificação da conectividade

Depois de configurar os dispositivos, é necessário testar se eles conseguem se comunicar.

### Teste com ping

No computador, pode ser utilizado:

```text
ping 192.168.1.2
```

No switch, também é possível testar:

```text
ping 192.168.1.10
```

Se houver resposta, existe conectividade entre os dispositivos.

### Verificar interfaces

```text
show ip interface brief
```

Esse comando mostra:

- Interfaces disponíveis;
- Endereços IP;
- Estado físico;
- Estado do protocolo.

Exemplo de estados:

- `up/up`: interface funcionando corretamente;
- `administratively down`: interface desativada por configuração;
- `down/down`: pode haver problema de cabo, porta ou dispositivo conectado.

### Verificar a configuração ativa

```text
show running-config
```

### Verificar informações das interfaces

```text
show interfaces
```

### Verificar a versão do IOS

```text
show version
```

Esses comandos são importantes para diagnosticar erros de configuração e problemas de conectividade.

---

## 11. Procedimento básico completo

Um exemplo de configuração inicial de um switch seria:

```text
enable
configure terminal
hostname SW1
enable secret cisco123
no ip domain-lookup
service password-encryption

line console 0
password console123
login
exit

banner motd #Acesso autorizado somente#

interface vlan 1
ip address 192.168.1.2 255.255.255.0
no shutdown
exit

ip default-gateway 192.168.1.1
end

copy running-config startup-config
```

Depois, a configuração pode ser verificada com:

```text
show running-config
show ip interface brief
ping 192.168.1.10
```

---

## Resumo final

O Módulo 2 ensina os fundamentos da configuração de switches Cisco e dispositivos finais.

Os conceitos trabalhados incluem:

- **Cisco IOS** e seus modos de comando;
- Acesso por console e acesso remoto;
- Navegação no IOS;
- Estrutura e abreviação de comandos;
- Configuração de hostname, senhas e banner;
- Configuração e gerenciamento de interfaces;
- Endereços MAC e IP;
- Configuração de IP em dispositivos finais;
- SVI e IP de gerenciamento no switch;
- `running-config` e `startup-config`;
- Salvamento das configurações;
- Verificação das interfaces e da conectividade;
- Uso do `ping` e dos comandos `show`.

O módulo também reforça a importância de configurar, salvar e verificar corretamente um dispositivo de rede antes de utilizá-lo em um ambiente real.
