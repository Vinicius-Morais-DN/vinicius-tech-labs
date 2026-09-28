# Relatório — Lab 01: Configuração Básica de Switch Cisco

**Nome do laboratório:** `config-basic-switch`  
**Equipamento:** Cisco Switch 2960  
**Ambiente:** Cisco Packet Tracer  
**Objetivo:** Configuração inicial do switch utilizando CLI.

---

## Níveis de Privilégio no Cisco

Antes de começar, é importante entender os níveis de acesso no switch Cisco.

### Modo User EXEC (Nível 1)

```
Switch>
```

- Acesso básico e limitado.
- Permite visualizar algumas informações.
- Não permite realizar alterações de configuração.

### Modo Privileged EXEC (Nível 15)

```
Switch#
```

- Acesso administrativo ao equipamento.
- Permite visualizar configurações detalhadas.
- Permite entrar no modo de configuração.
- Pode exigir senha para acesso.

### Modo de Configuração Global

```
Switch(config)#
```

- Permite modificar configurações do equipamento.
- É acessado a partir do modo privilegiado com `configure terminal`.

---

## Comandos Utilizados

### 1. Acessar o Modo Privilegiado

```cisco
Switch> enable
```

**Função:** Eleva o acesso do nível User EXEC para o modo Privileged EXEC.

**Resultado:**

```
Switch#
```

### 2. Entrar no Modo de Configuração Global

```cisco
Switch# configure terminal
```

**Abreviação:**

```cisco
Switch# conf t
```

**Função:** Permite modificar as configurações do switch.

**Resultado:**

```
Switch(config)#
```

### 3. Definir o Hostname

```cisco
Switch(config)# hostname SW-B01
```

**Função:** Altera o nome do equipamento para facilitar sua identificação.

**Resultado:**

```
SW-B01(config)#
```

### 4. Configurar a Senha do Modo Privilegiado

```cisco
SW-B01(config)# enable secret cisco123
```

**Função:** Define uma senha para acessar o modo privilegiado (`enable`).

**Fluxo de acesso:**

```
SW-B01> enable
Password: [Digite a senha]
SW-B01#
```

**Nota:** `enable secret` armazena a senha de forma protegida na configuração. A senha `cisco123` foi utilizada apenas para este laboratório, para facilitar os testes, e não é recomendada para um ambiente real.

### 5. Configurar o Banner MOTD

```cisco
SW-B01(config)# banner motd #ACESSO RESTRITO - SOMENTE PESSOAS AUTORIZADAS#
```

**Função:** Exibe uma mensagem quando alguém acessa o equipamento.

O `#` é apenas um delimitador da mensagem e poderia ser substituído por outro caractere.

### 6. Configurar a Linha de Console

```cisco
SW-B01(config)# line console 0
```

**Função:** Entra na configuração da linha de console utilizada para acesso local ao switch.

**Resultado:**

```
SW-B01(config-line)#
```

#### Definir Senha da Console

```cisco
SW-B01(config-line)# password cisco123
```

**Função:** Define a senha utilizada para o acesso pela console.

#### Exigir a Senha

```cisco
SW-B01(config-line)# login
```

**Função:** Faz o switch solicitar a senha configurada na linha de console.

#### Retornar ao Modo Global

```cisco
SW-B01(config-line)# exit
```

**Função:** Retorna ao modo de configuração global.

### 7. Configurar as Linhas VTY (Acesso Remoto)

```cisco
SW-B01(config)# line vty 0 15
```

**Função:** Configura as linhas VTY utilizadas para acesso remoto ao equipamento.

```cisco
SW-B01(config-line)# password cisco123
SW-B01(config-line)# login
```

**Função:** Define uma senha e determina que ela deve ser solicitada no acesso pelas linhas VTY.

**Observação:** Neste laboratório foi utilizada autenticação VTY básica. Configurações de acesso remoto mais avançadas serão estudadas posteriormente.

