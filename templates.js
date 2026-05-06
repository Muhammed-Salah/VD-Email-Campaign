// ============================================================
//  CAMPAIGN EMAIL TEMPLATES
//  Each template is a function(name, district) => string
//  name and district may be empty strings if user skipped them
// ============================================================

const RECIPIENTS = 'office@rahulgandhi.in,connect@inc.in';
const SUBJECT    = 'Request: Appoint V.D. Satheeshan as Chief Minister of Kerala';

// ---- REASON PARAGRAPHS (injected based on card selection) ----
const REASON_PARAGRAPHS = {
  accountability: `Over the past five years, Satheeshan led the opposition in the Kerala Assembly with rare consistency — questioning every policy failure, pressing every minister on record, and doing so without theatrics. Kerala needs that same discipline in its Chief Minister.`,

  organisation: `What sets Satheeshan apart is what he did when Congress was at its lowest. He did not manage the decline — he reversed it. He rebuilt the party's presence district by district, booth by booth, and turned a demoralised organisation into one that just secured nearly 100 seats.`,

  integrity: `Satheeshan publicly staked his career on this election — promising to "quit politics and go into exile" if the UDF did not win 100 seats. The UDF won 98. That kind of personal accountability before the people is rare in Indian politics, and it is exactly what the Chief Minister's office demands.`,

  promise: `The UDF's decisive victory is inseparable from Satheeshan's leadership of the campaign. The mandate the people gave is a mandate for him. The Chief Minister's office should follow naturally from that.`
};

// ---- TEMPLATE DEFINITIONS ----
// Six templates. System picks one randomly, adjusted for name/district availability.

