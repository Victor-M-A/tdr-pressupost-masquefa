# Anàlisi d'un pressupost públic — Masquefa

Web del Treball de Recerca **"Anàlisi d'un pressupost públic: en què es gasten
els diners i com es financen les administracions?"** (Víctor Molero Alonso,
Institut de Masquefa, 2025–2027).

La web confronta el pressupost municipal real de Masquefa (2024–2026) amb la
percepció ciutadana recollida a través d'una enquesta pròpia (141 respostes).

🔗 **Demo:** publica-la amb GitHub Pages (veure més avall).

## Estructura
/
├── index.html          # Pàgina única amb totes les seccions
├── css/
│   └── styles.css      # Tema fosc, sistema de disseny i responsive
├── js/
│   └── main.js         # Interacció, gràfics (Chart.js) i renderitzat de dades
└── data/
└── data.js          # Totes les dades del pressupost i de l'enquesta
## Contingut

- **El projecte** — context, municipi i objectius del treball.
- **Pressupost municipal** — ingressos i despeses per capítol (2024–2026),
  evolució del total i distribució percentual, amb selector d'any.
- **Àrees estratègiques** — Educació, Sanitat i Seguretat, amb les partides
  més rellevants de cada exercici.
- **Enquesta / veu ciutadana** — percepció vs. desig d'inversió, valoració de
  la relació impostos-serveis, nota de transparència, canal d'informació i
  temes destacats en les respostes obertes.
- **Comparativa** — encreuament directe entre percepció ciutadana i
  creixement pressupostari real per a les tres àrees on es disposa de
  totes dues dades.
- **Metodologia**.

## Actualitzar les dades

Totes les xifres viuen a `data/data.js`, en objectes JavaScript senzills
(`BUDGET`, `SURVEY`, `COMPARISON`, `MUNICIPI`). Per actualitzar un any nou
del pressupost o refer l'enquesta, només cal editar aquest fitxer — la resta
de la web (gràfics, targetes, llistes) es genera automàticament a partir
d'aquestes dades des de `js/main.js`.

## Publicar amb GitHub Pages

1. Puja aquests fitxers a la branca `main` del repositori (arrel del repo).
2. A GitHub → **Settings → Pages** → *Source*: `Deploy from a branch` →
   branca `main`, carpeta `/ (root)`.
3. La web quedarà publicada a `(https://github.com/Victor-M-A/tdr-pressupost-masquefa.git)`.

## Tecnologia

- HTML/CSS/JS estàtic, sense frameworks ni build step.
- [Chart.js](https://www.chartjs.org/) (via CDN) per als gràfics.
- Tipografies Fraunces (display), Work Sans (text) i IBM Plex Mono (xifres),
  via Google Fonts.
- 100% responsive: mòbil, tauleta i escriptori.

## Fonts de les dades

- Pressupostos municipals 2024–2026 cedits per l'Ajuntament de Masquefa.
- Enquesta d'opinió pròpia, difosa entre maig i juny de 2026 (n=141).

## Autoria

Víctor M.A. · tutora Yrina A. · Institut de Masquefa.
