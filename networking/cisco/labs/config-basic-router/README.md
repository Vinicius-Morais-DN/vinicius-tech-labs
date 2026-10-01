# Lab 02 — Configuração Básica de Roteador Cisco

## Objetivo

Realizar a configuração inicial de um roteador Cisco, aplicando configurações básicas de identificação, autenticação, acesso remoto, proteção de senhas, banner e salvamento da configuração.

Além da configuração, o laboratório teve como objetivo praticar a identificação de comandos disponíveis no IOS e comparar a configuração de um roteador com a configuração básica realizada anteriormente em um switch Cisco.

---

## Equipamento e ambiente

- **Equipamento:** Cisco ISR4331/K9
- **IOS XE:** 16.6.4
- **Ambiente:** Cisco Packet Tracer
- **Hostname final:** `R1`

---

# 1. Acesso ao modo EXEC privilegiado

Inicialmente, foi utilizado o comando:

```cisco
Router> enable
```

O comando `enable` permite acessar o modo EXEC privilegiado.

```text
Router>  →  Router#
```

O modo privilegiado permite executar comandos de gerenciamento e entrar no modo de configuração.

---

# 2. Entrar no modo de configuração global

```cisco
Router# configure terminal
```

Resultado:

```text
Enter configuration commands, one per line.
End with CNTL/Z.
```

Esse comando permite realizar alterações na configuração global do roteador.

---

# 3. Configuração do hostname

```cisco
Router(config)# hostname R1
```

Após executar o comando, o prompt foi alterado:

```text
R1(config)#
```

O `hostname` identifica o equipamento e facilita sua identificação durante a administração da rede.

---

# 4. Proteção do modo EXEC privilegiado

```cisco
R1(config)# enable secret cisco
```

O comando `enable secret` configura uma senha para proteger o acesso ao modo EXEC privilegiado.

A sequência de acesso fica:

```text
R1>
   ↓ enable
R1#
```

A senha configurada é solicitada ao utilizar o comando `enable`.

---

# 5. Configuração da linha de console

Foi configurada uma senha para o acesso pela console:

```cisco
R1(config)# line console 0
R1(config-line)# password cisco-line
R1(config-line)# login
```

### Função dos comandos

- `line console 0` → seleciona a linha de console.
- `password cisco-line` → define a senha da console.
- `login` → determina que a senha configurada deve ser solicitada no acesso.

---

# 6. Configuração das linhas VTY

As linhas VTY são utilizadas para acesso remoto ao equipamento.

```cisco
R1(config)# line vty 0 4
R1(config-line)# password cisco123
R1(config-line)# login
```

O intervalo `0 4` configura as linhas:

```text
VTY 0
VTY 1
VTY 2
VTY 3
VTY 4
```

A senha configurada foi:

```text
cisco123
```

---

# 7. Configuração do acesso remoto

Inicialmente, foi tentada a configuração:

```cisco
R1(config-line)# transport input ssh telnet
```

Porém, o equipamento apresentou:

```text
% Invalid input detected at '^' marker.
```

Para verificar quais opções estavam disponíveis no IOS, foi utilizado:

```cisco
R1(config-line)# transport input ?
```

O roteador apresentou:

```text
all     All protocols
none    No protocols
ssh     TCP/IP SSH protocol
telnet  TCP/IP Telnet protocol
```

A partir dessa informação, foi utilizada a opção:

```cisco
R1(config-line)# transport input all
```

Com isso, foram habilitados os protocolos de transporte disponíveis no equipamento.

### Observação de segurança

Apesar de o laboratório permitir essa configuração, em uma rede real é recomendado utilizar **SSH** em vez de Telnet.

O SSH fornece comunicação criptografada, enquanto o Telnet não protege a sessão da mesma maneira.

---

# 8. Criptografia das senhas

Foi utilizado:

```cisco
R1(config)# service password-encryption
```

Esse comando aplica proteção às senhas de linha armazenadas na configuração, evitando que elas apareçam diretamente em texto simples no `running-config`.

É importante observar que esse comando não substitui métodos de autenticação mais seguros. Ele representa uma proteção básica das senhas configuradas nas linhas.

---

# 9. Configuração do banner MOTD

