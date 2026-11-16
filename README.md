# Glassmaxi Industry Experience

Site institucional da Glassmaxi Indústria: sete linhas de vidro em um visualizador 3D único, narrativa controlada pelo scroll, catálogo, portfólio e orçamento com envio para o WhatsApp oficial.

## Rodar

Requer Node.js 20 ou superior (desenvolvido em 22).

```bash
npm install
npm run sync:media   # opcional, com internet: baixa as oito fotos de obras de glassmaxi.com.br
npm run dev          # desenvolvimento em http://localhost:3000
npm run build        # gera o site estático em out/
npm run preview      # serve a pasta out/ em http://localhost:3000
```

O logotipo oficial já está no projeto, em `public/brand/`. `npm run sync:media` é opcional: traz as oito fotos de obras do site atual para a galeria. Depois de rodar, faça commit de `public/media/official/` e de `src/data/media.generated.json`.

## Testar

```bash
npm run build
npm test             # 88 testes Playwright contra out/
npm run test:shots   # só as capturas de tela (docs/screenshots)
```

Os testes usam o Chrome instalado. Para apontar outro executável: `PW_CHROME_PATH=/caminho/do/chrome npm test`.

## Subir no GitHub

O repositório já vem com o primeiro commit na branch `main`.

```bash
git remote add origin https://github.com/SEU-USUARIO/glassmaxi-site.git
git push -u origin main
```

Crie antes o repositório vazio em github.com/new (sem README, sem .gitignore). A cada push, o GitHub Actions roda checagem de tipos, build e os testes de páginas (`.github/workflows/ci.yml`).

## Deploy na Vercel

1. Em vercel.com/new, importe o repositório do GitHub.
2. A Vercel reconhece o Next.js sozinha. Não mude comando de build nem pasta de saída.
3. Em Environment Variables, informe `NEXT_PUBLIC_SITE_URL` com o domínio final (ex.: `https://glassmaxi.com.br`). As demais são opcionais.
4. Deploy. Cada push na `main` publica de novo; cada pull request ganha um endereço de prévia.
5. Em Settings → Domains, aponte `glassmaxi.com.br` quando o endereço de teste estiver aprovado.

## Configurar

Copie `.env.example` para `.env.local`. Todas as variáveis são opcionais:

| Variável | Para quê |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Domínio usado em metadados, sitemap e Open Graph |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4, carregado só após o aceite de cookies |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Verificação do Google Search Console |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Endpoint que recebe o orçamento em JSON (CRM ou automação) |
| `NEXT_PUBLIC_CAREERS_EMAIL` | E-mail que recebe currículos |

Nenhuma chave privada vai para o frontend.

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Contatos, endereço, horário, cronologia, certificação | `src/data/company.ts` |
| Uma linha de produto (composições, cores, textos, narrativa) | `src/data/families/<linha>.ts` |
| Cores de vidro | `src/data/colors.ts` |
| Processos, aplicações, carrossel, catálogo, obras, menu | `src/data/site.ts` |
| Artigos | `src/data/articles.ts` |
| Parâmetro do peso estimado (2,5 kg/m²/mm) | `src/lib/quote.ts` |
| Cores, tipografia, raios, sombras | `src/app/globals.css` (bloco de tokens) |
| Logotipo (azul, branco, símbolos) | `public/brand/` |
| Ícones do navegador | `src/app/icon.png`, `apple-icon.png`, `favicon.ico` |

Composições marcadas com `status: "demonstracao"` existem para o visualizador funcionar e precisam ser trocadas pelo catálogo técnico da Glassmaxi.

## Estrutura

```
src/
  app/                  páginas (App Router), sitemap e robots
  components/glass/     GlassViewer, GlassModel, GlassLayers, LayerDiagram, Controls, ScrollExperience
  components/site/      cabeçalho, rodapé, hero, carrossel, processos, simulador, formulários, catálogo
  components/quote/     QuoteBuilder (lista de peças + resumo)
  data/                 conteúdo e dados técnicos, separados dos componentes
  store/                estado central do produto e do orçamento (zustand)
  lib/                  cálculo do orçamento e posicionamento das camadas
tests/                  Playwright
docs/                   auditoria, relatório técnico, publicação e capturas de tela
```

Documentação: [`docs/RELATORIO-TECNICO.md`](docs/RELATORIO-TECNICO.md), [`docs/AUDITORIA.md`](docs/AUDITORIA.md), [`docs/PUBLICACAO.md`](docs/PUBLICACAO.md).
