// SVG paths for icons
const iconGithub = `<svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.1839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
const iconLinkedin = `<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
const iconStar = `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

const failMessages = {
    sv: {
        early: ["Var det där ens ett försök?", "Början är svårast...", "Oops!", "Redan slut?", "Seriöst?"],
        mid: ["Väggen vann.", "Ouch! Det där gjorde ont.", "En gång till?", "Reflexer som en... sten?", "Kämpa på!"],
        late: ["Så nära!", "Nästan där...", "Ge inte upp nu!", "Du fixar det nästa gång!", "Ajdå, på mållinjen!"],
        veryLate: ["SÅ NÄRA! Orättvist!", "Bara en sväng till...", "Du skojar?!", "NEEEEEJ!", "Den där sved."]
    },
    en: {
        early: ["Was that even an attempt?", "The beginning is hardest...", "Oops!", "Already over?", "Seriously?"],
        mid: ["The wall won.", "Ouch! That hurt.", "One more time?", "Reflexes like a... rock?", "Keep fighting!"],
        late: ["So close!", "Almost there...", "Don't give up now!", "You'll get it next time!", "Oh no, at the finish line!"],
        veryLate: ["SO CLOSE! Unfair!", "Just one more turn...", "You kidding me?!", "NOOOOO!", "That one stung."]
    }
};

function getFailMessage(progress) {
    const lang = currentLang === 'sv' ? 'sv' : 'en';
    let category = 'mid';
    if (progress < 20) category = 'early';
    else if (progress < 50) category = 'mid';
    else if (progress < 80) category = 'late';
    else category = 'veryLate';

    const msgs = failMessages[lang][category];
    return msgs[Math.floor(Math.random() * msgs.length)];
}

const i18n = {
    sv: {
        title: "SharpRunner", startBtn: "Starta Spelet", statsBtn: "Statistik", aboutBtn: "Om Oss", settingsBtn: "Inställningar",
        backMenu: "← MENY", diffEasy: "LÄTT", diffMed: "MEDEL", diffDyn: "DYNAMIC", diffMindflip: "MINDFLIP", diffTricky: "TRICKY", diffHard: "SVÅR", diffBrut: "BRUTAL",
        pause: "PAUS", pausedTitle: "PAUSAD", resumeBtn: "Återuppta", exitBtn: "Avsluta till Meny",
        back: "Tillbaka", hudTrack: "BANA", hudAttempts: "FÖRSÖK", hudDone: "KLART",
        aboutText: `...`,
        clickStart: "SPACE / KLICK FÖR ATT STARTA", scouting: "REKOGNOSCERAR BANA...", skipHint: "KLICKA FÖR ATT HOPPA ÖVER",
        crash: "CRASH!", tryAgainBtn: "FÖRSÖK IGEN (SPACE)",
        pb: "NYTT REKORD!", oldPb: "Gammalt", winTitle: "KLAR!", winBody: "Bana {id} avklarad!",
        winStats: "Klarade på {n} försök.", nextBtn: "NÄSTA BANA (SPACE)", statsCleared: "KLARADE: {c} / {t}",
        statsBest: "PB: {p}% | {a} försök", statsTime: "Tid: {t}s",
        tutBtn: "TUTORIAL", skipTut: "SKIPPA", tutStart: "TRYCK FÖR ATT STARTA", tutTurnNow: "TRYCK FÖR ATT SVÄNGA NU!",
        tutFailEarly: "TRYCKER DU FÖR TIDIGT SÅ KRASCHAR DU.", tutFailLate: "ÄR DU INTE TILLRÄCKLIGT SNABB ÅKER DU IN I VÄGGEN.",
        tutRealTry: "NU KÖR VI PÅ RIKTIGT! KLARA 3 SVÄNGAR.", tutWin: "GRATTIS! DU HAR KLARAT TUTORIALEN.",
        tutNextStep: "GÅ VIDARE", tutTryReal: "FÖRSÖK IGEN",
        skinTitle: "VÄLJ FÄRG", optionsTitle: "ALTERNATIV", fogLabel: "DIMMA (SVÅRT)", soundLabel: "LJUD PÅ", speedTitle: "SPELHASTIGHET",
        statStreak: "WIN STREAK", statBestStreak: "BÄSTA STREAK", statDeaths: "TOTAL DEATHS",
        resetBtn: "RENSA DATA", resetConfirm: "Är du säker? Allt rensas och sidan laddas om.",
        hudDoneLabel: "AVKLARAT", pbLabel: "REKORD",
        supportTitle: "SHARPRUNNER SUPPORT",
        supportInfo: "Använd detta formulär för att rapportera buggar, skicka feedback eller övriga frågor som rör spelet.",
        supportWarning: "⚠️ OBS: Ange aldrig lösenord eller känslig personlig information i beskrivningen.",
        supportLabelTitle: "Titel *",
        supportPlaceholderTitle: "Ange vad det gäller",
        supportLabelCategory: "Ärende *",
        supportOptBug: "Rapportera Bugg",
        supportOptFeedback: "Feedback / Förslag",
        supportOptOther: "Övrigt",
        supportLabelName: "Namn (Valfritt)",
        supportPlaceholderName: "Ditt namn",
        supportLabelEmail: "E-post (Valfritt)",
        supportPlaceholderEmail: "namn@exempel.se",
        supportEmailHint: "Fyll i om du vill ha möjlighet till återkoppling. Svar kan ej garanteras.",
        supportLabelDesc: "Beskrivning *",
        supportPlaceholderDesc: "Beskriv ditt ärende så detaljerat som möjligt...",
        supportSubmitBtn: "SKICKA RAPPORT",
        supportCancelBtn: "AVBRYT",
        supportSending: "SKICKAR...",
        supportSuccess: "✅ SKICKAT! VI ÅTERKOMMER.",
        supportError: "❌ FEL! FÖRSÖK IGEN."
    },
    en: {
        title: "SharpRunner", startBtn: "Start Game", statsBtn: "Statistics", aboutBtn: "About Us", settingsBtn: "Settings",
        backMenu: "← MENU", diffEasy: "EASY", diffMed: "MEDIUM", diffDyn: "DYNAMIC", diffMindflip: "MINDFLIP", diffTricky: "TRICKY", diffHard: "HARD", diffBrut: "BRUTAL",
        pause: "PAUSE", pausedTitle: "PAUSED", resumeBtn: "Resume", exitBtn: "Exit to Menu",
        back: "Back", hudTrack: "LEVEL", hudAttempts: "ATTEMPTS", hudDone: "DONE",
        aboutText: `...`,
        clickStart: "SPACE / CLICK TO START", scouting: "SCOUTING TRACK...", skipHint: "CLICK TO SKIP",
        crash: "CRASH!", tryAgainBtn: "TRY AGAIN (SPACE)",
        pb: "NEW RECORD!", oldPb: "Previous", winTitle: "CLEAR!", winBody: "Level {id} cleared!",
        winStats: "Cleared in {n} attempts.", nextBtn: "NEXT LEVEL (SPACE)", statsCleared: "CLEARED: {c} / {t}",
        statsBest: "PB: {p}% | {a} attempts", statsTime: "Time: {t}s",
        tutBtn: "TUTORIAL", skipTut: "SKIP", tutStart: "TAP TO START", tutTurnNow: "TAP TO TURN NOW!",
        tutFailEarly: "PRESSING TOO EARLY CAUSES A CRASH.", tutFailLate: "TOO SLOW MEANS HITTING THE WALL.",
        tutRealTry: "LET'S DO THIS! CLEAR 3 TURNS.", tutWin: "CONGRATS! TUTORIAL COMPLETED.",
        tutNextStep: "NEXT STEP", tutTryReal: "TRY AGAIN",
        skinTitle: "CHOOSE COLOR", optionsTitle: "OPTIONS", fogLabel: "FOG OF WAR (HARD)", soundLabel: "SOUND", speedTitle: "GAME SPEED",
        statStreak: "WIN STREAK", statBestStreak: "BEST STREAK", statDeaths: "TOTAL DEATHS",
        resetBtn: "RESET DATA", resetConfirm: "Are you sure? This will wipe progress and reload.",
        hudDoneLabel: "COMPLETED", pbLabel: "RECORD",
        supportTitle: "SHARPRUNNER SUPPORT",
        supportInfo: "Use this form to report bugs, send feedback, or ask questions about the game.",
        supportWarning: "⚠️ NOTE: Never include passwords or sensitive personal information.",
        supportLabelTitle: "Title *",
        supportPlaceholderTitle: "What is this about?",
        supportLabelCategory: "Category *",
        supportOptBug: "Report Bug",
        supportOptFeedback: "Feedback / Suggestion",
        supportOptOther: "Other",
        supportLabelName: "Name (Optional)",
        supportPlaceholderName: "Your name",
        supportLabelEmail: "Email (Optional)",
        supportPlaceholderEmail: "name@example.com",
        supportEmailHint: "Fill in if you'd like a response. Replies are not guaranteed.",
        supportLabelDesc: "Description *",
        supportPlaceholderDesc: "Describe your issue in as much detail as possible...",
        supportSubmitBtn: "SEND REPORT",
        supportCancelBtn: "CANCEL",
        supportSending: "SENDING...",
        supportSuccess: "✅ SENT! WE'LL GET BACK TO YOU.",
        supportError: "❌ ERROR! PLEASE TRY AGAIN."
    }
};

const commonFounders = `<div class="founder-section"><div class="founder-title">Grundarna / Founders</div><div class="founder-grid"><div class="founder-card"><span class="founder-name">Bozhidar Ivanov</span><span class="founder-role">Lead Developer</span><div class="social-row"><a href="https://github.com/b1-loop" target="_blank" class="social-btn gh">${iconGithub}</a><a href="https://www.linkedin.com/in/bozhidar-ivanov-48158637b/" target="_blank" class="social-btn li">${iconLinkedin}</a></div></div><div class="founder-card"><span class="founder-name">Joakim Rehn</span><span class="founder-role">Lead Designer</span><div class="social-row"><a href="https://github.com/Jocke-1994" target="_blank" class="social-btn gh">${iconGithub}</a><a href="https://www.linkedin.com/in/joakimr94/" target="_blank" class="social-btn li">${iconLinkedin}</a></div></div></div>`;
const wishBoxTrickySV = `<div class="wish-box" style="border-left-color: var(--tricky); background: rgba(0, 229, 255, 0.05);"><span class="wish-label" style="color: var(--tricky)">NEW: TRICKY "THE SWEET SPOT"</span><div class="wish-text" style="font-style: normal; font-size: 0.9rem;">Testa de nya <b>Tricky</b>-banorna! Breda vägar men kluriga vägval. Designade för flow och aha-upplevelser. Inte för lätt, inte för svårt.</div></div>`;
const wishBoxTrickyEN = `<div class="wish-box" style="border-left-color: var(--tricky); background: rgba(0, 229, 255, 0.05);"><span class="wish-label" style="color: var(--tricky)">NEW: TRICKY "THE SWEET SPOT"</span><div class="wish-text" style="font-style: normal; font-size: 0.9rem;">Try the new <b>Tricky</b> levels! Wide paths but complex decisions. Designed for flow. Not too easy, not too hard.</div></div>`;
const wishBoxQuoteSV = `<div class="wish-box"><span class="wish-label">En önskan från oss:</span><div class="wish-text">"Må era reflexer vara blixtsnabba och ert tålamod oändligt."</div></div>`;
const wishBoxQuoteEN = `<div class="wish-box"><span class="wish-label">A WISH FROM US:</span><div class="wish-text">"May your reflexes be lightning fast and your patience infinite."</div></div>`;
const instructionsSV = `<div class="controls-grid"><div class="control-row"><span class="control-label">Svänga</span><div class="control-keys"><div class="key-cap">SPACE</div><span class="control-or">ELLER</span><div class="key-cap">KLICK</div></div></div><div class="control-row"><span class="control-label">Hoppa över scout</span><div class="control-keys"><div class="key-cap">SPACE</div><span class="control-or">/</span><div class="key-cap">KLICK</div></div></div><div class="control-row"><span class="control-label">Pausa</span><div class="key-cap">P</div></div></div><div class="warning-text">OBS: Inga cirklar på SVÅR & BRUTAL!</div>`;
const instructionsEN = `<div class="controls-grid"><div class="control-row"><span class="control-label">Turn</span><div class="control-keys"><div class="key-cap">SPACE</div><span class="control-or">OR</span><div class="key-cap">CLICK</div></div></div><div class="control-row"><span class="control-label">Skip Scouting</span><div class="control-keys"><div class="key-cap">SPACE</div><span class="control-or">/</span><div class="key-cap">CLICK</div></div></div><div class="control-row"><span class="control-label">Pause</span><div class="key-cap">P</div></div></div><div class="warning-text">NOTE: No circles on HARD & BRUTAL!</div>`;

i18n.sv.aboutText = commonFounders + wishBoxTrickySV + wishBoxQuoteSV + instructionsSV;
i18n.en.aboutText = commonFounders + wishBoxTrickyEN + wishBoxQuoteEN + instructionsEN;

let currentLang = localStorage.getItem('maze_lang') || 'sv';
const skins = ["#1d2bff", "#ff0044", "#00c853", "#fecc00", "#d946ef", "#ffffff", "#00d2ff", "#ff8800", "#00e5ff"];