Foi configurada uma mensagem de aviso:

```cisco
R1(config)# banner motd #Somente pessoas autorizadas do TI.#
```

O `banner motd` apresenta uma mensagem aos usuários que acessarem o equipamento.

O objetivo do banner é informar que o acesso ao dispositivo é destinado somente a pessoas autorizadas.

---

# 10. Salvamento da configuração

Durante a prática, inicialmente foi executado:

```cisco
R1(config)# copy running-config startup-config
```

Porém, o comando apresentou erro:

```text
% Invalid input detected at '^' marker.
```

O motivo foi o **modo de configuração** em que o comando foi executado.

O comando `copy` deve ser utilizado no modo EXEC privilegiado:

```text
R1#
```

Foi então utilizado:

```cisco
R1(config)# end
R1#
```

Depois:

```cisco
R1# copy running-config startup-config
```

O roteador solicitou:

```text
Destination filename [startup-config]?
```

Após confirmar, apresentou:

```text
Building configuration...

[OK]
```

Isso confirmou que a configuração foi salva com sucesso na `startup-config`.

---

# 11. Configuração final aplicada

Ao final do laboratório, as principais configurações realizadas foram:

```cisco
hostname R1

enable secret cisco

line console 0
 password cisco-line
 login

line vty 0 4
 password cisco123
 login
 transport input all

service password-encryption

banner motd #Somente pessoas autorizadas do TI.#
```

A configuração foi salva utilizando:

```cisco
copy running-config startup-config
```

---

# 12. Verificação da configuração

Para verificar a configuração atualmente em execução:

```cisco
R1# show running-config
```

Para verificar a configuração salva:

```cisco
R1# show startup-config
```

Esses comandos permitem comparar a configuração ativa com a configuração armazenada na NVRAM.

---

# 13. Observação durante a prática — semelhanças com o switch

Durante a configuração do roteador, foi possível identificar algumas semelhanças com o laboratório anterior de configuração básica de um switch Cisco.

Alguns comandos utilizados são praticamente os mesmos:

```cisco
hostname R1

enable secret cisco

line console 0
password ...
login

line vty 0 4
password ...
login

service password-encryption

banner motd #...#
```

Isso acontece porque os equipamentos Cisco utilizam o **Cisco IOS/IOS XE** e compartilham diversos mecanismos de configuração e gerenciamento.

A principal diferença está nas funções específicas de cada equipamento.

No switch, a configuração está mais relacionada à **comutação de quadros, portas, VLANs, MAC Address Table e recursos de camada 2**.

No roteador, além das configurações básicas de gerenciamento, existem recursos relacionados à **camada 3**, como endereçamento IP, interfaces roteadas, roteamento entre redes, NAT, ACLs e outros recursos.

Essa comparação ajudou a perceber que os conhecimentos adquiridos na configuração de um switch podem ser aproveitados na configuração de um roteador.

---

# 14. O que foi praticado

Durante este laboratório foram praticados:

- Acesso ao modo EXEC privilegiado;
- Entrada no modo de configuração global;
- Configuração de hostname;
- Configuração de `enable secret`;
- Proteção da console;
- Configuração das linhas VTY;
- Configuração de acesso remoto;
- Uso do `?` para descobrir opções disponíveis;
- Configuração de `service password-encryption`;
- Configuração de banner MOTD;
- Identificação de erro causado pelo modo de configuração;
- Salvamento da configuração na NVRAM;
- Verificação da configuração;
- Comparação entre a configuração de um switch e de um roteador.

---

# Resultado

O laboratório foi concluído com sucesso.

O roteador `R1` recebeu as configurações básicas de segurança e gerenciamento e teve sua configuração salva na `startup-config`.

Durante a prática também foi possível identificar que vários comandos utilizados na configuração básica de um switch são semelhantes aos utilizados em um roteador Cisco, facilitando a continuidade do aprendizado de configuração de equipamentos de rede.

## Próximo passo

Como continuação, o próximo laboratório pode abordar a configuração completa de **SSH**, incluindo:

- criação de usuário local;
- configuração de domínio;
- geração de chaves RSA;
- autenticação das linhas VTY;
- configuração de `login local`;
- teste de acesso SSH a partir de outro dispositivo.
