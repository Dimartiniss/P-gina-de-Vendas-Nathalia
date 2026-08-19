# Landing Nathália Siqueira — localhost

Cópia local, fiel ao design `Landing Nathalia Siqueira v2.dc.html`
(projeto Claude Design `df36d820-5624-4bff-a453-d1aa6ffc4dab`).

## Rodar

**Jeito mais simples:** dois cliques em `iniciar-servidor.bat`. Ele acha o
Python sozinho, sobe o servidor e abre o navegador. Deixe a janela preta aberta
enquanto estiver usando o site — fechar a janela derruba o servidor.

Pelo terminal:

```bash
python server.py
```

→ http://localhost:5173

Alternativa com Node (o `server.js` continua no projeto):

```bash
node server.js
```

Se der `ERR_CONNECTION_REFUSED`, é só o servidor não estar rodando: abra o
`.bat` de novo. Ele não fica ligado sozinho depois que a janela fecha nem
depois de reiniciar o computador.

## Estrutura

```
index.html                                    página (template .dc.html já renderizado)
animations.js                                 animações GSAP de todas as seções
iniciar-servidor.bat                          atalho: dois cliques e o site abre
server.py                                     servidor estático (Python, sem dependências)
server.js                                     mesmo servidor em Node, se preferir
referencias/                                  os .tsx originais dos componentes do 21st.dev
assets/
  hero-casa-campo-hd.webp        584 KB       fundo do hero (de "Img Fundo Hero.png")
  contato-fundo.webp              84 KB       fundo da última seção (de "Img Seção-Contato.png")
  nathalia-retrato.webp           44 KB       retrato (de "Foto Nathalia-Siqueira.webp")
  logo-nathalia-siqueira.webp     10 KB       logo horizontal (de "Logo PNG.webp")
  icone-whatsapp.avif            7,6 KB       ícone do CTA flutuante
vendor/gsap/                                  GSAP 3.15.0 local (roda offline)
  gsap.min.js  ScrollTrigger.min.js  SplitText.min.js
ds/broadsheet-614818a4-d494-4559-9bcc-6a954174ced1/
  styles.css                                  design system Broadsheet (cópia literal)
  _ds_bundle.js                               bundle do design system (cópia literal)
vercel.json  .gitignore  DEPLOY.md            publicação — ver DEPLOY.md
```

Os arquivos originais continuam na raiz; `assets/` guarda as versões que a
página usa. Para trocar qualquer imagem, substitua o arquivo em `assets/`
mantendo o nome.

Os dois fundos foram convertidos de PNG para WebP: **15,3 MB → 0,68 MB**, uma
redução de 96%, com o hero reamostrado para 2560px e o contato para 2400px.
Nesse tamanho não dá para ver diferença na tela, e sem isso a página levaria
15 MB de imagem a cada visita. Os PNGs originais seguem na raiz como backup —
e ficam fora do repositório (ver `DEPLOY.md`).

## Logo

O logo fornecido é **branco com transparência** (745×202). A página inverte a
cor por CSS conforme o fundo:

- header sobre o hero escuro → `filter: none` (branco original)
- header sólido e rodapé (fundo claro) → `filter: brightness(0)`

## Faixas verde-oliva

As três seções que eram cinza-claro (`#c2c9d3`) — **Serviços**, **Como funciona**
e **Onde estamos** — passaram para verde-oliva escuro. Elas estão marcadas com
`data-faixa` e a cor sai de uma variável única no `<style>` do `index.html`:

```css
:root { --color-faixa: #4b4e22; }
```

Trocar esse valor muda as três de uma vez. As seções claras (`#f3f2f2`) —
**Por que regularizar** e **Quem somos** — não mudaram, então a alternância
claro/escuro continua.

Como o fundo ficou escuro, o texto dessas seções foi invertido para claro no
mesmo bloco de CSS (títulos em branco, corpo em `rgba(255,255,255,0.82)`,
destaques e links no dourado `#e8c98d`, e as linhas divisórias das etapas em
`rgba(255,255,255,0.22)`). Precisa de `!important` porque o design original
traz tudo em `style` inline. Contrastes medidos: 8.7:1 nos títulos, 6.5:1 no
corpo e 5.5:1 nos dourados — todos acima do mínimo AA.

