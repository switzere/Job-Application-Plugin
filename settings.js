const PROFILE_KEY = 'autofillProfile';
const TOGGLES_KEY = 'siteToggles';
const TOGGLE_SITES = ['linkedin', 'indeed', 'workday', 'monster', 'glassdoor', 'lever', 'greenhouse', 'vector'];

function readProfileFromForm() {
  return {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    city: document.getElementById('city').value.trim(),
    linkedin: document.getElementById('linkedin').value.trim(),
    github: document.getElementById('github').value.trim(),
    portfolio: document.getElementById('portfolio').value.trim(),
    currentCompany: document.getElementById('currentCompany').value.trim(),
    headline: document.getElementById('headline').value.trim(),
    summary: document.getElementById('summary').value.trim()
  };
}

function writeProfileToForm(profile = {}) {
  document.getElementById('firstName').value = profile.firstName || '';
  document.getElementById('lastName').value = profile.lastName || '';
  document.getElementById('email').value = profile.email || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('city').value = profile.city || '';
  document.getElementById('linkedin').value = profile.linkedin || '';
  document.getElementById('github').value = profile.github || '';
  document.getElementById('portfolio').value = profile.portfolio || '';
  document.getElementById('currentCompany').value = profile.currentCompany || '';
  document.getElementById('headline').value = profile.headline || '';
  document.getElementById('summary').value = profile.summary || '';
}

function setStatus(message, isError = false) {
  const status = document.getElementById('settingsStatus');
  status.textContent = message;
  status.classList.toggle('error', Boolean(isError));
}

async function loadSettings() {
  const result = await chrome.storage.local.get([PROFILE_KEY, TOGGLES_KEY]);
  writeProfileToForm(result[PROFILE_KEY] || {});
  writeTogglesToForm(result[TOGGLES_KEY] || {});
}

async function saveSettings() {
  const profile = readProfileFromForm();
  await chrome.storage.local.set({ [PROFILE_KEY]: profile });
  setStatus('Settings saved.');
}

function readTogglesFromForm() {
  const toggles = {};
  TOGGLE_SITES.forEach(site => {
    toggles[site] = document.getElementById(`toggle-${site}`).checked;
  });
  return toggles;
}

function writeTogglesToForm(toggles = {}) {
  TOGGLE_SITES.forEach(site => {
    const el = document.getElementById(`toggle-${site}`);
    if (el) el.checked = toggles[site] !== false; // default true
  });
}

async function saveSiteToggles() {
  const toggles = readTogglesFromForm();
  await chrome.storage.local.set({ [TOGGLES_KEY]: toggles });
  const status = document.getElementById('toggleStatus');
  status.textContent = 'Saved.';
}

async function clearSettings() {
  await chrome.storage.local.remove([PROFILE_KEY]);
  writeProfileToForm({});
  setStatus('Settings cleared.');
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings().catch(() => setStatus('Could not load settings.', true));

  document.getElementById('saveSettings').addEventListener('click', () => {
    saveSettings().catch(() => setStatus('Could not save settings.', true));
  });

  document.getElementById('clearSettings').addEventListener('click', () => {
    clearSettings().catch(() => setStatus('Could not clear settings.', true));
  });

  document.getElementById('saveSiteToggles').addEventListener('click', () => {
    saveSiteToggles().catch(() => {
      const status = document.getElementById('toggleStatus');
      status.textContent = 'Could not save.';
    });
  });

  document.getElementById('backToGraphs').addEventListener('click', () => {
    //window.open('page.html', '_blank');
    window.location.replace('page.html');
  });
});
