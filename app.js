// ============================================================
//  CAMPAIGN APP — UI Logic
//  Depends on: templates.js (loaded first)
// ============================================================

let selectedReason = null;

// ---- INIT: render default email on page load ----
document.addEventListener('DOMContentLoaded', () => {
  // Check URL for language parameter
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  
  if (lang && (lang === 'ml' || lang === 'en')) {
    setLanguage(lang);
  } else {
    updatePreview();
  }
});

// ---- REASON CARD SELECTION ----
function selectReason(el) {
  const clicked = el.dataset.reason;

  // Toggle off if already selected
  if (selectedReason === clicked) {
    el.classList.remove('selected');
    selectedReason = null;
  } else {
    document.querySelectorAll('.reason-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedReason = clicked;
  }

  // Reset template so a new one is picked with updated context
  resetTemplate();
  updatePreview();
}

// ---- REFRESH TEMPLATE ----
function refreshTemplate() {
  resetTemplate();
  updatePreview();
}

// ---- BUILD & RENDER PREVIEW ----
function updatePreview() {
  const name     = document.getElementById('name').value.trim();
  const district = document.getElementById('district').value;

  const email = buildEmail(name, district, selectedReason);

  // Subject line
  document.getElementById('preview-subject').textContent = email.subject;

  // To field
  document.getElementById('preview-to').textContent = email.recipients;

  // Body
  document.getElementById('preview-body').textContent = email.body;

  // Template badge
  document.getElementById('template-label').textContent =
    `Template ${email.id} · ${email.label}`;
}

// ---- SEND EMAIL ----
function openMail() {
  const name     = document.getElementById('name').value.trim();
  const district = document.getElementById('district').value;
  const email    = buildEmail(name, district, selectedReason);

  const mailto = `mailto:${email.recipients}`
    + `?subject=${encodeURIComponent(email.subject)}`
    + `&body=${encodeURIComponent(email.body)}`;

  window.location.href = mailto;
  return false;
}

// ---- COPY EMAIL TEXT ----
function copyEmail() {
  const name     = document.getElementById('name').value.trim();
  const district = document.getElementById('district').value;
  const email    = buildEmail(name, district, selectedReason);

  const full = `To: ${email.recipients}\nSubject: ${email.subject}\n\n${email.body}`;

  navigator.clipboard.writeText(full).then(() => {
    const btn = document.querySelector('.btn-secondary');
    const original = btn.innerHTML;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
    setTimeout(() => { btn.innerHTML = original; }, 2500);
  }).catch(() => {
    alert('Copy failed. Please manually select the text in the preview box and copy it.');
  });
}
 
// ---- CUSTOM DROPDOWN LOGIC ----
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('district-trigger');
  const panel = document.getElementById('district-panel');
  const searchInput = document.getElementById('district-search');
  const optionsList = document.getElementById('district-options');
  const hiddenInput = document.getElementById('district');
  const noResults = document.getElementById('district-no-results');
  const optionItems = optionsList.querySelectorAll('.option-item');

  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShowing = panel.classList.contains('show');
    
    // Close all other dropdowns if any
    document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.remove('show'));
    document.querySelectorAll('.select-trigger').forEach(t => t.classList.remove('active'));

    if (!isShowing) {
      panel.classList.add('show');
      trigger.classList.add('active');
      searchInput.focus();
    }
  });

  // Search/Filter logic
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    let hasResults = false;

    optionItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(term)) {
        item.classList.remove('hidden');
        hasResults = true;
      } else {
        item.classList.add('hidden');
      }
    });

    noResults.style.display = hasResults ? 'none' : 'block';
  });

  // Selection logic
  optionItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = item.dataset.value;
      const text = item.textContent;

      // Update hidden input
      hiddenInput.value = value;
      
      // Update trigger UI
      trigger.querySelector('span').textContent = text;
      
      // Mark as selected
      optionItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      // Close panel
      panel.classList.remove('show');
      trigger.classList.remove('active');

      // Reset search
      searchInput.value = '';
      optionItems.forEach(i => i.classList.remove('hidden'));
      noResults.style.display = 'none';

      // Trigger app updates
      resetTemplate();
      updatePreview();
    });
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    panel.classList.remove('show');
    trigger.classList.remove('active');
  });

  // Prevent closing when clicking inside panel
  panel.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

