# SharpRunner – Utvecklingsdagbok

Kronologisk logg över vad som gjorts, varför och vad som är nästa steg.
Uppdateras i slutet av varje arbetspass av den som jobbat.

---

## 2026-02-23 – Joakim (+ Claude Code)

### Vad gjordes
**Infrastruktur och kodkvalitet:**
- Delade upp `index.html` (2206 rader) i separata filer: `css/style.css` + 11 JS-filer under `js/` (PR #52)
- Verifierat att spelet fungerar identiskt efter uppdelningen
- Satte upp automatiskt screenshot-system med Puppeteer (PR #53)
  - `scripts/screenshot.js` läser commit-meddelande och tar rätt bana-screenshot
  - `.githooks/post-commit` triggar det automatiskt vid visuella commits
- Branch protection aktiverad på `main` – gäller alla inkl. ägaren
- GitHub project board gjort privat
- README omskriven från grunden – beskrev fortfarande det gamla C#-konsollspelet (PR #56)

**Buggfixar:**
- Support-modalen saknade helt i18n – visade alltid svenska oavsett språk (PR #57)
  - 22 nya nycklar i i18n (sv + en)
  - Ny `data-t-placeholder`-mekanism i `updateTexts()` för platshållartexter
- `"OK"` och `"MENY"/"MENU"` var hårdkodade i `game.js` (PR #58)

**Dokumentation:**
- `DEVLOG.md` skapad (denna fil) – delad dagbok för samarbete
- `CLAUDE.md` skapad som lokal Claude Code-referensdokumentation (gitignorerad)

### Viktiga beslut
- Inga externa bibliotek eller bundlers – plain `<script src="">` bevarar global scope
- `CLAUDE.md` gitignoreras (lokal) – `DEVLOG.md` delas via git
- Screenshots sparas lokalt i `screenshots/` (gitignorerat) som visuell tidslinje

### Nästa steg
- Se GitHub project board (#5) för planerade features
- Prio-issues: Weekly Track (#37), Ghost Replay (#39), Leaderboard (#47)
- Inför lansering: domän, hosting, PWA (se issue #34)

---

## 2026-02-17 – Joakim & Bozhidar

### Vad gjordes
- Support-funktion med Formspree-integration
- Spacebar-bugg fixad i support-formuläret
- Trafikanalys (Google Analytics) tillagt
- Namnbyte: "LabyrinthGame" → "SharpRunner"

---

## Tidigare (jan–feb 2026) – Joakim & Bozhidar

### Fas 1 – Grundläggande mekanik
- Tutorial med 6-fas steg-för-steg-guide
- ~95 banor implementerade över 8 svårighetsgrader
- Scouting-animation (kameran åker längs banan före start)

### Fas 2 – Visuell polering
- 9 skinfärger, dimma (fog of war), krascheffekter
- Konfetti-animation vid nivåkomplettering
- Spelarsvans och dödsmarkering (ghost X)

### Fas 3 – Gränssnitt
- Statistikmeny, Om-sektion, ljud-toggle
- Visuella tangentvisningar, pausskärm

### Fas 4 – Mobiloptimering
- Komplett mobilanpassning med touch-stöd
- Obstacle-läge med hoppmekanik

---

## Mall för nya inlägg

```
## ÅÅÅÅ-MM-DD – [Namn]

### Vad gjordes
-

### Viktiga beslut
-

### Nästa steg
-
```
