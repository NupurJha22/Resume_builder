// Resume template renderers — each returns an HTML string for the resume preview/PDF

function formatDate(d) {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!y) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return m ? `${months[parseInt(m)-1]} ${y}` : y;
}

function contactItem(icon, value) {
  if (!value) return '';
  return `<span class="rt-contact-item">${icon} ${value}</span>`;
}

// === MODERN TEMPLATE ===
export function renderModern(data) {
  const p = data.personalInfo || {};
  const exp = data.experience || [];
  const edu = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const certs = data.certifications || [];

  const contacts = [
    contactItem('✉', p.email),
    contactItem('📞', p.phone),
    contactItem('📍', p.location),
    contactItem('🔗', p.linkedin),
    contactItem('💻', p.github),
    contactItem('🌐', p.website),
  ].filter(Boolean).join('');

  const expHTML = exp.filter(e => e.role || e.company).map(e => `
    <div class="rt-exp-item">
      <div class="rt-exp-header">
        <div>
          <div class="rt-exp-role">${e.role || ''}</div>
          <div class="rt-exp-company">${e.company || ''}</div>
        </div>
        <div class="rt-exp-date">${formatDate(e.startDate)} ${e.startDate ? '–' : ''} ${e.current ? 'Present' : formatDate(e.endDate)}</div>
      </div>
      ${e.description ? `<div class="rt-exp-desc">${e.description.replace(/\n/g, '<br>')}</div>` : ''}
    </div>`).join('');

  const eduHTML = edu.filter(e => e.institution || e.degree).map(e => `
    <div class="rt-edu-item">
      <div class="rt-exp-header">
        <div>
          <div class="rt-exp-role">${e.degree || ''}${e.field ? ` in ${e.field}` : ''}</div>
          <div class="rt-exp-company">${e.institution || ''}</div>
        </div>
        <div class="rt-exp-date">${formatDate(e.startDate)} ${e.startDate ? '–' : ''} ${formatDate(e.endDate)}</div>
      </div>
      ${e.gpa ? `<div class="rt-exp-desc">GPA: ${e.gpa}</div>` : ''}
    </div>`).join('');

  const skillsHTML = skills.filter(Boolean).map(s => `<span class="rt-skill-tag">${s}</span>`).join('');

  const projHTML = projects.filter(p => p.name).map(p => `
    <div class="rt-proj-item">
      <div class="rt-exp-role">${p.name}</div>
      ${p.technologies ? `<div class="rt-exp-company">${p.technologies}</div>` : ''}
      ${p.description ? `<div class="rt-exp-desc">${p.description}</div>` : ''}
      ${p.url ? `<div class="rt-exp-desc" style="color:#6c63ff;">${p.url}</div>` : ''}
    </div>`).join('');

  const certHTML = certs.filter(c => c.name).map(c => `
    <div class="rt-exp-item">
      <div class="rt-exp-role">${c.name}</div>
      <div class="rt-exp-company">${c.issuer || ''}${c.date ? ` · ${formatDate(c.date)}` : ''}</div>
    </div>`).join('');

  return `
    <div class="rt-modern">
      <div class="rt-header">
        <div class="rt-name">${p.fullName || 'Your Name'}</div>
        <div class="rt-headline">${p.location || ''}</div>
        <div class="rt-contact-row">${contacts}</div>
      </div>
      <div class="rt-body">
        <div class="rt-main">
          ${p.summary ? `<div class="rt-section-title">Professional Summary</div><div class="rt-summary">${p.summary}</div>` : ''}
          ${expHTML ? `<div class="rt-section-title">Work Experience</div>${expHTML}` : ''}
          ${projHTML ? `<div class="rt-section-title">Projects</div>${projHTML}` : ''}
          ${certHTML ? `<div class="rt-section-title">Certifications</div>${certHTML}` : ''}
        </div>
        <div class="rt-sidebar">
          ${skillsHTML ? `<div class="rt-section-title" style="color:#6c63ff;border-color:#6c63ff;">Skills</div><div>${skillsHTML}</div>` : ''}
          ${eduHTML ? `<div class="rt-section-title" style="color:#6c63ff;border-color:#6c63ff;">Education</div>${eduHTML}` : ''}
        </div>
      </div>
    </div>`;
}