// ---- TRANSLATIONS ----
const translations = {
  en: {
    "nav-brand": "Kerala Speaks",
    "nav-tag": "Citizens' Campaign · 2026",
    "title": "Make Your Voice Heard — VD Satheeshan for Kerala CM",
    "hero-eyebrow": "Kerala Assembly Election 2026",
    "hero-title": "Kerala deserves<br />a leader who<br /><em>listens.</em>",
    "hero-action-hint": "Tell the party high command: Kerala’s choice is clear.",
    "btn-send-email": "Send Email",
    "frame-caption": "Leadership through accountability",
    "form-label": "Your Voice",
    "form-title": "Write to the party high command.",
    "form-body": "Fill as much or as little as you like. A personalised email draft is prepared for you automatically — all you do is press send.",
    "optional-note": "All fields are optional",
    "label-name": "Your Name",
    "label-district": "Your District",
    "opt-label": "optional",
    "select-district": "Select district",
    "placeholder-name": "e.g. Anitha Krishnan",
    "placeholder-search": "Search district...",
    "dist-tvm": "Thiruvananthapuram",
    "dist-klm": "Kollam",
    "dist-pta": "Pathanamthitta",
    "dist-alp": "Alappuzha",
    "dist-ktm": "Kottayam",
    "dist-idk": "Idukki",
    "dist-ekm": "Ernakulam",
    "dist-tsr": "Thrissur",
    "dist-pkd": "Palakkad",
    "dist-mpm": "Malappuram",
    "dist-kkd": "Kozhikode",
    "dist-wyn": "Wayanad",
    "dist-knr": "Kannur",
    "dist-ksd": "Kasaragod",
    "no-districts": "No districts found",
    "reasons-label": "Why do you support Satheeshan?",
    "reasons-opt": "optional — shapes your email tone",
    "reason-1-title": "Accountability",
    "reason-1-body": "He held the LDF government to account every single session.",
    "reason-2-title": "Grassroots Strength",
    "reason-2-body": "He rebuilt Congress from the booth level across all 14 districts.",
    "reason-3-title": "Integrity",
    "reason-3-body": "He put his career on the line publicly — and delivered on that promise.",
    "reason-4-title": "People's Choice",
    "reason-4-body": "The mandate reflects his leadership. The people voted for him.",
    "preview-header": "Email Draft Preview",
    "auto-selected": "auto-selected",
    "label-to": "To:",
    "label-subject": "Subject:",
    "btn-send": "Sent Email",
    "btn-copy": "Copy Email Text",
    "send-note": "Clicking \"Send Email\" launches your device's email app with this draft pre-filled. Nothing is sent automatically — you review and send it yourself.",
    "disc-label": "Important Disclaimer",
    "disc-title": "Please read before sending",
    "disc-1-title": "No Data Collection",
    "disc-1-body": "This website does not collect, store, or transmit any information you enter. Your name and district are used solely to generate the email draft inside your browser. Nothing leaves your device until you choose to send the email yourself.",
    "disc-2-title": "Your Own Action",
    "disc-2-body": "Clicking \"Send Email\" opens your personal email application with a pre-filled draft. The email is sent only if you choose to send it, from your own inbox. We do not send anything on your behalf at any point.",
    "disc-3-title": "Independent Campaign",
    "disc-3-body": "This is an independent citizens' initiative. It is not affiliated with, endorsed by, or operated by the Indian National Congress, the UDF, or any political party or candidate. VD Satheeshan and his office have no association with this website.",
    "disc-4-title": "Voluntary Participation",
    "disc-4-body": "Participation is entirely voluntary. You may modify or discard the draft before sending. The templates represent general civic opinion and are not official statements. You are solely responsible for the content of any email you choose to send.",
    "disc-note": "By using this website, you acknowledge that you are voluntarily exercising your democratic right to communicate with political leaders. This website facilitates that communication and bears no responsibility for the content of emails sent by individual users. All opinions expressed are those of the individual sender.",
    "footer-main": "This is an independent citizens' campaign in support of <strong>VD Satheeshan</strong> as Kerala's next Chief Minister.",
    "footer-sub": "Not affiliated with INC, UDF, or any political party or candidate &nbsp;·&nbsp; No user data is collected or stored &nbsp;·&nbsp; All emails are sent by the user from their own device"
  },
  ml: {
    "nav-brand": "കേരളം സംസാരിക്കുന്നു",
    "nav-tag": "ജനകീയ ക്യാമ്പയിൻ · 2026",
    "title": "നിങ്ങളുടെ ശബ്ദം കേൾപ്പിക്കൂ — വി ഡി സതീശൻ കേരള മുഖ്യമന്ത്രിയാകാൻ",
    "hero-eyebrow": "കേരള നിയമസഭാ തെരഞ്ഞെടുപ്പ് 2026",
    "hero-title": "കേരളം അർഹിക്കുന്നു<br />ശ്രദ്ധിക്കുന്ന ഒരു<br /><em>നേതാവിനെ.</em>",
    "hero-action-hint": "ഹൈക്കമാൻഡിനോട് പറയൂ: കേരളത്തിന്റെ തീരുമാനം വ്യക്തമാണ്.",
    "btn-send-email": "ഇമെയിൽ അയക്കുക",
    "frame-caption": "ഉത്തരവാദിത്തത്തിലൂടെയുള്ള നേതൃത്വം",
    "form-label": "നിങ്ങളുടെ ശബ്ദം",
    "form-title": "ഹൈക്കമാൻഡിന് എഴുതുക.",
    "form-body": "നിങ്ങൾക്ക് താൽപ്പര്യമുള്ളത്ര വിവരങ്ങൾ പൂരിപ്പിക്കുക. നിങ്ങൾക്കായി ഒരു ഇമെയിൽ ഡ്രാഫ്റ്റ് സ്വയം തയ്യാറാക്കപ്പെടും — നിങ്ങൾ ചെയ്യേണ്ടത് 'അയക്കുക' എന്ന് അമർത്തുക മാത്രമാണ്.",
    "optional-note": "എല്ലാ വിവരങ്ങളും നിർബന്ധമില്ലാത്തവയാണ്",
    "label-name": "നിങ്ങളുടെ പേര്",
    "label-district": "നിങ്ങളുടെ ജില്ല",
    "opt-label": "നിർബന്ധമില്ല",
    "select-district": "ജില്ല തിരഞ്ഞെടുക്കുക",
    "placeholder-name": "ഉദാ: അനിത കൃഷ്ണൻ",
    "placeholder-search": "ജില്ല തിരയുക...",
    "dist-tvm": "തിരുവനന്തപുരം",
    "dist-klm": "കൊല്ലം",
    "dist-pta": "പത്തനംതിട്ട",
    "dist-alp": "ആലപ്പുഴ",
    "dist-ktm": "കോട്ടയം",
    "dist-idk": "ഇടുക്കി",
    "dist-ekm": "എറണാകുളം",
    "dist-tsr": "തൃശ്ശൂർ",
    "dist-pkd": "പാലക്കാട്",
    "dist-mpm": "മലപ്പുറം",
    "dist-kkd": "കോഴിക്കോട്",
    "dist-wyn": "വയനാട്",
    "dist-knr": "കണ്ണൂർ",
    "dist-ksd": "കാസർഗോഡ്",
    "no-districts": "ജില്ലകൾ കണ്ടെത്തിയില്ല",
    "reasons-label": "എന്തുകൊണ്ടാണ് നിങ്ങൾ സതീശനെ പിന്തുണയ്ക്കുന്നത്?",
    "reasons-opt": "നിർബന്ധമില്ല — ഇമെയിലിന്റെ സ്വഭാവം മാറ്റാൻ സഹായിക്കുന്നു",
    "reason-1-title": "ഉത്തരവാദിത്തം",
    "reason-1-body": "എല്ലാ നിയമസഭാ സമ്മേളനങ്ങളിലും അദ്ദേഹം എൽഡിഎഫ് സർക്കാരിനെ ചോദ്യം ചെയ്തു.",
    "reason-2-title": "അടിത്തട്ടിലെ കരുത്ത്",
    "reason-2-body": "14 ജില്ലകളിലും ബൂത്ത് തലം മുതൽ കോൺഗ്രസിനെ അദ്ദേഹം പുനർനിർമ്മിച്ചു.",
    "reason-3-title": "വിശ്വാസ്യത",
    "reason-3-body": "അദ്ദേഹം തന്റെ കരിയർ പണയപ്പെടുത്തിക്കൊണ്ട് ജനങ്ങൾക്ക് വേണ്ടി നിലകൊണ്ടു.",
    "reason-4-title": "ജനങ്ങളുടെ ചോയ്സ്",
    "reason-4-body": "ജനവിധി അദ്ദേഹത്തിന്റെ നേതൃത്വത്തെ പ്രതിഫലിപ്പിക്കുന്നു. ജനങ്ങൾ അദ്ദേഹത്തിന് വോട്ട് ചെയ്തു.",
    "preview-header": "ഇമെയിൽ ഡ്രാഫ്റ്റ് പ്രിവ്യൂ",
    "auto-selected": "സ്വയം തിരഞ്ഞെടുത്തത്",
    "label-to": "സ്വീകർത്താവ്:",
    "label-subject": "വിഷയം:",
    "btn-send": "ഇമെയിൽ അയക്കുക",
    "btn-copy": "ഇമെയിൽ കോപ്പി ചെയ്യുക",
    "send-note": "'ഇമെയിൽ അയക്കുക' അമർത്തുമ്പോൾ നിങ്ങളുടെ ഇമെയിൽ ആപ്പ് തുറക്കും. ഒന്നും സ്വയം അയക്കപ്പെടില്ല — നിങ്ങൾ പരിശോധിച്ച ശേഷം അയച്ചാൽ മതി.",
    "disc-label": "പ്രധാനപ്പെട്ട നിബന്ധനകൾ",
    "disc-title": "അയക്കുന്നതിന് മുമ്പ് ദയവായി വായിക്കുക",
    "disc-1-title": "വിവരങ്ങൾ ശേഖരിക്കുന്നില്ല",
    "disc-1-body": "ഈ വെബ്സൈറ്റ് നിങ്ങളുടെ വിവരങ്ങൾ ശേഖരിക്കുകയോ സൂക്ഷിക്കുകയോ ചെയ്യുന്നില്ല. നിങ്ങളുടെ പേരും ജില്ലയും ബ്രൗസറിനുള്ളിൽ ഇമെയിൽ തയ്യാറാക്കാൻ മാത്രമാണ് ഉപയോഗിക്കുന്നത്.",
    "disc-2-title": "നിങ്ങളുടെ സ്വന്തം പ്രവർത്തനം",
    "disc-2-body": "ഇമെയിൽ ഡ്രാഫ്റ്റ് പരിശോധിച്ച ശേഷം നിങ്ങളുടെ സ്വന്തം ഇൻബോക്സിൽ നിന്ന് നിങ്ങൾ തന്നെ അയക്കേണ്ടതാണ്. ഞങ്ങൾ നിങ്ങളുടെ പേരിൽ ഒന്നും അയക്കില്ല.",
    "disc-3-title": "സ്വതന്ത്ര ക്യാമ്പയിൻ",
    "disc-3-body": "ഇതൊരു സ്വതന്ത്ര ജനകീയ സംരംഭമാണ്. ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസുമായോ യുഡിഎഫുമായോ രാഷ്ട്രീയ പാർട്ടികളുമായോ ഇതിന് ഔദ്യോഗിക ബന്ധമില്ല.",
    "disc-4-title": "സ്വമേധയാ ഉള്ള പങ്കാളിത്തം",
    "disc-4-body": "പങ്കാളിത്തം പൂർണ്ണമായും സ്വമേധയാ ഉള്ളതാണ്. അയക്കുന്നതിന് മുമ്പ് നിങ്ങൾക്ക് ഡ്രാഫ്റ്റിൽ മാറ്റം വരുത്താം.",
    "disc-note": "ഈ വെബ്സൈറ്റ് ഉപയോഗിക്കുന്നതിലൂടെ, രാഷ്ട്രീയ നേതാക്കളുമായി ആശയവിനിമയം നടത്താനുള്ള നിങ്ങളുടെ ജനാധിപത്യപരമായ അവകാശം നിങ്ങൾ സ്വമേധയാ വിനിയോഗിക്കുകയാണെന്ന് നിങ്ങൾ അംഗീകരിക്കുന്നു.",
    "footer-main": "ഇതൊരു സ്വതന്ത്ര ജനകീയ ക്യാമ്പയിനാണ്.",
    "footer-sub": "ഏതെങ്കിലും രാഷ്ട്രീയ പാർട്ടിയുമായോ സ്ഥാനാർത്ഥിയുമായോ ബന്ധമില്ല · വിവരങ്ങൾ ശേഖരിക്കപ്പെടുന്നില്ല"
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update classes for buttons
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-ml').classList.toggle('active', lang === 'ml');

  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Update trigger text if a district is selected
  const hiddenDist = document.getElementById('district');
  const distTrigger = document.getElementById('district-trigger');
  const selectedDist = hiddenDist ? hiddenDist.value : null;

  if (selectedDist && distTrigger) {
    const optionItems = document.querySelectorAll('.option-item');
    const selectedOption = Array.from(optionItems).find(i => i.dataset.value === selectedDist);
    if (selectedOption) {
      const key = selectedOption.dataset.i18n;
      distTrigger.querySelector('span').textContent = translations[lang][key] || selectedOption.textContent;
    }
  }

  // Update browser title
  if (translations[lang]["title"]) {
    document.title = translations[lang]["title"];
  }

  // Update URL without refreshing
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);

  // Re-run updates that might be affected
  updatePreview();
}