## Responsivo

Quatro faixas, todas com `!important` porque o design original traz tudo em
`style` inline:

| Largura | O que muda |
|---|---|
| ≤ 1100px | CTA do cabeçalho some; o grid vira 2 colunas (logo + abas) |
| ≤ 900px | Colunas de Serviços / Por que regularizar / hero / Quem somos viram 1; o hero deixa de ser alinhado à direita |
| ≤ 760px | Cabeçalho em 2 linhas (logo em cima, abas rolando embaixo); hero passa a empilhar em fluxo normal; mapa 300px |
| ≤ 480px | Logo 156px, abas e botões mais compactos |

Três consertos que valem registro:

- **As media queries de 900px do design original nunca funcionaram.** Elas
  existiam, mas sem `!important` perdiam para o `style` inline — as colunas
  nunca colapsavam no tablet nem no celular. Agora colapsam.
- **O hero empilha de verdade no celular.** O título fica em `position:absolute`
  no desktop; abaixo de 760px ele volta para o fluxo (`position:static`) e a
  seção vira `flex-direction:column`. Sem isso, em tela alta e estreita o título
  encostava no bloco de baixo.
- O wrapper ganhou `overflow-x: clip`: as animações de entrada deslocam
  elementos no eixo X (as etapas entram de `x:+26`) e isso piscava uma barra de
  rolagem horizontal no celular. `clip` corta sem criar contexto de rolagem,
  então `position:fixed` e o ScrollTrigger seguem normais.

Medido em 1280×720, 1024×768 (iPad deitado), 768×1024 (iPad em pé), 375×812 e
360×640: **zero overflow horizontal** em qualquer ponto da rolagem.

## Abas do cabeçalho

Estilo Vercel: realce arredondado que desliza até a aba sob o cursor e um traço
de 2px embaixo da aba ativa. Original em `referencias/vercel-tabs.tsx`,
reescrito sem React nas classes `.abas` / `.aba-realce` / `.aba-ativa`, com as
posições calculadas em `montarAbas()` no `animations.js`.

Diferenças em relação ao original:

- A aba ativa muda no clique **e acompanha a rolagem**, marcando a seção sob a
  linha de 45% da tela. No hero, no contato e no rodapé nenhuma fica marcada.
- O scrollspy é cálculo direto no evento de scroll, não um ScrollTrigger por
  seção: assim um salto instantâneo (tecla End, link de âncora) cai na seção
  certa em vez de manter a última que ficou ativa.
- Sobre a foto do hero as abas ficam claras; no cabeçalho sólido, escuras.
- Em tela de toque o realce de hover é desligado (`@media (hover: none)`), e a
  barra rola sozinha para manter a aba ativa visível.

## Abas + toque

O runtime de `style-hover` (herdado do design) agora só roda em ponteiro fino.
Em tela de toque o `mouseenter` dispara no tap e o `mouseleave` nunca vem,
deixando o estado de hover preso no botão.

## CTA flutuante (canto inferior direito)

Só o ícone do WhatsApp num círculo de 60px com bolinha vermelha de notificação.
O arquivo original tem 73px de margem branca em volta do círculo verde, então o
`<img>` entra a **126%** com `margin:-13%` dentro de um `overflow:hidden;
border-radius:50%` — isso recorta a margem e o verde cobre 101% do botão, sem
anel branco. O `max-width:none` no `<img>` é obrigatório: o `styles.css` do
design system tem `img { max-width: 100% }`, que esmagava o ícone.

Continua aparecendo só depois do hero, como antes, e abre o mesmo link do
WhatsApp em nova aba. Os outros botões "Falar no WhatsApp" (header, hero e
contato) não mudaram.

## Última seção (contato)