### 8. Configurar a Interface do PC

Considerando que o PC está conectado à `Fa0/1`:

```cisco
SW-B01(config)# interface fa0/1
```

**Função:** Entra na configuração da interface FastEthernet 0/1.

**Resultado:**

```
SW-B01(config-if)#
```

#### Definir como Porta de Acesso

```cisco
SW-B01(config-if)# switchport mode access
```

**Função:** Define a interface como uma porta de acesso, utilizada neste laboratório para conectar um dispositivo final como um PC.

#### Adicionar Descrição

```cisco
SW-B01(config-if)# description PC-01
```

**Função:** Identifica a finalidade ou o dispositivo conectado àquela porta.

#### Ativar a Interface

```cisco
SW-B01(config-if)# no shutdown
```

**Função:** Remove o estado administrativo de desligamento da interface.

```cisco
SW-B01(config-if)# exit
```

### 9. Desativar Portas Não Utilizadas

Como apenas a `Fa0/1` possui um PC conectado, as demais portas podem ser desativadas:

```cisco
SW-B01(config)# interface range fa0/2 - 24
```

**Função:** Seleciona múltiplas interfaces simultaneamente.

#### Adicionar Descrição

```cisco
SW-B01(config-if-range)# description UNUSED-PORT
```

**Função:** Identifica as interfaces como portas não utilizadas.

#### Desativar

```cisco
SW-B01(config-if-range)# shutdown
```

**Função:** Coloca as interfaces em estado administrativamente desligado.

---

## Verificação e Salvamento

### Verificar Estado das Interfaces

```cisco
SW-B01# show interfaces status
```

**Função:** Mostra um resumo do estado das interfaces.

**Resultado esperado:**

```
Fa0/1    connected
Fa0/2    disabled
Fa0/3    disabled
```

### Verificar Configuração Atual

```cisco
SW-B01# show running-config
```

**Função:** Exibe a configuração em execução na memória RAM.

### Verificar VLANs

```cisco
SW-B01# show vlan brief
```

**Função:** Mostra um resumo das VLANs existentes e das portas associadas.

### Salvar a Configuração

```cisco
SW-B01# copy running-config startup-config
```

**Função:** Salva a configuração atual para que ela possa ser carregada após uma reinicialização.

| Tipo | Função |
|------|--------|
| `running-config` | Configuração em uso atualmente, mantida na memória RAM |
| `startup-config` | Configuração armazenada para ser carregada na inicialização |

---

## Resumo dos Comandos

| Comando | Função |
|---------|--------|
| `enable` | Entra no modo privilegiado |
| `configure terminal` | Entra na configuração global |
| `hostname` | Define o nome do equipamento |
| `enable secret` | Protege o modo privilegiado com senha |
| `banner motd` | Define mensagem de acesso |
| `line console 0` | Configura acesso pelo console |
| `line vty 0 15` | Configura acesso remoto |
| `password` | Define senha da linha |
| `login` | Exige a senha configurada |
| `interface` | Entra na configuração de uma interface |
| `interface range` | Seleciona múltiplas interfaces |
| `switchport mode access` | Define a porta como access |
| `description` | Identifica a interface |
| `shutdown` | Desativa administrativamente a interface |
| `no shutdown` | Ativa administrativamente a interface |
| `show interfaces status` | Verifica o estado das portas |
| `show running-config` | Exibe a configuração atual |
| `show vlan brief` | Exibe um resumo das VLANs |
| `copy running-config startup-config` | Salva a configuração |

---

## Resultado do Laboratório

Neste laboratório foi realizada a configuração básica do `SW-B01`, incluindo:

- Identificação do equipamento;
- Proteção do acesso administrativo com senhas;
- Configuração da interface de acesso para o PC;
- Desativação de portas não utilizadas;
- Procedimentos de verificação das configurações;
- Salvamento das alterações.

A configuração resultou em um switch funcional para o ambiente de laboratório.

---
