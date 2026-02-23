# SharpRunner – CLAUDE.md

## Börja här (läs innan du gör något annat)

1. Läs [`DEVLOG.md`](DEVLOG.md) – visar vad som gjorts, av vem och vad som är nästa steg
2. Skapa alltid en ny branch innan du gör ändringar – `main` är skyddad
3. Alla ändringar går via Pull Request

---

## Vad är projektet?

SharpRunner är ett webbläsarbaserat arkadspel (~95 nivåer, 8 svårighetsgrader) där spelaren tajmar svängar längs dynamiskt genererade banor.

- **Live:** https://jocke-1994.github.io/SharpRunner/
- **Repo:** https://github.com/Jocke-1994/SharpRunner
- **Utvecklare:** Joakim Rehn (Jocke-1994), Bozhidar Ivanov (b1-loop)

---

## Filstruktur

```
SharpRunner/
├── index.html          # HTML-struktur
├── css/style.css       # All CSS
├── js/
│   ├── constants.js    # i18n, skins, failMessages
│   ├── audio.js        # Web Audio API
│   ├── settings.js     # gameSettings, localStorage, updateTexts()
│   ├── levels.js       # Bangenerering, tracks-array
│   ├── particles.js    # Partikelsystem
│   ├── ui.js           # Menyer, renderGrids, tutorial
│   ├── game.js         # Spelflöde: start, fail, win
│   ├── physics.js      # Fysik, kollision
│   ├── render.js       # Canvas-rendering
│   ├── main.js         # Game loop, event listeners
│   └── support.js      # Support-formulär (Formspree)
├── scripts/
│   └── screenshot.js   # Puppeteer screenshot-verktyg
├── .githooks/
│   └── post-commit     # Tar automatiska screenshots vid visuella commits
├── DEVLOG.md           # Delad utvecklingsdagbok ← läs denna
└── CLAUDE.md           # Denna fil
```

### JS-laddningsordning (kritisk)
`constants → audio → settings → levels → particles → ui → game → physics → render → main → support`

---

## i18n-systemet

Stödda språk: `sv` (standard), `en`. Byt med `setLanguage('en')`.

- `data-t="nyckel"` → `updateTexts()` sätter `textContent`
- `data-t-placeholder="nyckel"` → sätter `placeholder`-attributet
- Alla strängar ska finnas i `i18n.sv` och `i18n.en` i `js/constants.js`

---

## Git-workflow

```bash
git checkout -b namn-på-feature   # skapa branch
# gör ändringar...
git push origin namn-på-feature
gh pr create                      # skapa PR
gh pr merge --merge               # merge
```

`main` är skyddad – direct push blockerat för alla.

---

## Kom igång (ny utvecklare)

```bash
git clone https://github.com/Jocke-1994/SharpRunner.git
cd SharpRunner
npm install --prefix scripts          # screenshot-verktyget
git config core.hooksPath .githooks   # aktivera git-hook
```

Öppna `index.html` i webbläsaren – inget byggsystem behövs.

---

## Sessionsslut

Uppdatera `DEVLOG.md` med vad du gjort – datum, vad, viktiga beslut, nästa steg.
