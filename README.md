# Método VCM — Viviane Fraga

Landing page de captação (lista de espera) para o **Método VCM · "Vai Com Medo Mesmo"**, mentoria de posicionamento profissional feminino da Viviane Fraga.

Site estático de alto padrão (preto + ouro + rosé), com experiência visual nível *awwwards*: hero full-bleed, sequência cinematográfica das 7 Travas conectada ao scroll, animações e micro-interações.

## Stack
- HTML + CSS + JavaScript (sem build)
- [GSAP](https://gsap.com/) + ScrollTrigger e [Lenis](https://lenis.darkroom.engineering/) (auto-hospedados em `assets/js/vendor/`)
- Fontes: Fraunces + Hanken Grotesk (Google Fonts)

## Estrutura
```
index.html
assets/
  css/styles.css
  js/main.js
  js/vendor/        GSAP, ScrollTrigger, Lenis
  img/              retratos tratados (webp)
Materiais/          fotos originais (não vão para produção)
```

## Deploy (Vercel)
Projeto estático — sem etapa de build.
Ao importar o repositório no Vercel, defina **Root Directory = `Metodo VCM`**.
O `vercel.json` cuida de cache dos assets e cleanUrls.

## Formulário / Lista de espera
As respostas são coletadas em `assets/js/main.js`. A constante `FORM_ENDPOINT`
está vazia (modo demonstração — salva em `localStorage`). Para produção, cole a
URL do webhook (n8n) ou do Google Apps Script que grava na planilha.