// === CLASSIC TEMPLATE ===
export function renderClassic(data) {
  const p = data.personalInfo || {};
  const exp = data.experience || [];
  const edu = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const certs = data.certifications || [];

  const contacts = [p.email, p.phone, p.location, p.linkedin].filter(Boolean).join('  |  ');

  const expHTML = exp.filter(e => e.role || e.company).map(e => `
    <div class="rt-exp-item" style="margin-bottom:10px;">
      <div class="rt-exp-header">
        <div><span class="rt-exp-role">${e.role || ''}</span>, <span class="rt-exp-company">${e.company || ''}</span></div>
        <div class="rt-exp-date">${formatDate(e.startDate)} ${e.startDate ? '–' : ''} ${e.current ? 'Present' : formatDate(e.endDate)}</div>
      </div>
      ${e.description ? `<div class="rt-exp-desc">${e.description.replace(/\n/g,'<br>')}</div>` : ''}
    </div>`).join('');

  const eduHTML = edu.filter(e => e.institution || e.degree).map(e => `
    <div class="rt-exp-item" style="margin-bottom:8px;">
      <div class="rt-exp-header">
        <div><span class="rt-exp-role">${e.degree || ''}${e.field ? ` in ${e.field}` : ''}</span>, <span class="rt-exp-company">${e.institution || ''}</span></div>
        <div class="rt-exp-date">${formatDate(e.startDate)} ${e.startDate ? '–' : ''} ${formatDate(e.endDate)}</div>
      </div>
      ${e.gpa ? `<div class="rt-exp-desc">GPA: ${e.gpa}</div>` : ''}
    </div>`).join('');

  const skillsHTML = skills.filter(Boolean).map(s => `<span class="rt-skill-tag">${s}</span>`).join('');

  const projHTML = projects.filter(p => p.name).map(p => `
    <div style="margin-bottom:8px;">
      <span class="rt-exp-role">${p.name}</span>
      ${p.technologies ? ` — <span style="font-size:9px;color:#666;">${p.technologies}</span>` : ''}
      ${p.description ? `<div class="rt-exp-desc">${p.description}</div>` : ''}
    </div>`).join('');

  const certHTML = certs.filter(c => c.name).map(c => `
    <div style="margin-bottom:6px;font-size:9.5px;">
      <b>${c.name}</b>${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? `, ${formatDate(c.date)}` : ''}
    </div>`).join('');

  return `
    <div class="rt-classic">
      <div class="rt-name">${p.fullName || 'Your Name'}</div>
      <div class="rt-contact-row">${contacts}</div>
      ${p.summary ? `<div class="rt-section-title">Professional Summary</div><div style="font-size:9.5px;line-height:1.6;color:#333;">${p.summary}</div>` : ''}
      ${expHTML ? `<div class="rt-section-title">Experience</div>${expHTML}` : ''}
      ${eduHTML ? `<div class="rt-section-title">Education</div>${eduHTML}` : ''}
      ${skillsHTML ? `<div class="rt-section-title">Skills</div><div style="line-height:2;">${skillsHTML}</div>` : ''}
      ${projHTML ? `<div class="rt-section-title">Projects</div>${projHTML}` : ''}
      ${certHTML ? `<div class="rt-section-title">Certifications</div>${certHTML}` : ''}
    </div>`;
}