const TEMPLATES = [

  // TEMPLATE 1 — Formal, full identity
  {
    id: 1,
    label: 'Formal',
    build: (name, district, reasonKey) => {
      const from   = buildSender(name, district);
      const reason = REASON_PARAGRAPHS[reasonKey] || REASON_PARAGRAPHS_DEFAULT;
      return `Dear Rahul Gandhi Ji and INC Leadership,

I am writing to you as ${from}, and I wish to place on record my strong support for V.D. Satheeshan to be appointed as the next Chief Minister of Kerala.

${reason}

The UDF's victory after a decade in opposition is significant. Honouring it by choosing the leader who engineered that victory would send the right message — to Kerala and to the country.

I respectfully urge you to appoint V.D. Satheeshan as Kerala's Chief Minister. Kerala is watching, and I believe this is the right decision.

Thank you for your attention.

Warm regards,
${name || 'A concerned Keralite'}${district ? '\n' + district + ', Kerala' : '\nKerala'}`;
    }
  },

  // TEMPLATE 2 — Direct and concise
  {
    id: 2,
    label: 'Direct',
    build: (name, district, reasonKey) => {
      const from   = buildSender(name, district);
      const reason = REASON_PARAGRAPHS[reasonKey] || REASON_PARAGRAPHS_DEFAULT;
      return `Respected Rahul Gandhi Ji,

As ${from}, I am writing with a clear request: please appoint V.D. Satheeshan as the next Chief Minister of Kerala.

${reason}

The mandate is his. The party's future in Kerala depends on honouring it. I hope the high command will make the right call.

Regards,
${name || 'A Keralite'}${district ? '\n' + district + ', Kerala' : '\nKerala'}`;
    }
  },

  // TEMPLATE 3 — Emotional, people-first tone
  {
    id: 3,
    label: 'Heartfelt',
    build: (name, district, reasonKey) => {
      const from   = buildSender(name, district);
      const reason = REASON_PARAGRAPHS[reasonKey] || REASON_PARAGRAPHS_DEFAULT;
      return `Dear Rahul Gandhi Ji,

Kerala waited ten years for this moment. As ${from}, I want to make sure that the voices of ordinary people reach you before this decision is made.

We want V.D. Satheeshan as our Chief Minister.

${reason}

He earned this through years of hard work, not just weeks of campaigning. Please honour that by giving Kerala the leader it chose.

With hope and respect,
${name || 'A proud Keralite'}${district ? '\n' + district + ', Kerala' : '\nKerala'}`;
    }
  },

  // TEMPLATE 4 — Democratic argument focus
  {
    id: 4,
    label: 'Democratic Case',
    build: (name, district, reasonKey) => {
      const from   = buildSender(name, district);
      const reason = REASON_PARAGRAPHS[reasonKey] || REASON_PARAGRAPHS_DEFAULT;
      return `Dear Rahul Gandhi Ji,

I am writing as ${from} to share my view on the Chief Ministerial appointment for Kerala.

Democratic mandates carry weight only when they are honoured. V.D. Satheeshan led the UDF's campaign, delivered the results, and has the confidence of the people. Choosing someone else at this stage would raise serious questions about how the party values grassroots leadership and public trust.

${reason}

I urge you to let the people's mandate guide this decision. Appoint V.D. Satheeshan as Chief Minister.

Sincerely,
${name || 'A citizen of Kerala'}${district ? '\n' + district + ', Kerala' : '\nKerala'}`;
    }
  },

  // TEMPLATE 5 — Future-focused
  {
    id: 5,
    label: 'Forward-Looking',
    build: (name, district, reasonKey) => {
      const from   = buildSender(name, district);
      const reason = REASON_PARAGRAPHS[reasonKey] || REASON_PARAGRAPHS_DEFAULT;
      return `Dear Rahul Gandhi Ji,

As ${from}, I am writing ahead of one of the most important decisions Congress will make for Kerala — the choice of Chief Minister.

Kerala's challenges over the next five years — economic recovery, youth employment, and rebuilding public institutions — require a leader who has already proven he can organise, persist, and deliver.

${reason}

V.D. Satheeshan is that leader. I urge you to appoint him as Kerala's Chief Minister without delay.

With respect,
${name || 'A Keralite citizen'}${district ? '\n' + district + ', Kerala' : '\nKerala'}`;
    }
  },

  // TEMPLATE 6 — Brief and powerful (anonymous-friendly)
  {
    id: 6,
    label: 'Brief',
    build: (name, district, reasonKey) => {
      const from   = buildSender(name, district);
      const reason = REASON_PARAGRAPHS[reasonKey] || REASON_PARAGRAPHS_DEFAULT;
      return `Dear Rahul Gandhi Ji,

${reason}

V.D. Satheeshan led Kerala's opposition for five years with integrity and delivered the UDF's best result in a decade. He has the people's trust and the party's confidence on the ground.

As ${from}, I respectfully urge you to appoint him as Chief Minister of Kerala.

Regards,
${name || 'A Keralite'}${district ? '\n' + district + ', Kerala' : '\nKerala'}`;
    }
  }

];

// ---- DEFAULT REASON (when no card is selected) ----
const REASON_PARAGRAPHS_DEFAULT = `Satheeshan led the UDF's campaign with clarity and personal accountability. He rebuilt the Congress organisation across Kerala over five years in opposition, and the result — 98 seats for the UDF — is a direct reflection of that leadership.`;

// ---- HELPER: Build sender line ----
function buildSender(name, district) {
  if (name && district) return `${name}, a citizen from ${district}, Kerala`;
  if (name)             return `${name}, a citizen of Kerala`;
  if (district)         return `a citizen from ${district}, Kerala`;
  return `a citizen of Kerala`;
}

// ---- SELECTOR: Pick a template (random, consistent per session) ----
let _sessionTemplate = null;

function selectTemplate() {
  if (!_sessionTemplate) {
    const idx = Math.floor(Math.random() * TEMPLATES.length);
    _sessionTemplate = TEMPLATES[idx];
  }
  return _sessionTemplate;
}

function resetTemplate() {
  _sessionTemplate = null;
}

function buildEmail(name, district, reasonKey) {
  const tpl = selectTemplate();
  return {
    subject:    SUBJECT,
    recipients: RECIPIENTS,
    body:       tpl.build(name, district, reasonKey),
    label:      tpl.label,
    id:         tpl.id
  };
}
