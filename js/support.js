// --- SUPPORT LOGIK ---
(function () {
    const modal = document.getElementById('supportModal');
    const openBtn = document.getElementById('openSupportBtn');
    const closeBtn = document.getElementById('closeSupportBtn');
    const form = document.getElementById('supportForm');
    const statusMsg = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');

    openBtn.onclick = () => {
        modal.style.display = 'flex';
        statusMsg.style.display = 'none';
        form.style.display = 'flex';
        document.getElementById('ticketIdField').value = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
    };

    closeBtn.onclick = () => modal.style.display = 'none';

    form.onsubmit = async (e) => {
        e.preventDefault();
        submitBtn.innerText = i18n[currentLang].supportSending;
        submitBtn.disabled = true;

        const data = new FormData(form);
        const category = data.get('category');
        const subject = data.get('subject');
        data.set('subject', `${category} ${subject}`);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                form.style.display = 'none';
                statusMsg.innerText = i18n[currentLang].supportSuccess;
                statusMsg.style.display = 'block';
                statusMsg.style.background = "#064e3b";
                setTimeout(() => { modal.style.display = 'none'; submitBtn.innerText = i18n[currentLang].supportSubmitBtn; submitBtn.disabled = false; }, 2500);
            } else { throw new Error(); }
        } catch {
            statusMsg.innerText = i18n[currentLang].supportError;
            statusMsg.style.display = 'block';
            statusMsg.style.background = "#7f1d1d";
            submitBtn.innerText = i18n[currentLang].supportSubmitBtn;
            submitBtn.disabled = false;
        }
    };
})();
