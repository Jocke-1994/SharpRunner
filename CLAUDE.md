# SharpRunner – CLAUDE.md

## Vad är projektet?

SharpRunner är ett webbläsarbaserat arkadspel där spelaren navigerar en karaktär längs dynamiskt genererade banor genom att tajma svängar och undvika väggar. Spelet innehåller ~95 nivåer fördelade på 8 svårighetsgrader, ett tutorialsystem, statistikspårning, ljud, mobilstöd och ett tvåspråkigt gränssnitt (svenska/engelska).

Projektet kombinerar en C#/.NET-kodbas med ett komplett webbgränssnitt i en enda `index.html`. Majoriteten av logiken (~99.8%) lever i JavaScript/HTML.

- **Live-version:** https://jocke-1994.github.io/SharpRunner/
- **Repo:** https://github.com/Jocke-1994/SharpRunner
- **Bidragsgivare:** Jocke-1994 (Joakim Rehn), b1-loop

---

## Teknikstack

| Teknik | Användning |
|--------|-----------|
| C# / .NET 6+ | Namespace `LabyrinthGame`, entry point (`Program.cs`) |
| HTML / CSS | Struktur, layout, animationer |
| JavaScript (Vanilla) | Spelmotor, fysik, rendering, input, ljud, statistik |
| SVG | Grafisk visualisering av banor och spelelement |
| Web Audio API | Syntetiserade ljudeffekter via oscillatorer |
| localStorage | Persistent lagring av spelardata, statistik och inställningar |
| Formspree | Support-formulär (endpoint: `f/mjgerdge`) |

---

## Spelmekanik

### Grundprincip
Spelaren följer ett fördefinierat spår och måste trycka på mellanslag/klicka för att svänga vid rätt tidpunkt. För tidigt eller för sent = krasch.

### Svårighetsgrader (8 st, ~95 nivåer totalt)

| Nivå | Banor | Hastighet | Bredd | Tidsfönster | Särskilt |
|------|-------|-----------|-------|-------------|----------|
| Easy | 15 | 180 px/s | 55 | 0.52 s | Nybörjarvänlig |
| Medium | 15 | 400 px/s | 32 | 0.40 s | |
| Obstacle | 15 | 420 px/s | 40 | 0.45 s | Hoppmekanik, cyber-block-hinder |
| Dynamic | 10 | 450 px/s | 28 | 0.35 s | Mjukt kurvade banor |
| Mindflip | 10 | 500 px/s | 25 | 0.30 s | Plötsliga 180°-svängar, kaotiska banor |
| Tricky | 10 | 420 px/s | 40 | 0.45 s | Handgjorda mönster med varierande bredd |
| Hard | 10 | 580 px/s | 22 | 0.25 s | Inga guidecirklar |
| Brutal | 10 | 750 px/s | 14 | 0.15 s | Extremsvår |

### Bangenereringsalgoritmer

- `generateComplexPath()` – Slumpmässiga kurviga banor
- `generateDynamicPath()` – Mjuka vinkelbaserade svängar, 12–15 segment
- `generateMindflipPath()` – Omvända riktningar, 90°-svängar, kaotisk beteende
- `generateTrickyPath()` – 10 handgjorda mönster med varierad bredd
- `generateObstaclePath()` – 5 biom-typer: basic, wave, stairway, chaos, double trouble – med gula cyber-block-hinder

### Fysik och rörelse

**Normala lägen:**
- Spelaren rör sig längs waypoint-segment med arktangent-riktningsberäkning
- Kollisionsdetektering: spelarens avstånd till banans mittlinje vs. `width`-parametern

**Obstacle-läge:**
- Snap-to-rail: spelaren låses till banans Y-position
- Hoppmekanik: `isJumping`-flagga, `jumpTime` (0–0.6 s båge)
- `getTrackYatX()` interpolerar exakt Y från banans X-koordinat
- Kollision med hinder sker bara när `!isJumping`

**Fysikkonstanter:**
- `dt = 1/144` (fast tidssteg, 144 FPS)
- Hastighetsmultiplikator: `gameSettings.speed` (0.5×–1.5×)
- Kamera-lerp: 8% per bildruta under spel, 1% vid vila
- Zoomövergång: 0.2 (scouting) → 1.0 (aktivt spel)

---

## Tutorialsystem

6 faser (0–5):
- Fas 0: Intro
- Fas 1: Första svängen vid waypoint
- Fas 2: För tidig-straff (forcerad krasch)
- Fas 3: Försök igen efter tidig krasch
- Fas 4: För sen-straff (forcerad krasch)
- Fas 5: Riktig 3-sväng-utmaning
- Fas 6: Vinstfirande

---

## Ljudsystem (AudioSfx)

Använder Web Audio API med `OscillatorNode`:

