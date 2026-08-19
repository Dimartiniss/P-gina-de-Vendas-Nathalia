/* =====================================================================
   Landing Nathália Siqueira — animações (GSAP 3.15 + ScrollTrigger + SplitText)
   Tudo passa por gsap.matchMedia(): quem tem "prefers-reduced-motion: reduce"
   recebe a página estática, já no estado final.
   ===================================================================== */
(function () {
  "use strict";

  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  gsap.defaults({ ease: "power3.out", duration: 0.9 });

  var q = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------------
     Estado inicial aplicado antes do primeiro paint, para não haver
     "flash" do conteúdo já posicionado. Só o que vai ser animado.
     --------------------------------------------------------------- */
  var SEM_MOVIMENTO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HERO_ITENS = [
    "#hero h1[data-glass]",
    "#hero [data-linha2]",
    "#hero [data-split] p:not([data-linha2])",
    "#hero [data-split] .btn",
    "#hero [data-split] .btn + span",
    "#hero [data-stat]"
  ].join(",");

  if (!SEM_MOVIMENTO) {
    gsap.set(HERO_ITENS, { autoAlpha: 0 });
    gsap.set("#hero [data-linha-stats]", { borderTopColor: "rgba(255,255,255,0)" });
  }

  /* =====================================================================
     ABAS DO CABEÇALHO — estilo Vercel (vercel-tabs.tsx, do 21st.dev),
     reescrito sem React. O realce desliza até a aba sob o cursor e o traço
     marca a aba ativa. Diferença em relação ao original: aqui a aba ativa
     muda no clique E acompanha a rolagem, indicando a seção em que você está.
     Fica fora do matchMedia porque navegar não é decoração.
     ===================================================================== */
  function montarAbas() {
    var nav = document.querySelector(".abas");
    if (!nav) return;
    var realce = nav.querySelector(".aba-realce");
    var traco = nav.querySelector(".aba-ativa");
    var abas = q(".aba", nav);
    if (!realce || !traco || !abas.length) return;

    var ativa = -1;
    var podeHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function posicionar(el, alvo) {
      el.style.left = alvo.offsetLeft + "px";
      el.style.width = alvo.offsetWidth + "px";
    }

    /* mantém a aba marcada visível quando a barra rola na horizontal (celular) */
    function trazerParaVista(aba) {
      if (nav.scrollWidth <= nav.clientWidth + 1) return;
      var esq = aba.offsetLeft;
      var dir = esq + aba.offsetWidth;
      var margem = 14;
      if (esq < nav.scrollLeft + margem) {
        nav.scrollTo({ left: Math.max(0, esq - margem), behavior: "smooth" });
      } else if (dir > nav.scrollLeft + nav.clientWidth - margem) {
        nav.scrollTo({ left: dir - nav.clientWidth + margem, behavior: "smooth" });
      }
    }

    function definirAtiva(i, acompanhar) {
      if (i === ativa) return;
      ativa = i;
      abas.forEach(function (a, idx) {
        if (idx === i) a.setAttribute("data-ativa", "");
        else a.removeAttribute("data-ativa");
      });
      if (i < 0) { traco.style.opacity = "0"; return; }
      posicionar(traco, abas[i]);
      traco.style.opacity = "1";
      if (acompanhar) trazerParaVista(abas[i]);
    }

    if (podeHover) {
      abas.forEach(function (aba) {
        aba.addEventListener("mouseenter", function () {
          posicionar(realce, aba);
          realce.style.opacity = "1";
        });
      });
      nav.addEventListener("mouseleave", function () { realce.style.opacity = "0"; });
    }

    abas.forEach(function (aba, i) {
      aba.addEventListener("click", function () { definirAtiva(i, false); });
    });

    /* larguras mudam com fontes, resize e rotação do aparelho */
    function recalcular() {
      if (ativa >= 0) posicionar(traco, abas[ativa]);
      realce.style.opacity = "0";
    }
    window.addEventListener("resize", recalcular);
    window.addEventListener("orientationchange", recalcular);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(recalcular);

    /* Qual seção está sob a linha de 45% da tela. Cálculo direto em vez de um
       ScrollTrigger por seção: assim um salto instantâneo (tecla End, link de
       âncora) cai no resultado certo, em vez de manter a última seção que
       chegou a ficar ativa. Fora das seções mapeadas — hero, contato, rodapé —
       nenhuma aba fica marcada. */
    var secoes = abas.map(function (aba) {
      return document.querySelector(aba.getAttribute("href"));
    });

    function conferirSecao() {
      var linha = window.innerHeight * 0.45;
      var achou = -1;
      for (var i = 0; i < secoes.length; i++) {
        if (!secoes[i]) continue;
        var r = secoes[i].getBoundingClientRect();
        if (r.top <= linha && r.bottom > linha) { achou = i; break; }
      }
      definirAtiva(achou, achou >= 0);
    }

    /* o navegador já limita o evento de scroll a um por quadro */
    window.addEventListener("scroll", conferirSecao, { passive: true });
    window.addEventListener("resize", conferirSecao);
    conferirSecao();
  }

  function iniciar() {
    montarAbas();

    var mm = gsap.matchMedia();

    /* =============================================================
       prefers-reduced-motion: nada se move, tudo visível.
       ============================================================= */
    mm.add("(prefers-reduced-motion: reduce)", function () {
      gsap.set(HERO_ITENS, { autoAlpha: 1, clearProps: "transform" });
      gsap.set("#hero [data-linha-stats]", { borderTopColor: "rgba(255,255,255,0.28)" });
    });

    /* =============================================================
       Movimento normal
       ============================================================= */
    mm.add("(prefers-reduced-motion: no-preference)", function () {

      /* ---------- HERO: entrada ---------- */
      var tlHero = gsap.timeline({ defaults: { ease: "power3.out" } });

      tlHero
        .from("#hero [data-fundo]", {
          scale: 1.08,
          duration: 2.2,
          ease: "power2.out"
        }, 0)
        .from("header[data-modo] > div", {
          y: -24,
          autoAlpha: 0,
          duration: 1,
          ease: "power2.out"
        }, 0.15)
        .to("#hero h1[data-glass]", {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          startAt: { y: 46 }
        }, 0.35)
        .to("#hero [data-linha2]", {
          autoAlpha: 1,
          y: 0,
          skewY: 0,
          duration: 1.3,
          startAt: { y: 52, skewY: 3 }
        }, 0.58)
        .to("#hero [data-split] p:not([data-linha2])", {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          startAt: { y: 26 }
        }, 0.9)
        .to("#hero [data-split] .btn", {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          startAt: { y: 20 }
        }, 1.02)
        .to("#hero [data-split] .btn + span", {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          startAt: { y: 20 }
        }, 1.12)
        .to("#hero [data-linha-stats]", {
          borderTopColor: "rgba(255,255,255,0.28)",
          duration: 1.1,
          ease: "power2.inOut"
        }, 1.15)
        .to("#hero [data-stat]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.09,
          startAt: { y: 16 }
        }, 1.3);

      /* ---------- HERO: saída em parallax ---------- */
      gsap.to("#hero [data-camada-texto]", {
        y: -70,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "60% top",
          scrub: 0.6
        }
      });

      gsap.to("#hero [data-base-hero]", {
        y: -40,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "25% top",
          end: "bottom top",
          scrub: 0.6
        }
      });

      /* ---------- Títulos de seção: palavras subindo por trás de máscara ---------- */
      q("section[id]:not(#hero) h2").forEach(function (h2) {
        SplitText.create(h2, {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit: function (self) {
            return gsap.from(self.words, {
              yPercent: 115,
              duration: 0.95,
              ease: "power3.out",
              stagger: 0.055,
              scrollTrigger: {
                trigger: h2,
                start: "top 88%",
                toggleActions: "play none none none"
              }
            });
          }
        });
      });

      /* ---------- Subtítulo logo abaixo de cada h2 ---------- */
      /* #quem-somos fica de fora: os parágrafos dele têm animação própria */
      q("section[id]:not(#hero):not(#quem-somos) h2 + p").forEach(function (p) {
        gsap.from(p, {
          y: 22,
          autoAlpha: 0,
          duration: 0.9,
          scrollTrigger: { trigger: p, start: "top 90%", toggleActions: "play none none none" }
        });
      });

      /* ---------- Serviços e Riscos: colunas em cascata ---------- */
      q("[data-cols3]").forEach(function (grid) {
        gsap.from(grid.children, {
          y: 44,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.13,
          scrollTrigger: { trigger: grid, start: "top 82%", toggleActions: "play none none none" }
        });
      });

      /* ---------- Etapas: número e texto entram separados ---------- */
      q("[data-etapa]").forEach(function (linha) {
        var tl = gsap.timeline({
          scrollTrigger: { trigger: linha, start: "top 88%", toggleActions: "play none none none" }
        });
        tl.from(linha, { scaleX: 0.985, autoAlpha: 0, duration: 0.7, transformOrigin: "left center" })
          .from(linha.querySelector("[data-etapa-n]"), { x: -18, autoAlpha: 0, duration: 0.7 }, 0.08)
          .from(linha.querySelector("[data-etapa-txt]"), { x: 26, autoAlpha: 0, duration: 0.8 }, 0.14);
      });

      /* ---------- Quem somos: retrato revela, texto acompanha ---------- */
      gsap.fromTo("#quem-somos figure",
        { clipPath: "inset(0% 0% 100% 0%)", y: 30 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: "#quem-somos", start: "top 78%", toggleActions: "play none none none" }
        }
      );

      gsap.from("#quem-somos figure img", {
        scale: 1.14,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: "#quem-somos", start: "top 78%", toggleActions: "play none none none" }
      });

      gsap.from("#quem-somos h2 ~ p", {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        scrollTrigger: { trigger: "#quem-somos", start: "top 72%", toggleActions: "play none none none" }
      });

      /* ---------- Mapa ---------- */
      gsap.fromTo("#atuacao iframe",
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: "#atuacao iframe", start: "top 85%", toggleActions: "play none none none" }
        }
      );

      gsap.from("#atuacao > div > p", {
        y: 18,
        autoAlpha: 0,
        duration: 0.8,
        scrollTrigger: { trigger: "#atuacao", start: "top 60%", toggleActions: "play none none none" }
      });

      /* ---------- Contato: fundo em parallax + título por palavras + botão ---------- */
      gsap.fromTo("#contato [data-fundo-contato]",
        { yPercent: -6, scale: 1.14 },
        {
          yPercent: 6,
          scale: 1.14,
          ease: "none",
          scrollTrigger: {
            trigger: "#contato",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      gsap.from("#contato .rainbow-cta, #contato [data-contato-nota]", {
        y: 24,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        scrollTrigger: { trigger: "#contato", start: "top 70%", toggleActions: "play none none none" }
      });

      /* ---------- CTA flutuante: pulso de notificação ---------- */
      var pulso = document.querySelector("[data-cta-pulso]");
      if (pulso) {
        gsap.set(pulso, { transformOrigin: "50% 50%" });
        gsap.fromTo(pulso,
          { scale: 1, autoAlpha: 0.7 },
          {
            scale: 1.75,
            autoAlpha: 0,
            duration: 1.8,
            ease: "power2.out",
            repeat: -1,
            repeatDelay: 1.2
          }
        );
      }

      var badge = document.querySelector("[data-cta-badge]");
      if (badge) {
        gsap.set(badge, { transformOrigin: "50% 50%" });
        gsap.to(badge, {
          scale: 1.18,
          duration: 0.75,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });
      }

      /* hover no círculo (elemento interno, para não brigar com o
         tween de entrada/saída que roda no <a>) */
      var circulo = document.querySelector("[data-cta-circulo]");
      if (circulo && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        var tCirc = gsap.to(circulo, { scale: 1.08, duration: 0.3, ease: "power2.out", paused: true });
        var linkCta = circulo.closest("a");
        linkCta.addEventListener("mouseenter", function () { tCirc.play(); });
        linkCta.addEventListener("mouseleave", function () { tCirc.reverse(); });
      }

      /* ---------- Rodapé ---------- */
      gsap.from("footer > div > *", {
        y: 26,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        scrollTrigger: { trigger: "footer", start: "top 92%", toggleActions: "play none none none" }
      });

      /* ---------- Micro-interação nos botões (só ponteiro fino) ---------- */
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        q(".btn").filter(function (b) { return !b.closest(".rainbow-cta"); }).forEach(function (btn) {
          var t = gsap.to(btn, {
            scale: 1.035,
            duration: 0.32,
            ease: "power2.out",
            paused: true
          });
          btn.addEventListener("mouseenter", function () { t.play(); });
          btn.addEventListener("mouseleave", function () { t.reverse(); });
        });
      }

      /* O retrato e o fundo do hero mudam a altura da página depois do
         primeiro paint, então as posições precisam ser recalculadas — mas nunca
         dentro deste setup: um refresh no meio da criação dos gatilhos corrompe
         a lista interna do ScrollTrigger. Daí o rAF e o evento "load".
         Pelo mesmo motivo nenhum gatilho aqui usa "once: true": ele chama
         kill() no próprio gatilho ao disparar, e um gatilho que se mata no
         meio da criação em lote quebrava o setup inteiro com
         "Cannot read properties of undefined (reading 'end')".
         toggleActions "play none none none" dá o mesmo efeito: toca uma vez
         ao entrar e nunca reverte. */
      requestAnimationFrame(function () { ScrollTrigger.refresh(); });
      window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    });
  }

  /* Rede de segurança: os itens do hero começam invisíveis (autoAlpha 0).
     Se qualquer coisa quebrar no setup, devolve tudo ao estado final em vez
     de deixar o hero em branco. */
  function iniciarProtegido() {
    try {
      iniciar();
    } catch (e) {
      gsap.set(HERO_ITENS, { autoAlpha: 1, clearProps: "transform" });
      gsap.set("#hero [data-linha-stats]", { borderTopColor: "rgba(255,255,255,0.28)" });
      if (window.console) console.error("[animations] falha no setup: " + ((e && e.stack) || e));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarProtegido);
  } else {
    iniciarProtegido();
  }

  /* -----------------------------------------------------------------
     CTA flutuante — o index.html expõe window.__ctaFlutuante para que
     a entrada/saída seja animada em vez de um display seco.
     ----------------------------------------------------------------- */
  window.__animarCtaFlutuante = function (el, mostrar) {
    if (SEM_MOVIMENTO || !window.gsap) {
      el.style.display = mostrar ? "block" : "none";
      return;
    }
    gsap.killTweensOf(el);
    if (mostrar) {
      el.style.display = "block";
      gsap.fromTo(el,
        { autoAlpha: 0, y: 18, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" }
      );
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        y: 14,
        scale: 0.94,
        duration: 0.3,
        ease: "power2.in",
        onComplete: function () { el.style.display = "none"; }
      });
    }
  };
})();
