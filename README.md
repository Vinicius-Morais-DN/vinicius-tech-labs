# Vinicius Tech Labs

Portfólio técnico estático para registrar estudos, laboratórios e evolução em tecnologia. A interface foi construída em HTML, CSS e JavaScript puros, com layout responsivo e publicação preparada para GitHub Pages.

## Rodar localmente

Como o projeto usa apenas arquivos estáticos, abra `index.html` diretamente no navegador ou use um servidor local:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura principal

```text
vinicius-tech-labs/
├── index.html                 # página principal
├── css/style.css              # tema, layout e responsividade
├── js/script.js               # menu mobile e animações de entrada
├── assets/img/                # imagens do portfólio
├── networking/cisco/          # estudos e laboratórios existentes
└── .github/workflows/pages.yml # deploy automático no GitHub Pages
```

## Personalização rápida

1. Troque `seuemail@exemplo.com` pelo seu e-mail em `index.html`.
2. Atualize o link do LinkedIn na seção de contato.
3. Substitua as imagens em `assets/img/` por fotos próprias, capturas do Packet Tracer ou imagens com licença adequada.
4. Adicione novos cards na seção `#laboratorios` conforme novos estudos forem publicados.
5. Para ativar o deploy, em **Settings → Pages**, selecione **GitHub Actions** como fonte.

## Áreas em estudo

- Linux
- Networking & Infrastructure (Cisco)
- Cybersecurity
- Python
- Databases

O princípio do repositório continua sendo documentar somente o que foi realmente estudado ou praticado, diferenciando estudos teóricos de laboratórios práticos.