`assets/contato-fundo.png` entra de fora a fora com `cover` e foco em
`center 60%`, na mesma estrutura de camadas do hero (foto → gradiente escuro →
ruído). Como a foto é clara e movimentada, o texto passou para branco e o botão
para o mesmo branco do CTA do hero — é o que mantém a legibilidade e fecha a
página espelhando a abertura. Para voltar ao fundo claro original, é só
remover as três `<span>` de camada e devolver `background:var(--color-bg)` à
seção, com o `h2` e o telefone sem `color`.

## Último CTA — botão com brilho rotativo

O botão "Falar no WhatsApp" da seção Contato usa `.rainbow-cta`: um `::before`
com um gradiente branco desfocado girando 1 volta a cada 4s por trás de um botão
opaco, deixando só a luz correndo na borda. Original em
`referencias/button-ui.tsx`, reescrito em CSS puro.

Para o brilho aparecer o botão de dentro precisa ser escuro (branco sobre branco
não mostra nada), então ele virou `rgba(20,17,14,0.72)` com texto branco e
cantos redondos, como no original. Sobre a foto escura da seção funciona bem.
O hover escala o *wrapper*, não o botão — e esse botão fica de fora do hover em
GSAP dos demais `.btn`, para as duas escalas não se somarem.

## Animações (GSAP)

`animations.js` — GSAP 3.15 + ScrollTrigger + SplitText, tudo dentro de
`gsap.matchMedia()`:

- **Hero**: fundo com zoom-out suave, header descendo, as duas linhas do título
  entrando em tempos diferentes (a linha em itálico com um leve *skew*),
  texto/CTA/estatísticas em cascata, e saída em parallax ao rolar.
- **Títulos de seção**: `SplitText` por palavras com máscara — sobem por trás de
  uma faixa recortada.
- **Serviços / Por que regularizar**: colunas em cascata.
- **Como funciona**: número e texto de cada etapa entram por lados opostos.
- **Quem somos**: retrato revelado por `clip-path` com zoom-out; parágrafos em cascata.
- **Onde estamos**: mapa revelado por `clip-path`.
- **Contato / rodapé / CTA flutuante**: entradas suaves.
- **Botões**: leve escala no hover (só em ponteiro fino).

Quem usa `prefers-reduced-motion: reduce` recebe a página estática, já no estado
final — nada se move.

Para desativar tudo, remova `<script src="animations.js"></script>` do
`index.html`. A página continua funcionando normalmente.

## O que foi traduzido do runtime `.dc.html`

O arquivo original roda no runtime do editor (React + `support.js`). Aqui ele está
renderizado estaticamente, com o mesmo resultado visual:

| Original | Aqui |
|---|---|
| `{{ waLink }}` | montado no script (mesmo número e mesma mensagem) |
| `{{ headerModo }}` / `{{ headerStyle }}` | mesmo cálculo de scroll (`hero.offsetHeight - 90`) |
| `<sc-if mostrarAnistia / mostrarMapa>` | expandido (defaults `true`) |
| `<sc-for etapas>` | as 5 etapas expandidas |
| `<sc-if ctaFlutuanteVisivel>` | CTA fixo alternado por `display` no mesmo gatilho |
| `style-hover="…"` | mesmo comportamento, aplicado inline no `mouseenter`/`mouseleave` |

Fontes: `Space Grotesk`, `Lato` e `Playfair Display` vêm do Google Fonts (o editor
as fornecia pelo próprio host). `Source Serif 4` já vem do `@import` do `styles.css`.

A segunda linha do hero ("Falta o papel que prova.") saiu de `Tahoma 700` para
**Playfair Display itálico 500**, para alternar com o Space Grotesk da primeira
linha. Como o itálico serifado lê opticamente menor, o corpo subiu de
`clamp(44px,5.4vw,84px)` para `clamp(48px,5.9vw,92px)` e o *tracking* negativo
foi afrouxado (`-0.02em` → `-0.01em`), que era calibrado para a Tahoma. Para
voltar ao corpo exato do design, é só restaurar esses três valores no `index.html`.

## Editar

- Textos e layout: `index.html`
- Tokens do design system (cores, tipografia, espaçamentos): `_ds/.../styles.css`
- Telefone do WhatsApp: variável `props.whatsapp` no script no fim do `index.html`
