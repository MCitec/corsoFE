# LipariBank Portal

Portale frontend bancario per consultare conti, saldo e movimenti. Il progetto usa Vite e TypeScript, con una build multi-page pronta per CI e deploy preview.

## Screenshot

La dashboard è stata verificata in viewport desktop e mobile da 375 px. Le schermate principali sono disponibili in locale avviando il progetto con `npm run dev` e aprendo `dashboard.html`.

- Dashboard desktop: `dashboard.html`
- Dashboard mobile: viewport da 375 px
- Movimenti: `transactions.html`
- Dettagli conto: `account.html`

## Tech Stack

- HTML5 semantico
- CSS3 e SCSS
- JavaScript ES2024
- TypeScript
- Vite
- GitHub Actions
- Lighthouse CI

## Come avviare

```bash
npm ci
npm run dev
```

Comandi disponibili:

```bash
npm run type-check
npm run lint
npm run build
npm run build:scss
```

Il comando `npm run api` non è incluso: il progetto usa dati mock locali e, quando `VITE_API_URL` è definita, può collegarsi a un'API compatibile.

## Struttura del progetto

```text
.
├── .github/workflows/ci.yml
├── account.html
├── dashboard.html
├── login.html
├── transactions.html
├── scss/
│   ├── _responsive.scss
│   ├── _variables.scss
│   └── main.scss
├── src/
│   ├── models/account.model.ts
│   ├── services/account.service.ts
│   ├── ui/dashboard.ui.ts
│   ├── main.ts
│   └── transactions.ts
├── .lighthouserc.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Qualità e CI

La pipeline GitHub Actions esegue:

1. TypeScript type-check ed ESLint.
2. Build Vite e upload dell'artifact `production-build`.
3. Lighthouse CI su dashboard, movimenti e conto.
4. Deploy preview Netlify solo per le pull request.

La cache npm usa `package-lock.json` tramite `actions/setup-node`. I token Netlify sono letti esclusivamente da `NETLIFY_AUTH_TOKEN` e `NETLIFY_SITE_ID` nei GitHub Secrets.

## Lighthouse Score

La configurazione in `.lighthouserc.json` impone un minimo di 80 su performance, accessibility, best practices e SEO. Audit Lighthouse CI eseguito il 17 settembre 2026 con Lighthouse 12.1.0:

| Pagina       | Performance | Accessibility | Best Practices | SEO |
| ------------ | ----------: | ------------: | -------------: | --: |
| Dashboard    |         100 |            89 |             96 | 100 |
| Movimenti    |         100 |            92 |             96 | 100 |
| Il mio conto |         100 |           100 |             96 | 100 |

Report completi: [dashboard](https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1789652331537-47630.report.html), [movimenti](https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1789652332444-50919.report.html), [conto](https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1789652333334-47569.report.html).

## Git workflow

La repository usa Conventional Commits, feature branch e pull request. Prima del push, verificare:

```bash
npm ci
npm run type-check
npm run lint
npm run build
```

Per il repository remoto previsto dall'esercizio:

```bash
git remote add origin https://github.com/TUO_USERNAME/liparibank-portal.git
git push -u origin main
```

`node_modules/`, `dist/`, `.env` e `css/main.css` sono esclusi dal versionamento secondo `.gitignore`.

La storia locale include i branch `feature/login-improvements`, `feature/account-page`, `feature/improved-styles`, `feature/dark-theme` e `feature/brand-colors`, oltre al merge commit che documenta la risoluzione del conflitto sui colori del tema.
