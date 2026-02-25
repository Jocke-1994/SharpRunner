// Supabase-konfiguration
// Den publika anon-nyckeln är avsedd att exponeras i klientkod – säkerheten hanteras av Row Level Security (RLS).
const SUPABASE_URL = 'DIN_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'DIN_SUPABASE_ANON_KEY';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentProfile = null;

// --- INIT ---

async function initAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
        currentUser = session.user;
        await onSignedIn();
    }
    updateAuthUI();

    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            currentUser = session.user;
            await onSignedIn();
            updateAuthUI();
            closeAuthModal();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            currentProfile = null;
            updateAuthUI();
        }
    });
}

async function onSignedIn() {
    await loadProfile();
    await syncSaveData();
}

// --- AUTH-ÅTGÄRDER ---

async function authSignUp(email, password, username) {
    const { data: existing } = await supabaseClient
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

    if (existing) throw new Error(i18n[currentLang].authErrUsernameTaken);

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
        const { error: profileError } = await supabaseClient
            .from('profiles')
            .insert({ id: data.user.id, username, display_name: username });
        if (profileError) throw profileError;
    }
}

async function authSignIn(email, password) {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw new Error(i18n[currentLang].authErrInvalid);
}

async function authSignInWithProvider(provider) {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.href }
    });
    if (error) throw error;
}

async function authSignOut() {
    await supabaseClient.auth.signOut();
}

// --- PROFIL ---

async function loadProfile() {
    if (!currentUser) return;
    const { data } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
    currentProfile = data;
}

// --- CLOUD SAVE ---

async function syncSaveData() {
    if (!currentUser) return;

    const { data: serverSave } = await supabaseClient
        .from('player_saves')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

    const localUpdated = localStorage.getItem('maze_save_updated');

    if (!serverSave) {
        await pushToCloud();
    } else if (localUpdated && new Date(localUpdated) > new Date(serverSave.updated_at)) {
        await pushToCloud();
    } else {
        if (serverSave.history) localStorage.setItem('maze_history_pro', JSON.stringify(serverSave.history));
        if (serverSave.arcade_stats) localStorage.setItem('maze_arcade', JSON.stringify(serverSave.arcade_stats));
        if (serverSave.settings) localStorage.setItem('maze_settings', JSON.stringify(serverSave.settings));
        gameSettings = JSON.parse(localStorage.getItem('maze_settings') || '{"skin":"#1d2bff","fog":false,"speed":1,"sound":true}');
        arcadeStats = JSON.parse(localStorage.getItem('maze_arcade') || '{"deaths":0,"streak":0,"bestStreak":0}');
    }
}

async function pushToCloud() {
    if (!currentUser) return;

    const history = JSON.parse(localStorage.getItem('maze_history_pro') || '{}');
    const arcade = JSON.parse(localStorage.getItem('maze_arcade') || '{"deaths":0,"streak":0,"bestStreak":0}');
    const settings = JSON.parse(localStorage.getItem('maze_settings') || '{}');
    const now = new Date().toISOString();

    await supabaseClient.from('player_saves').upsert({
        user_id: currentUser.id,
        history,
        arcade_stats: arcade,
        settings,
        updated_at: now
    });

    localStorage.setItem('maze_save_updated', now);
}

// --- UI ---

function openAuthModal(view) {
    document.getElementById('authModal').style.display = 'flex';
    if (currentUser) {
        showAuthView('account');
    } else {
        showAuthView(view || 'login');
    }
    showAuthMessage('');
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    showAuthMessage('');
}

function showAuthView(view) {
    ['login', 'register', 'account'].forEach(v => {
        document.getElementById('authView-' + v).classList.toggle('hidden', v !== view);
    });
    document.getElementById('authTabLogin').classList.toggle('active', view === 'login');
    document.getElementById('authTabRegister').classList.toggle('active', view === 'register');
    showAuthMessage('');
}

function updateAuthUI() {
    const btn = document.getElementById('authMenuBtn');
    if (!btn) return;
    if (currentUser && currentProfile) {
        btn.textContent = currentProfile.display_name || currentProfile.username;
        btn.removeAttribute('data-t');
    } else {
        btn.setAttribute('data-t', 'loginBtn');
        btn.textContent = i18n[currentLang].loginBtn;
    }
    const accountName = document.getElementById('authAccountName');
    if (accountName && currentProfile) {
        accountName.textContent = currentProfile.display_name || currentProfile.username;
    }
    updateTexts();
}

function showAuthMessage(msg, isError = true) {
    const el = document.getElementById('authMessage');
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    el.style.color = isError ? '#ff0044' : '#00c853';
}

// --- FORMULÄRHANTERING ---

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginSubmitBtn');
    if (!email || !password) return;

    btn.disabled = true;
    showAuthMessage('');
    try {
        await authSignIn(email, password);
    } catch (e) {
        showAuthMessage(e.message);
        btn.disabled = false;
    }
}

async function handleRegister() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const btn = document.getElementById('registerSubmitBtn');
    if (!username || !email || !password) return;

    btn.disabled = true;
    showAuthMessage('');
    try {
        await authSignUp(email, password, username);
        showAuthMessage(i18n[currentLang].authConfirmEmail, false);
        btn.disabled = false;
    } catch (e) {
        showAuthMessage(e.message || i18n[currentLang].authErrGeneric);
        btn.disabled = false;
    }
}

async function handleSignOut() {
    await authSignOut();
    closeAuthModal();
}
