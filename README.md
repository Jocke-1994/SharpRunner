# SharpRunner

Ett webbläsarbaserat arkadspel där du navigerar en karaktär längs dynamiskt genererade banor genom att tajma svängar i rätt ögonblick. För tidigt eller för sent – och du kraschar.

🎮 **Spela direkt:** https://jocke-1994.github.io/SharpRunner/

---

## Om spelet

SharpRunner innehåller ~95 nivåer fördelade på 8 svårighetsgrader, från nybörjarvänliga lätta banor till extremt krävande Brutal-banor. Varje svårighetsgrad har sin egen spelmekanik, visuella stil och färg.

| Svårighetsgrad | Banor | Hastighet | Särskilt |
|---|---|---|---|
| Easy | 15 | 180 px/s | Nybörjarvänlig |
| Medium | 15 | 400 px/s | |
| Obstacle | 15 | 420 px/s | Hoppmekanik – undvik hinder |
| Dynamic | 10 | 450 px/s | Mjuka kurvade banor |
| Mindflip | 10 | 500 px/s | Plötsliga 180°-svängar |
| Tricky | 10 | 420 px/s | Handgjorda mönster |
| Hard | 10 | 580 px/s | Inga guidecirklar |
| Brutal | 10 | 750 px/s | Extremsvår |

---

## Funktioner

- **Tutorial** – steg-för-steg-guide för nya spelare
- **Statistik** – win streak, bästa streak, dödsfall, per-nivå-historik
- **Anpassning** – 9 skinfärger, hastighetsglidare (50–150%), dimma (fog of war)
- **Ljud** – syntetiserade effekter via Web Audio API
- **Mobilstöd** – fungerar på pekskärmar
- **Tvåspråkigt** – svenska och engelska
- **Support** – inbyggt formulär för buggrapporter och feedback

---

## Teknikstack

| Teknik | Användning |
|---|---|
| JavaScript (Vanilla) | Spelmotor, fysik, rendering, ljud, statistik |
| HTML / CSS | Struktur och layout |
| Web Audio API | Syntetiserade ljudeffekter |
| Canvas API | Spelrendering med interpolation |
| localStorage | Spelardata, inställningar, statistik |
| C# / .NET | Projektinfrastruktur |

---

## Projektstruktur

```
SharpRunner/
├── index.html          # HTML-struktur
├── css/
│   └── style.css       # All CSS
├── js/
│   ├── constants.js    # Ikoner, texter, skins
│   ├── audio.js        # Ljud (Web Audio API)
│   ├── settings.js     # Inställningar och localStorage
│   ├── levels.js       # Bangenerering och nivåer
│   ├── particles.js    # Partikelsystem
│   ├── ui.js           # Menyer och skärmar
│   ├── game.js         # Spelflöde (start, fail, win)
│   ├── physics.js      # Fysik och kollision
│   ├── render.js       # Canvas-rendering
│   ├── main.js         # Game loop och event listeners
│   └── support.js      # Support-formulär
└── scripts/
    └── screenshot.js   # Automatiskt screenshot-verktyg
```

---

## Kom igång lokalt

```bash
git clone https://github.com/Jocke-1994/SharpRunner.git
cd SharpRunner
```

Öppna `index.html` i en modern webbläsare – inget byggsystem behövs.

---

## Bidra

1. Skapa en branch: `git checkout -b namn-på-feature`
2. Gör dina ändringar och committa
3. Pusha och skapa en Pull Request mot `main`

> `main` är skyddad – all kod måste gå via Pull Request.

---

---

# SharpRunner (English)

A browser-based arcade game where you navigate a character along dynamically generated tracks by timing your turns at the right moment. Too early or too late – and you crash.

🎮 **Play now:** https://jocke-1994.github.io/SharpRunner/

---

## About the Game

SharpRunner features ~95 levels across 8 difficulty tiers, from beginner-friendly Easy tracks to the extreme challenge of Brutal. Each difficulty has its own mechanics, visual style, and color.

| Difficulty | Levels | Speed | Special |
|---|---|---|---|
| Easy | 15 | 180 px/s | Beginner friendly |
| Medium | 15 | 400 px/s | |
| Obstacle | 15 | 420 px/s | Jump mechanic – avoid obstacles |
| Dynamic | 10 | 450 px/s | Smooth curved tracks |
| Mindflip | 10 | 500 px/s | Sudden 180° turns |
| Tricky | 10 | 420 px/s | Handcrafted patterns |
| Hard | 10 | 580 px/s | No guide circles |
| Brutal | 10 | 750 px/s | Extremely hard |

---

## Features

- **Tutorial** – step-by-step guide for new players
- **Statistics** – win streak, best streak, deaths, per-level history
- **Customization** – 9 skin colors, speed slider (50–150%), fog of war
- **Sound** – synthesized effects via Web Audio API
- **Mobile support** – works on touchscreens
- **Bilingual** – Swedish and English
- **Support** – built-in form for bug reports and feedback

---

## Getting Started

```bash
git clone https://github.com/Jocke-1994/SharpRunner.git
cd SharpRunner
```

Open `index.html` in a modern browser – no build system required.

---

## Contributing

1. Create a branch: `git checkout -b feature-name`
2. Make your changes and commit
3. Push and open a Pull Request against `main`

> `main` is protected – all code must go through a Pull Request.