// === CREATIVE TEMPLATE ===
export function renderCreative(data) {
  const p = data.personalInfo || {};
  const exp = data.experience || [];
  const edu = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const certs = data.certifications || [];

  const initials = (p.fullName || 'U N').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const contactItems = [
    p.email ? `<div class="rt-contact-item">✉ ${p.email}</div>` : '',
    p.phone ? `<div class="rt-contact-item">📞 ${p.phone}</div>` : '',
    p.location ? `<div class="rt-contact-item">📍 ${p.location}</div>` : '',
    p.linkedin ? `<div class="rt-contact-item">🔗 ${p.linkedin}</div>` : '',
    p.github ? `<div class="rt-contact-item">💻 ${p.github}</div>` : '',
    p.website ? `<div class="rt-contact-item">🌐 ${p.website}</div>` : '',
  ].filter(Boolean).join('');

  const skillsHTML = skills.filter(Boolean).map(s => `<span class="rt-skill-tag">${s}</span>`).join(' ');

  const eduHTML = edu.filter(e => e.institution || e.degree).map(e => `
    <div style="margin-bottom:10px;font-size:8.5px;opacity:0.95;">
      <div style="font-weight:700;">${e.degree || ''}${e.field ? ` in ${e.field}` : ''}</div>
      <div style="opacity:0.8;">${e.institution || ''}</div>
      <div style="opacity:0.7;">${formatDate(e.startDate)} ${e.startDate ? '–' : ''} ${formatDate(e.endDate)}</div>
    </div>`).join('');

  const expHTML = exp.filter(e => e.role || e.company).map(e => `
    <div class="rt-exp-item">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div class="rt-exp-role">${e.role || ''}</div>
          <div class="rt-exp-company">${e.company || ''}</div>
        </div>
        <div class="rt-exp-date">${formatDate(e.startDate)} ${e.startDate ? '–' : ''} ${e.current ? 'Present' : formatDate(e.endDate)}</div>
      </div>
      ${e.description ? `<div class="rt-exp-desc">${e.description.replace(/\n/g,'<br>')}</div>` : ''}
    </div>`).join('');

  const projHTML = projects.filter(p => p.name).map(p => `
    <div class="rt-proj-item">
      <div class="rt-exp-role">${p.name}</div>
      ${p.technologies ? `<div class="rt-exp-company">${p.technologies}</div>` : ''}
      ${p.description ? `<div class="rt-exp-desc">${p.description}</div>` : ''}
    </div>`).join('');

  const certHTML = certs.filter(c => c.name).map(c => `
    <div style="margin-bottom:6px;">
      <div style="font-weight:700;font-size:9.5px;">${c.name}</div>
      ${c.issuer ? `<div style="font-size:8.5px;color:#777;">${c.issuer}${c.date ? ` · ${formatDate(c.date)}` : ''}</div>` : ''}
    </div>`).join('');

  return `
    <div class="rt-creative">
      <div class="rt-sidebar">
        <div class="rt-avatar">${initials}</div>
        <div class="rt-name">${p.fullName || 'Your Name'}</div>
        <div class="rt-headline">${p.location || ''}</div>
        ${contactItems ? `<div class="rt-sidebar-section-title">Contact</div>${contactItems}` : ''}
        ${skillsHTML ? `<div class="rt-sidebar-section-title">Skills</div><div>${skillsHTML}</div>` : ''}
        ${eduHTML ? `<div class="rt-sidebar-section-title">Education</div>${eduHTML}` : ''}
      </div>
      <div class="rt-main">
        ${p.summary ? `<div class="rt-section-title">About Me</div><div class="rt-summary">${p.summary}</div>` : ''}
        ${expHTML ? `<div class="rt-section-title">Experience</div>${expHTML}` : ''}
        ${projHTML ? `<div class="rt-section-title">Projects</div>${projHTML}` : ''}
        ${certHTML ? `<div class="rt-section-title">Certifications</div>${certHTML}` : ''}
      </div>
    </div>`;
}

export function renderTemplate(template, data) {
  switch (template) {
    case 'classic': return renderClassic(data);
    case 'creative': return renderCreative(data);
    default: return renderModern(data);
  }
}
