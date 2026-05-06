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
