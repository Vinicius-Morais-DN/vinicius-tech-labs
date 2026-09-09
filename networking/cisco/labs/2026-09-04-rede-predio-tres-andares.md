# Rede de prédio com três andares

**Data:** 04/09/2026
**Área:** Networking / Cisco
**Ferramenta:** Cisco Packet Tracer
**Nível:** Fundamentos

---

## Objetivo

Montar, no Cisco Packet Tracer, uma rede que representasse um prédio com três andares, conectando computadores por cabo e celulares por Wi-Fi.

A atividade também envolveu a configuração de endereços IP e foi realizada considerando três redes diferentes. Os detalhes de endereçamento e de segmentação de cada rede não foram registrados neste relato.

## Ambiente

A topologia foi montada no Cisco Packet Tracer. Cada andar do prédio foi representado por um computador, formando um total de três PCs:

- PC do 1º andar;
- PC do 2º andar;
- PC do 3º andar.

Também foram utilizados:

- um switch para interligar os computadores;
- um Access Point (AP) para fornecer a rede sem fio;
- três celulares conectados por Wi-Fi.

## Topologia

```text
PC 1º andar ─┐
PC 2º andar ─┼── Switch ─── Access Point ))) Celulares
PC 3º andar ─┘                  ))) 📱 📱 📱
```

## Conceitos estudados

- Conexão de computadores em uma rede local;
- configuração de endereços IPv4 nos PCs;
- uso de um switch para interligar dispositivos cabeados;
- uso de um Access Point para disponibilizar conectividade Wi-Fi;
- conexão de celulares à rede sem fio;
- organização de uma topologia em três redes diferentes.

## Comandos / Procedimento

1. Adicionei três PCs no Cisco Packet Tracer, representando os três andares do prédio.
2. Conectei os PCs ao switch.
3. Configurei um endereço IP em cada computador.
4. Adicionei um Access Point à topologia.
5. Adicionei três celulares.
6. Configurei os celulares para utilizar a rede Wi-Fi fornecida pelo Access Point.
7. Realizei a atividade nas três redes diferentes previstas no exercício.

Os valores exatos dos endereços IP, máscaras e demais configurações não foram registrados nesta documentação.

## Resultado

A topologia do prédio foi montada com três computadores conectados por cabo ao switch e três celulares utilizando a conexão Wi-Fi do Access Point.

## Problemas encontrados

Não foram registrados problemas específicos no relato da atividade.

## Solução

Não se aplica. O relato não informa nenhuma falha que tenha exigido correção.

## O que aprendi

Aprendi a montar uma topologia básica no Packet Tracer combinando dispositivos cabeados e sem fio. Também pratiquei a configuração de endereços IP nos computadores e a diferença entre o papel de um switch, que interliga dispositivos na rede local, e o de um Access Point, que fornece acesso Wi-Fi.

## Próximos passos

- Registrar os endereços IP e as máscaras usados em cada rede;
- repetir a montagem e documentar os testes de conectividade;
- verificar a comunicação entre PCs e celulares;
- detalhar como as três redes foram configuradas e interligadas.