| Händelse | Vågform | Frekvens | Längd |
|----------|---------|----------|-------|
| Sväng | Sinusvåg | 400 Hz + (turnCombo × 20 Hz) | 0.1 s |
| Hopp | Triangelvåg | 150 → 600 Hz sweep | 0.1 s |
| Krasch | Sågtandsvåg | 120 → 40 Hz | 0.3 s |
| Vinst | Fyrkantsvåg | 300 → 600 Hz exponentiellt | 0.4 s |

Kan stängas av via `gameSettings.sound`.

---

## Partikelsystem

| Typ | Beteende | Livstid |
|-----|----------|---------|
| Konfetti | Skärm-rymd, gravitetspåverkad | 2 s |
| Explosion | Världsrymd, 40 partiklar per trigger, hastighetsnedgång 0.92×/bildruta | – |
| Chockvåg | Expanderande cirkelring, 0.03 alpha-nedgång/bildruta | – |

Triggers: vinstfirande, kraschar, svängtransitioner.

---

## UI-komponenter

**Huvudmeny:** Start, Tutorial, Stats, Inställningar, Om, Support

**HUD (under spel):**
- Bannummer (3-siffrigt)
- Försöksräknare
- Framgångsprocent + progress bar (botten)

**Bana-väljare:** Rutnät per svårighetsgrad med klarade/oklara kort

**Inställningar:**
- 9 skinfärger (cirkulär väljare)
- Hastighetsglidare (50%–150%)
- Växlar: Ljud, Dimma (fog of war)
- Återställ data-knapp

**Statistikskärm:**
- Nuvarande/bästa vinststreak
- Totala dödsfall
- Svårighetsgrad-uppdelning (klarade %)
- Per-nivå-historik (personbästa %, försök, tid)

**Pausskärm:** Återuppta, gå till meny

**Game Over-popup:** Kraschmeddelande, framgång, PB-status, försök igen/meny

**Kraschinskription (4 nivåer baserat på framgång):**
- < 20%: "Was that even an attempt?"
- 20–50%: "The wall won"
- 50–80%: "So close!"
- 80%+: "SOOO CLOSE! Unfair!"

---

## Lokalisering (i18n)

Stödda språk: Svenska (`sv`, standard), Engelska (`en`)

Översätts: spellägen, svårighetsgrader, kraschinskriptioner, statistik, knappar, menytexter.

---

## Färgschema

| Svårighetsgrad | Färg |
|----------------|------|
| Standard/Easy | `#1d2bff` (blå) |
| Brutal | `#ff0044` (röd) |
| Dynamic | `#d946ef` (magenta) |
| Mindflip | `#ff8800` (orange) |
| Tricky | `#00e5ff` (cyan) |
| Obstacle | `#facc15` (gul) |
| Success | `#00c853` (grön) |

---

## Persistens (localStorage)

| Nyckel | Innehåll |
|--------|----------|
| `maze_settings` | Skin, dimma, hastighet, ljud (JSON) |
| `maze_ghosts` | Dödsplatser per nivå-ID (JSON) |
| `maze_arcade` | Dödsfall, nuvarande streak, bästa streak (JSON) |
| `maze_history_pro` | Per-nivå: försök, bästa %, klarad-flagga, bästa tid (JSON) |
| `maze_lang` | Språkinställning |

---

## Projektstruktur (lokalt repo)

```
SharpRunner/
├── index.html              # HTML-struktur + <link>/<script>-taggar
├── css/
│   └── style.css           # All CSS (~1100 rader)
├── js/
│   ├── constants.js        # SVG-ikoner, i18n, failMessages, skins, currentLang
│   ├── audio.js            # AudioSfx-objektet (Web Audio API)
│   ├── settings.js         # gameSettings, localStorage-variabler, settings-funktioner
│   ├── levels.js           # Path-generatorer, diffSettings, tracks-array
│   ├── particles.js        # Partikelsystem (konfetti, explosion, shockwave)
│   ├── ui.js               # showScreen, renderGrids, renderStats, tutorial-UI
│   ├── game.js             # startTrack, initGame, fail, win, handleInput, togglePause
│   ├── physics.js          # getTrackYatX, updatePhysics
│   ├── render.js           # draw()
│   ├── main.js             # Spelstate-variabler, canvas/ctx, event listeners, game loop
│   └── support.js          # Support-modal IIFE (Formspree)
├── Program.cs              # C# entry point (namespace LabyrinthGame)
├── LabyrinthGame.csproj    # .NET-projektfil
├── LabyrinthGame.slnx      # .NET-lösningsfil
├── README.md               # Tvåspråkig dokumentation (sv/en)
└── CLAUDE.md               # Denna fil
```

### JS-laddningsordning (kritisk – global scope)
constants → audio → settings → levels → particles → ui → game → physics → render → main → support

---

## Track-datastruktur

```js
{
  id: "001",          // 3-siffrigt ID (string)
  num: 1,             // Globalt index
  difficulty: "easy",
  speed: 180,         // px/s
  width: 55,          // Banbredd
  timing: 0.52,       // Tillåtet tidsfönster för sväng (sekunder)
  pts: [{x, y}, ...], // Waypoints
  obstacles: [{x}]    // Endast Obstacle-läge
}
```

