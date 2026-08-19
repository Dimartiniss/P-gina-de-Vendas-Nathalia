# Subir no GitHub e publicar na Vercel

Site 100% estático: sem build, sem dependências, sem variáveis de ambiente.
A Vercel só precisa servir os arquivos.

---

## 1. O que vai para o repositório

### Vai — o site em si

| Arquivo | Por quê |
|---|---|
| `index.html` | A página inteira. Todo o HTML, o CSS e o script do cabeçalho/CTA estão aqui. |
| `animations.js` | Animações GSAP e a lógica das abas do cabeçalho. Sem ele a página funciona, mas fica estática. |
| `assets/` (5 arquivos) | As imagens que a página carrega. Sem elas o site fica sem logo, sem fundo e sem retrato. |
| `ds/broadsheet-…/styles.css` | Design system Broadsheet: as variáveis de cor, tipografia e as classes `.btn`. É a base visual de tudo. |
| `ds/broadsheet-…/_ds_bundle.js` | Bundle do mesmo design system. |
| `vendor/gsap/` (3 arquivos) | GSAP 3.15.0 + ScrollTrigger + SplitText, com versão fixa. Ficam no repositório de propósito: sem CDN, o site abre offline e não quebra se o CDN sair do ar. |

### Vai — configuração e documentação

| Arquivo | Por quê |
|---|---|
| `vercel.json` | Define o cache dos estáticos. Sem ele funciona, mas cada visita rebaixa tudo de novo. |
| `.gitignore` | Impede que os 15 MB de originais entrem no repositório. |
| `README.md` | Como rodar e como mexer em cada parte. |
| `DEPLOY.md` | Este arquivo. |
| `server.py` · `server.js` · `iniciar-servidor.bat` | Rodar o site na sua máquina. Não vão para a Vercel (ela ignora), mas são úteis para quem clonar. |
| `referencias/` | Os `.tsx` originais dos dois componentes do 21st.dev, para consulta. Pode tirar se quiser enxugar. |

### Não vai — já está no `.gitignore`

| Arquivo | Por quê não |
|---|---|
| `Img Fundo Hero.png` (8,8 MB) | É o original do fundo do hero. `assets/hero-casa-campo-hd.webp` (584 KB) é a versão que a página usa. |
| `Img Seção-Contato.png` (5,9 MB) | Mesma coisa: virou `assets/contato-fundo.webp` (84 KB). |
| `Logo PNG.webp` · `Foto Nathalia-Siqueira.webp` · `Ícone Whatsapp.avif` | Cópias byte a byte do que já está em `assets/`. Duplicata pura. |
| `Logo PNG em pé.webp` | A versão vertical do logo; a página não usa. |
| `.claude/launch.json` | Tem o caminho do Python **desta** máquina (`C:/Python314/...`). Não serve para mais ninguém. |

> **Guarde os dois PNGs grandes num backup** (Drive, HD externo). Eles são o
> original em resolução cheia; os WebP são derivados. Se um dia precisar
> reprocessar com outro corte ou outra qualidade, é deles que se parte.
>
> Git guarda binário para sempre, em todo clone — por isso ficam de fora. Se
> preferir versioná-los mesmo assim, é só apagar essas linhas do `.gitignore`.

Repositório resultante: **~900 KB**.

---

## 2. Subir para o GitHub

Na pasta do projeto:

```bash
git init
git add .
git commit -m "Landing page Nathália Siqueira"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

Confira antes do commit que os pesados ficaram de fora:

```bash
git status --short
```

Se aparecer `Img Fundo Hero.png` ou `Img Seção-Contato.png` na lista, o
`.gitignore` não pegou — pare e me chame.

---

## 3. Publicar na Vercel

1. Entre em [vercel.com/new](https://vercel.com/new) e importe o repositório.
2. Na tela de configuração:
   - **Framework Preset:** `Other`
   - **Build Command:** deixe vazio
   - **Output Directory:** deixe vazio (a raiz)
   - **Install Command:** deixe vazio
3. **Deploy.**

Não há variável de ambiente para configurar.

A partir daí, todo `git push` na `main` republica sozinho.

---

## 4. Depois de publicar, confira

- [ ] O logo aparece no cabeçalho e no rodapé
- [ ] A foto de fundo do hero carrega
- [ ] As abas do cabeçalho acendem conforme você rola
- [ ] O retrato aparece em "Quem somos"
- [ ] O botão do WhatsApp flutuante aparece depois do hero
- [ ] O último botão tem o brilho girando na borda
- [ ] Todos os botões de WhatsApp abrem `wa.me/5567992667596`
- [ ] Abra no celular: o cabeçalho fica em duas linhas e nada rola para o lado

Se alguma imagem der 404, quase sempre é diferença de maiúscula/minúscula: o
Windows não liga, o Linux da Vercel liga. Todos os nomes aqui já estão em
minúsculas sem acento, justamente por isso.

---

## 5. Domínio próprio

No painel da Vercel: **Settings → Domains → Add**. Ela mostra os registros DNS
para apontar no seu registrador. O HTTPS é automático.
