// ============================================================
//  CAMPAIGN APP — UI Logic
//  Depends on: templates.js (loaded first)
// ============================================================

let selectedReason = null;

// ---- INIT: render default email on page load ----
document.addEventListener('DOMContentLoaded', () => {
  updatePreview();
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