---

## Viktiga spelvariabler (JavaScript)

| Variabel | Beskrivning |
|----------|-------------|
| `currentTrack` | Aktiv nivå-objekt |
| `pState` | Spelarposition (x, y, prevX, prevY) |
| `player` | Hastighetsvektor, segmentindex, trail-array |
| `cam` | Kameraposition med interpolation |
| `alive`, `started`, `paused` | Spelstatus-flaggor |
| `attempts`, `currentProg` | Försöksräknare och framgångsprocent |
| `isTutorial`, `tutorialPhase` | Tutorial-läge med fas (0–5) |
| `isPreviewing`, `isJumping` | Scout-förhandsgranskning och hoppmekanik |
| `shake`, `flash` | Visuell feedback |

---

## Supportformulär

Integrerat med Formspree (`f/mjgerdge`). Fält: titel, kategori (bugg/feedback/annat), namn, e-post, beskrivning. Ticket-ID genereras automatiskt.

---

## Utvecklingshistorik (stängda PR:er, ~32 st)

**Fas 1 – Grundläggande mekanik (jan 2026):**
- Tutorial med steg-för-steg-guide
- 50 banor implementerade (15+15+10+10)
- Scout-skip för båda plattformar

**Fas 2 – Visuell polering (jan 2026):**
- 9 skinfärger, dimma (fog of war), krascheffekter
- Konfetti-animation vid nivåkomplettering
- Spelarsvans och dödsmarkeringsmekanik

**Fas 3 – Gränssnitt (jan–feb 2026):**
- Statistikmeny, Om-sektion, ljud-toggle
- Visuella tangentvisningar, mörk overlay för kontrast

**Fas 4 – Mobiloptimering (jan–feb 2026):**
- Komplett mobilanpassning
- Hopp-fokuserade banor, rutnätsbakgrund

**Fas 5 – Slutlig polering (feb 17, 2026):**
- Support-funktion, JavaScript-spacebar-buggfix, trafikanalysfunktioner
- Namnbyte från "LabyrinthGame" → "SharpRunner"

---

## Kommande uppdateringar (Project Board)

Projektsidan: https://github.com/users/Jocke-1994/projects/5

Boardet använder kolumnerna: **Brainstorming → Backlog → Ready → In progress → In review → Done**

Fält per uppgift: Priority (P0–P2), Size (XS–XL), Estimate, Start date, Target date

### Brainstorming (12)

| Issue | Titel | Beskrivning |
|-------|-------|-------------|
| #33 | Discord | Lägg till Discord-länk |
| #34 | Innan lansering | Domän, hosting, PWA, Play Store, SEO, GDPR, crosstester |
| #35 | Idéer att testa | Boosters-visning, experimentflik för beta-banor, Apex-bonus |
| #36 | Dashboard / Admin-panel | .NET Web API + databas. Feature flags, game balancing, level management, feedback-hubb |
| #37 | Weekly Track | Ny bana varje måndag, seed-baserad, alla spelar samma |
| #38 | Daglig utmaning | Ny bana varje dag, seed baserat på datum |
| #39 | Ghost Replay | Halvtransparent spöke av spelarens bästa körning |
| #40 | Delningsfunktion | Dela poäng/tid via länk eller bild på sociala medier |
| #41 | Achievements / Badges | Milstolpar: klara svårighetsgrader, streak, dödsfall, first try |
| #42 | Streak-kalender | Visuell kalender (likt GitHub contributions) för speldagar |
| #43 | Profilnamn | Visningsnamn för leaderboard och statistik |
| #44 | Volymreglage | Slider (0–100%) istället för av/på-knapp |
| #45 | Färgblindläge | Alternativt tillgängligt färgschema |
| #46 | Track-miniatyr | Liten förhandsbild av banans form i level select |
| #47 | Leaderboard | Global topplista per bana – kräver backend |
| #48 | Community-banor | Track editor + dela banor – kräver backend |

### Backlog / Ready / In progress / In review
Inga uppgifter just nu.

### Done
Fylls i automatiskt när issues stängs eller PRs mergas.

---

## Kom igång

### Förutsättningar
- .NET SDK 6.0 eller senare

### Kör C#-delen lokalt
```bash
git clone https://github.com/Jocke-1994/SharpRunner.git
cd LabyrinthGame
dotnet run
```

### Spela i webbläsaren
Öppna `index.html` direkt i en modern webbläsare, eller besök live-versionen: https://jocke-1994.github.io/SharpRunner/

---

## Kodkonventioner

- Spelmotorn är ren Vanilla JavaScript utan externa bibliotek
- All spellogik finns i `index.html`
- C#-koden följer OOP-principer med tydlig separation av ansvar
- SVG används för all spelgrafik (skalbar, resolution-oberoende)
- Commits och kommentarer skrivs på svenska
- Branches per feature, mergeas via Pull Requests
