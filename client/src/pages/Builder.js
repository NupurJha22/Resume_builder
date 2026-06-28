import { api } from '../api.js';
import { renderTemplate } from '../templates/templates.js';
import { showToast, showLoading, hideLoading } from '../utils.js';

// Default empty resume state
function defaultResume() {
  return {
    resumeName: 'My Resume',
    template: 'modern',
    personalInfo: {
      fullName: '', email: '', phone: '', location: '',
      website: '', linkedin: '', github: '', summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };
}

const STEPS = [
  { id: 'personal', label: 'Personal' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'preview', label: 'Preview' },
];

export class BuilderPage {
  constructor(options = {}) {
    this.state = defaultResume();
    if (options.template) this.state.template = options.template;
    this.editId = options.editId || null;
    this.currentStep = 0;
    this.el = null;
  }

  async init(container) {
    this.el = container;

    if (this.editId) {
      showLoading('Loading resume…');
      try {
        const data = await api.getResume(this.editId);
        this.state = data;
      } catch (e) {
        showToast('Failed to load resume', 'error');
      } finally {
        hideLoading();
      }
    }

    this.render();
  }

  render() {
    this.el.innerHTML = this.getHTML();
    this.bindEvents();
    this.updatePreview();
  }

  getHTML() {
    return `
      <div class="page">
        <!-- Navbar -->
        <nav class="navbar">
          <div class="navbar-brand" onclick="window.router.navigate('home')" style="cursor:pointer;">
            <div class="navbar-logo">R</div>
            <span class="navbar-title">ResumeForge</span>
          </div>
          <div class="navbar-nav">
            <button class="nav-btn nav-btn-ghost" id="btn-my-resumes" onclick="window.router.navigate('my-resumes')">My Resumes</button>
            <button class="nav-btn nav-btn-primary" id="btn-save-nav" onclick="document.getElementById('btn-save').click()">💾 Save</button>
          </div>
        </nav>

        <!-- Builder Layout -->
        <div class="builder-layout">
          <!-- Form Panel -->
          <div class="builder-form-panel">
            <!-- Resume Name -->
            <div class="resume-name-bar">
              <span class="resume-name-icon">📄</span>
              <input type="text" id="resume-name" placeholder="Resume Name…" value="${this.state.resumeName}" />
            </div>

            <!-- Template Selector -->
            <div class="template-selector">
              ${['modern', 'classic', 'creative'].map(t => `
                <div class="template-option ${this.state.template === t ? 'active' : ''}" data-template="${t}" id="tpl-${t}">
                  <div class="template-option-preview tpo-${t}"></div>
                  <div class="template-option-name">${t.charAt(0).toUpperCase() + t.slice(1)}</div>
                </div>`).join('')}
            </div>

            <!-- Step Progress -->
            <div class="step-progress">
              ${STEPS.map((s, i) => `
                <div class="step-item">
                  <div class="step-circle ${i < this.currentStep ? 'done' : i === this.currentStep ? 'active' : ''}" data-step="${i}">
                    ${i < this.currentStep ? '✓' : i + 1}
                  </div>
                  <span class="step-label ${i < this.currentStep ? 'done' : i === this.currentStep ? 'active' : ''}">${s.label}</span>
                </div>
                ${i < STEPS.length - 1 ? `<div class="step-connector ${i < this.currentStep ? 'done' : ''}"></div>` : ''}`).join('')}
            </div>

            <!-- Step Content -->
            <div id="step-content">
              ${this.getStepHTML()}
            </div>
          </div>

          <!-- Preview Panel -->
          <div class="builder-preview-panel">
            <div class="preview-toolbar">
              <div class="preview-toolbar-title">👁 Live Preview</div>
              <div style="display:flex;gap:0.5rem;">
                <button class="btn btn-sm btn-secondary" id="btn-save">💾 Save to DB</button>
                <button class="btn btn-sm btn-success" id="btn-download">⬇ Download PDF</button>
              </div>
            </div>
            <div class="preview-scale-wrapper">
              <div class="preview-frame" id="resume-preview-frame">
                <!-- Resume rendered here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getStepHTML() {
    const s = this.state;
    switch (STEPS[this.currentStep].id) {
      case 'personal': return this.renderPersonalStep();
      case 'experience': return this.renderExperienceStep();
      case 'education': return this.renderEducationStep();
      case 'skills': return this.renderSkillsStep();
      case 'projects': return this.renderProjectsStep();
      case 'preview': return this.renderPreviewStep();
      default: return '';
    }
  }

  renderPersonalStep() {
    const p = this.state.personalInfo;
    return `
      <div>
        <div class="form-section-title">Personal Information</div>
        <div class="form-section-desc">Your basic details — name, contact, and professional summary.</div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="pi-fullName" placeholder="John Doe" value="${p.fullName}" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="pi-email" placeholder="john@example.com" value="${p.email}" />
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" class="form-input" id="pi-phone" placeholder="+1 (555) 000-0000" value="${p.phone}" />
          </div>
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input" id="pi-location" placeholder="New York, NY" value="${p.location}" />
          </div>
          <div class="form-group">
            <label class="form-label">LinkedIn</label>
            <input type="text" class="form-input" id="pi-linkedin" placeholder="linkedin.com/in/johndoe" value="${p.linkedin}" />
          </div>
          <div class="form-group">
            <label class="form-label">GitHub</label>
            <input type="text" class="form-input" id="pi-github" placeholder="github.com/johndoe" value="${p.github}" />
          </div>
          <div class="form-group">
            <label class="form-label">Website / Portfolio</label>
            <input type="text" class="form-input" id="pi-website" placeholder="johndoe.dev" value="${p.website}" />
          </div>
          <div class="form-group form-grid-1">
            <label class="form-label">Professional Summary</label>
            <textarea class="form-textarea" id="pi-summary" placeholder="Write a brief 2–3 sentence summary highlighting your experience, skills, and career goals…" style="min-height:120px;">${p.summary}</textarea>
          </div>
        </div>
        ${this.navButtons()}
      </div>`;
  }

  renderExperienceStep() {
    const exp = this.state.experience;
    return `
      <div>
        <div class="form-section-title">Work Experience</div>
        <div class="form-section-desc">Add your work history, starting with the most recent position.</div>
        <div class="sub-items" id="experience-list">
          ${exp.map((e, i) => this.renderExpItem(e, i)).join('')}
        </div>
        <button class="btn btn-secondary w-full" id="add-exp" style="justify-content:center;">+ Add Experience</button>
        ${this.navButtons()}
      </div>`;
  }

  renderExpItem(e, i) {
    return `
      <div class="sub-item" data-index="${i}">
        <div class="sub-item-header">
          <div class="sub-item-title">Experience ${i + 1}</div>
          <button class="sub-item-remove" data-remove-exp="${i}" title="Remove">✕</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Job Title</label>
            <input type="text" class="form-input" data-exp="${i}" data-field="role" value="${e.role}" placeholder="Software Engineer" />
          </div>
          <div class="form-group">
            <label class="form-label">Company</label>
            <input type="text" class="form-input" data-exp="${i}" data-field="company" value="${e.company}" placeholder="Acme Corp" />
          </div>
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input type="month" class="form-input" data-exp="${i}" data-field="startDate" value="${e.startDate}" />
          </div>
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input type="month" class="form-input" data-exp="${i}" data-field="endDate" value="${e.endDate}" ${e.current ? 'disabled' : ''} />
            <div class="checkbox-row">
              <input type="checkbox" id="exp-current-${i}" data-exp="${i}" data-field="current" ${e.current ? 'checked' : ''} />
              <label for="exp-current-${i}">Currently working here</label>
            </div>
          </div>
          <div class="form-group form-grid-1">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" data-exp="${i}" data-field="description" placeholder="• Led development of…&#10;• Improved performance by…">${e.description}</textarea>
          </div>
        </div>
      </div>`;
  }

  renderEducationStep() {
    const edu = this.state.education;
    return `
      <div>
        <div class="form-section-title">Education</div>
        <div class="form-section-desc">Add your educational background.</div>
        <div class="sub-items" id="education-list">
          ${edu.map((e, i) => this.renderEduItem(e, i)).join('')}
        </div>
        <button class="btn btn-secondary w-full" id="add-edu" style="justify-content:center;">+ Add Education</button>
        ${this.navButtons()}
      </div>`;
  }

  renderEduItem(e, i) {
    return `
      <div class="sub-item" data-index="${i}">
        <div class="sub-item-header">
          <div class="sub-item-title">Education ${i + 1}</div>
          <button class="sub-item-remove" data-remove-edu="${i}" title="Remove">✕</button>
        </div>
        <div class="form-grid">
          <div class="form-group form-grid-1">
            <label class="form-label">Institution</label>
            <input type="text" class="form-input" data-edu="${i}" data-field="institution" value="${e.institution}" placeholder="Stanford University" />
          </div>
          <div class="form-group">
            <label class="form-label">Degree</label>
            <input type="text" class="form-input" data-edu="${i}" data-field="degree" value="${e.degree}" placeholder="Bachelor of Science" />
          </div>
          <div class="form-group">
            <label class="form-label">Field of Study</label>
            <input type="text" class="form-input" data-edu="${i}" data-field="field" value="${e.field}" placeholder="Computer Science" />
          </div>
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input type="month" class="form-input" data-edu="${i}" data-field="startDate" value="${e.startDate}" />
          </div>
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input type="month" class="form-input" data-edu="${i}" data-field="endDate" value="${e.endDate}" />
          </div>
          <div class="form-group">
            <label class="form-label">GPA (optional)</label>
            <input type="text" class="form-input" data-edu="${i}" data-field="gpa" value="${e.gpa}" placeholder="3.8" />
          </div>
        </div>
      </div>`;
  }

  renderSkillsStep() {
    return `
      <div>
        <div class="form-section-title">Skills</div>
        <div class="form-section-desc">Add your technical and professional skills. Press Enter or click Add to insert a skill.</div>

        <div class="skills-container" id="skills-container">
          ${this.state.skills.filter(Boolean).map(s => `
            <span class="skill-tag">
              ${s}
              <button class="skill-tag-remove" data-skill="${s}" title="Remove">✕</button>
            </span>`).join('')}
        </div>

        <div class="skill-input-row">
          <input type="text" class="form-input" id="skill-input" placeholder="e.g. React, Python, Figma…" />
          <button class="btn btn-secondary" id="add-skill" style="white-space:nowrap;">+ Add</button>
        </div>

        <div style="margin-top:1.5rem;">
          <div class="form-label" style="margin-bottom:0.75rem;">Common Skills (click to add)</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
            ${['JavaScript','TypeScript','React','Node.js','Python','Java','SQL','MongoDB','AWS','Docker','Git','Figma','CSS','HTML','REST APIs','GraphQL','Machine Learning','Data Analysis','Project Management','Communication'].map(s => `
              <span class="skill-tag" style="cursor:pointer;opacity:0.7;" data-quick-skill="${s}">${s}</span>`).join('')}
          </div>
        </div>

        ${this.navButtons()}
      </div>`;
  }

  renderProjectsStep() {
    const projects = this.state.projects;
    const certs = this.state.certifications;
    return `
      <div>
        <div class="form-section-title">Projects & Certifications</div>
        <div class="form-section-desc">Showcase your personal projects and professional certifications.</div>

        <div class="fw-600 mt-2" style="margin-bottom:0.75rem;">Projects</div>
        <div class="sub-items" id="projects-list">
          ${projects.map((p, i) => this.renderProjectItem(p, i)).join('')}
        </div>
        <button class="btn btn-secondary w-full" id="add-proj" style="justify-content:center;">+ Add Project</button>

        <div class="divider"></div>

        <div class="fw-600" style="margin-bottom:0.75rem;">Certifications</div>
        <div class="sub-items" id="certifications-list">
          ${certs.map((c, i) => this.renderCertItem(c, i)).join('')}
        </div>
        <button class="btn btn-secondary w-full" id="add-cert" style="justify-content:center;">+ Add Certification</button>

        ${this.navButtons()}
      </div>`;
  }

  renderProjectItem(p, i) {
    return `
      <div class="sub-item" data-index="${i}">
        <div class="sub-item-header">
          <div class="sub-item-title">Project ${i + 1}</div>
          <button class="sub-item-remove" data-remove-proj="${i}">✕</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Project Name</label>
            <input type="text" class="form-input" data-proj="${i}" data-field="name" value="${p.name}" placeholder="My Awesome App" />
          </div>
          <div class="form-group">
            <label class="form-label">Technologies Used</label>
            <input type="text" class="form-input" data-proj="${i}" data-field="technologies" value="${p.technologies}" placeholder="React, Node.js, MongoDB" />
          </div>
          <div class="form-group form-grid-1">
            <label class="form-label">URL</label>
            <input type="text" class="form-input" data-proj="${i}" data-field="url" value="${p.url}" placeholder="https://github.com/..." />
          </div>
          <div class="form-group form-grid-1">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" data-proj="${i}" data-field="description" placeholder="Brief description of the project and your contributions…">${p.description}</textarea>
          </div>
        </div>
      </div>`;
  }

  renderCertItem(c, i) {
    return `
      <div class="sub-item" data-index="${i}">
        <div class="sub-item-header">
          <div class="sub-item-title">Certification ${i + 1}</div>
          <button class="sub-item-remove" data-remove-cert="${i}">✕</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Certification Name</label>
            <input type="text" class="form-input" data-cert="${i}" data-field="name" value="${c.name}" placeholder="AWS Solutions Architect" />
          </div>
          <div class="form-group">
            <label class="form-label">Issuing Organization</label>
            <input type="text" class="form-input" data-cert="${i}" data-field="issuer" value="${c.issuer}" placeholder="Amazon Web Services" />
          </div>
          <div class="form-group">
            <label class="form-label">Date Obtained</label>
            <input type="month" class="form-input" data-cert="${i}" data-field="date" value="${c.date}" />
          </div>
          <div class="form-group">
            <label class="form-label">Credential URL</label>
            <input type="text" class="form-input" data-cert="${i}" data-field="url" value="${c.url}" placeholder="https://..." />
          </div>
        </div>
      </div>`;
  }

  renderPreviewStep() {
    return `
      <div>
        <div class="form-section-title">Your Resume is Ready! 🎉</div>
        <div class="form-section-desc">Review your resume on the right. When satisfied, save it to the database or download as PDF.</div>

        <div style="display:flex;flex-direction:column;gap:1rem;margin-top:1.5rem;">
          <button class="btn btn-primary" id="btn-save-final" style="justify-content:center;">
            💾 Save to Database
          </button>
          <button class="btn btn-success" id="btn-download-final" style="justify-content:center;">
            ⬇ Download PDF
          </button>
          <button class="btn btn-secondary" id="btn-new" onclick="window.router.navigate('builder')" style="justify-content:center;">
            ✨ Build New Resume
          </button>
          <button class="btn btn-secondary" onclick="window.router.navigate('my-resumes')" style="justify-content:center;">
            📁 View All Resumes
          </button>
        </div>

        ${this.navButtons(true)}
      </div>`;
  }

  navButtons(isLast = false) {
    const isFirst = this.currentStep === 0;
    return `
      <div class="form-nav">
        <button class="btn btn-secondary" id="btn-prev" ${isFirst ? 'disabled' : ''}>← Back</button>
        ${!isLast
          ? `<button class="btn btn-primary" id="btn-next">Next →</button>`
          : `<span></span>`
        }
      </div>`;
  }

  bindEvents() {
    // Resume name
    const nameInput = this.el.querySelector('#resume-name');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        this.state.resumeName = e.target.value;
      });
    }

    // Template selector
    this.el.querySelectorAll('.template-option').forEach(opt => {
      opt.addEventListener('click', () => {
        this.el.querySelectorAll('.template-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.state.template = opt.dataset.template;
        this.updatePreview();
      });
    });

    // Step circles click
    this.el.querySelectorAll('.step-circle[data-step]').forEach(el => {
      el.addEventListener('click', () => {
        const step = parseInt(el.dataset.step);
        this.collectCurrentStepData();
        this.currentStep = step;
        this.refreshStep();
      });
    });

    // Nav buttons
    const btnPrev = this.el.querySelector('#btn-prev');
    const btnNext = this.el.querySelector('#btn-next');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        this.collectCurrentStepData();
        this.currentStep = Math.max(0, this.currentStep - 1);
        this.refreshStep();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.collectCurrentStepData();
        this.currentStep = Math.min(STEPS.length - 1, this.currentStep + 1);
        this.refreshStep();
      });
    }

    // Save button
    const btnSave = this.el.querySelector('#btn-save');
    const btnSaveFinal = this.el.querySelector('#btn-save-final');
    [btnSave, btnSaveFinal].filter(Boolean).forEach(btn => {
      btn.addEventListener('click', () => this.saveResume());
    });

    // Download
    const btnDL = this.el.querySelector('#btn-download');
    const btnDLFinal = this.el.querySelector('#btn-download-final');
    [btnDL, btnDLFinal].filter(Boolean).forEach(btn => {
      btn.addEventListener('click', () => this.downloadPDF());
    });

    // Step-specific events
    this.bindStepEvents();
  }

  bindStepEvents() {
    const step = STEPS[this.currentStep].id;

    if (step === 'personal') {
      const fields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'github', 'website', 'summary'];
      fields.forEach(f => {
        const el = this.el.querySelector(`#pi-${f}`);
        if (el) {
          el.addEventListener('input', (e) => {
            this.state.personalInfo[f] = e.target.value;
            this.updatePreview();
          });
        }
      });
    }

    if (step === 'experience') {
      const addBtn = this.el.querySelector('#add-exp');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          this.collectCurrentStepData();
          this.state.experience.push({ company: '', role: '', startDate: '', endDate: '', current: false, description: '' });
          this.refreshStep();
        });
      }

      this.el.querySelectorAll('[data-remove-exp]').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.removeExp);
          this.state.experience.splice(i, 1);
          this.refreshStep();
        });
      });

      this.el.querySelectorAll('[data-exp]').forEach(input => {
        input.addEventListener('input', (e) => {
          const i = parseInt(e.target.dataset.exp);
          const field = e.target.dataset.field;
          if (field === 'current') {
            this.state.experience[i][field] = e.target.checked;
            const endInput = this.el.querySelector(`[data-exp="${i}"][data-field="endDate"]`);
            if (endInput) endInput.disabled = e.target.checked;
          } else {
            this.state.experience[i][field] = e.target.value;
          }
          this.updatePreview();
        });
        input.addEventListener('change', (e) => {
          const i = parseInt(e.target.dataset.exp);
          const field = e.target.dataset.field;
          if (field === 'current') {
            this.state.experience[i][field] = e.target.checked;
            const endInput = this.el.querySelector(`[data-exp="${i}"][data-field="endDate"]`);
            if (endInput) endInput.disabled = e.target.checked;
          } else {
            this.state.experience[i][field] = e.target.value;
          }
          this.updatePreview();
        });
      });
    }

    if (step === 'education') {
      const addBtn = this.el.querySelector('#add-edu');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          this.collectCurrentStepData();
          this.state.education.push({ institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' });
          this.refreshStep();
        });
      }

      this.el.querySelectorAll('[data-remove-edu]').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.removeEdu);
          this.state.education.splice(i, 1);
          this.refreshStep();
        });
      });

      this.el.querySelectorAll('[data-edu]').forEach(input => {
        input.addEventListener('input', (e) => {
          const i = parseInt(e.target.dataset.edu);
          const field = e.target.dataset.field;
          this.state.education[i][field] = e.target.value;
          this.updatePreview();
        });
        input.addEventListener('change', (e) => {
          const i = parseInt(e.target.dataset.edu);
          const field = e.target.dataset.field;
          this.state.education[i][field] = e.target.value;
          this.updatePreview();
        });
      });
    }

    if (step === 'skills') {
      const skillInput = this.el.querySelector('#skill-input');
      const addSkillBtn = this.el.querySelector('#add-skill');
      const container = this.el.querySelector('#skills-container');

      const addSkill = () => {
        const val = skillInput.value.trim();
        if (val && !this.state.skills.includes(val)) {
          this.state.skills.push(val);
          skillInput.value = '';
          this.renderSkillTags();
          this.updatePreview();
        }
      };

      if (skillInput) {
        skillInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
        });
      }
      if (addSkillBtn) addSkillBtn.addEventListener('click', addSkill);

      this.el.querySelectorAll('[data-quick-skill]').forEach(tag => {
        tag.addEventListener('click', () => {
          const skill = tag.dataset.quickSkill;
          if (!this.state.skills.includes(skill)) {
            this.state.skills.push(skill);
            this.renderSkillTags();
            this.updatePreview();
          }
        });
      });

      this.bindSkillRemoveEvents();
    }

    if (step === 'projects') {
      // Projects
      const addProjBtn = this.el.querySelector('#add-proj');
      if (addProjBtn) {
        addProjBtn.addEventListener('click', () => {
          this.collectCurrentStepData();
          this.state.projects.push({ name: '', description: '', url: '', technologies: '' });
          this.refreshStep();
        });
      }

      this.el.querySelectorAll('[data-remove-proj]').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.removeProj);
          this.state.projects.splice(i, 1);
          this.refreshStep();
        });
      });

      this.el.querySelectorAll('[data-proj]').forEach(input => {
        input.addEventListener('input', (e) => {
          const i = parseInt(e.target.dataset.proj);
          const field = e.target.dataset.field;
          this.state.projects[i][field] = e.target.value;
          this.updatePreview();
        });
      });

      // Certifications
      const addCertBtn = this.el.querySelector('#add-cert');
      if (addCertBtn) {
        addCertBtn.addEventListener('click', () => {
          this.collectCurrentStepData();
          this.state.certifications.push({ name: '', issuer: '', date: '', url: '' });
          this.refreshStep();
        });
      }

      this.el.querySelectorAll('[data-remove-cert]').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.removeCert);
          this.state.certifications.splice(i, 1);
          this.refreshStep();
        });
      });

      this.el.querySelectorAll('[data-cert]').forEach(input => {
        input.addEventListener('input', (e) => {
          const i = parseInt(e.target.dataset.cert);
          const field = e.target.dataset.field;
          this.state.certifications[i][field] = e.target.value;
          this.updatePreview();
        });
        input.addEventListener('change', (e) => {
          const i = parseInt(e.target.dataset.cert);
          const field = e.target.dataset.field;
          this.state.certifications[i][field] = e.target.value;
          this.updatePreview();
        });
      });
    }
  }

  renderSkillTags() {
    const container = this.el.querySelector('#skills-container');
    if (!container) return;
    container.innerHTML = this.state.skills.filter(Boolean).map(s => `
      <span class="skill-tag">
        ${s}
        <button class="skill-tag-remove" data-skill="${s}" title="Remove">✕</button>
      </span>`).join('');
    this.bindSkillRemoveEvents();
  }

  bindSkillRemoveEvents() {
    this.el.querySelectorAll('.skill-tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const skill = btn.dataset.skill;
        this.state.skills = this.state.skills.filter(s => s !== skill);
        this.renderSkillTags();
        this.updatePreview();
      });
    });
  }

  collectCurrentStepData() {
    const step = STEPS[this.currentStep].id;

    if (step === 'personal') {
      const fields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'github', 'website', 'summary'];
      fields.forEach(f => {
        const el = this.el.querySelector(`#pi-${f}`);
        if (el) this.state.personalInfo[f] = el.value;
      });
    }
    if (step === 'experience') {
      this.el.querySelectorAll('[data-exp]').forEach(input => {
        const i = parseInt(input.dataset.exp);
        const field = input.dataset.field;
        if (this.state.experience[i]) {
          this.state.experience[i][field] = input.type === 'checkbox' ? input.checked : input.value;
        }
      });
    }
    if (step === 'education') {
      this.el.querySelectorAll('[data-edu]').forEach(input => {
        const i = parseInt(input.dataset.edu);
        const field = input.dataset.field;
        if (this.state.education[i]) {
          this.state.education[i][field] = input.value;
        }
      });
    }
    if (step === 'projects') {
      this.el.querySelectorAll('[data-proj]').forEach(input => {
        const i = parseInt(input.dataset.proj);
        const field = input.dataset.field;
        if (this.state.projects[i]) this.state.projects[i][field] = input.value;
      });
      this.el.querySelectorAll('[data-cert]').forEach(input => {
        const i = parseInt(input.dataset.cert);
        const field = input.dataset.field;
        if (this.state.certifications[i]) this.state.certifications[i][field] = input.value;
      });
    }

    // Always collect resume name
    const nameEl = this.el.querySelector('#resume-name');
    if (nameEl) this.state.resumeName = nameEl.value;
  }

  refreshStep() {
    this.collectCurrentStepData();
    const stepContent = this.el.querySelector('#step-content');
    if (stepContent) stepContent.innerHTML = this.getStepHTML();

    // Update step indicators
    this.el.querySelectorAll('.step-circle').forEach((el, i) => {
      el.className = `step-circle ${i < this.currentStep ? 'done' : i === this.currentStep ? 'active' : ''}`;
      el.textContent = i < this.currentStep ? '✓' : (i + 1).toString();
    });
    this.el.querySelectorAll('.step-label').forEach((el, i) => {
      el.className = `step-label ${i < this.currentStep ? 'done' : i === this.currentStep ? 'active' : ''}`;
    });
    this.el.querySelectorAll('.step-connector').forEach((el, i) => {
      el.className = `step-connector ${i < this.currentStep ? 'done' : ''}`;
    });

    this.bindEvents();
    this.updatePreview();

    // Scroll form panel to top
    const panel = this.el.querySelector('.builder-form-panel');
    if (panel) panel.scrollTop = 0;
  }

  updatePreview() {
    const frame = this.el.querySelector('#resume-preview-frame');
    if (frame) {
      frame.innerHTML = renderTemplate(this.state.template, this.state);
    }
  }

  async saveResume() {
    this.collectCurrentStepData();
    showLoading('Saving resume…');
    try {
      let saved;
      if (this.editId) {
        saved = await api.updateResume(this.editId, this.state);
        showToast('Resume updated successfully!', 'success');
      } else {
        saved = await api.createResume(this.state);
        this.editId = saved._id;
        showToast('Resume saved to database!', 'success');
      }
    } catch (e) {
      showToast('Failed to save: ' + e.message, 'error');
    } finally {
      hideLoading();
    }
  }

  downloadPDF() {
    this.collectCurrentStepData();
    const name = this.state.personalInfo.fullName || this.state.resumeName || 'resume';

    // Build a full standalone HTML document for the PDF
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;700;800&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; }
${this.getTemplatePDFCSS()}
</style>
</head>
<body>
${renderTemplate(this.state.template, this.state)}
</body>
</html>`;

    const element = document.createElement('div');
    element.innerHTML = renderTemplate(this.state.template, this.state);
    element.style.cssText = 'width:210mm;font-family:Inter,sans-serif;';
    element.className = 'pdf-root';
    document.body.appendChild(element);

    const opt = {
      margin: 0,
      filename: `${name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    showToast('Generating PDF…', 'info');

    if (typeof html2pdf === 'undefined') {
      showToast('PDF library not loaded. Please refresh the page.', 'error');
      document.body.removeChild(element);
      return;
    }

    html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
      showToast('PDF downloaded successfully!', 'success');
    }).catch(err => {
      document.body.removeChild(element);
      showToast('PDF generation failed. Try again.', 'error');
    });
  }

  getTemplatePDFCSS() {
    // Return relevant CSS for the active template
    return `
      .rt-modern { font-family: 'Inter', sans-serif; color: #1a1a2e; font-size: 10px; }
      .rt-modern .rt-header { background: linear-gradient(135deg, #6c63ff 0%, #5248d9 100%); color: white; padding: 28px 32px; }
      .rt-modern .rt-name { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
      .rt-modern .rt-headline { font-size: 11px; opacity: 0.85; margin-bottom: 12px; }
      .rt-modern .rt-contact-row { display: flex; flex-wrap: wrap; gap: 12px; font-size: 9px; opacity: 0.9; }
      .rt-modern .rt-contact-item { display: flex; align-items: center; gap: 4px; }
      .rt-modern .rt-body { display: grid; grid-template-columns: 2fr 1fr; }
      .rt-modern .rt-main { padding: 24px 28px 24px 32px; border-right: 1px solid #eee; }
      .rt-modern .rt-sidebar { padding: 24px 20px; background: #f8f8ff; }
      .rt-section-title { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #6c63ff; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #6c63ff; margin-top: 16px; }
      .rt-exp-item, .rt-edu-item, .rt-proj-item { margin-bottom: 12px; }
      .rt-exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px; }
      .rt-exp-role { font-size: 10.5px; font-weight: 700; color: #1a1a2e; }
      .rt-exp-company { font-size: 9.5px; font-weight: 600; color: #6c63ff; }
      .rt-exp-date { font-size: 8.5px; color: #888; white-space: nowrap; }
      .rt-exp-desc { font-size: 9px; color: #555; line-height: 1.5; margin-top: 4px; }
      .rt-skill-tag { display: inline-block; background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.3); color: #6c63ff; border-radius: 12px; padding: 2px 8px; font-size: 8px; font-weight: 600; margin: 2px; }
      .rt-summary { font-size: 9.5px; color: #444; line-height: 1.6; }
      .rt-classic { font-family: 'Times New Roman', serif; color: #1a1a1a; font-size: 10px; padding: 32px 36px; }
      .rt-classic .rt-name { font-size: 30px; font-weight: 700; text-align: center; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; }
      .rt-classic .rt-contact-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; font-size: 9px; color: #555; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #1a1a1a; }
      .rt-classic .rt-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 10px; margin-top: 16px; }
      .rt-classic .rt-exp-role { font-weight: 700; font-size: 10.5px; }
      .rt-classic .rt-exp-company { font-style: italic; font-size: 10px; }
      .rt-classic .rt-exp-header { display: flex; justify-content: space-between; margin-bottom: 3px; }
      .rt-classic .rt-exp-date { font-size: 9px; color: #666; }
      .rt-classic .rt-exp-desc { font-size: 9px; color: #444; line-height: 1.5; margin-top: 4px; padding-left: 12px; }
      .rt-classic .rt-skill-tag { display: inline; font-size: 9.5px; color: #333; }
      .rt-classic .rt-skill-tag::after { content: ' · '; }
      .rt-classic .rt-skill-tag:last-child::after { content: ''; }
      .rt-creative { font-family: 'Inter', sans-serif; color: #2d2d2d; font-size: 10px; display: grid; grid-template-columns: 220px 1fr; min-height: 297mm; }
      .rt-creative .rt-sidebar { background: linear-gradient(180deg, #f5576c 0%, #f093fb 100%); padding: 32px 20px; color: white; }
      .rt-creative .rt-avatar { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.3); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; border: 3px solid rgba(255,255,255,0.6); text-align: center; }
      .rt-creative .rt-name { font-size: 18px; font-weight: 800; text-align: center; margin-bottom: 4px; }
      .rt-creative .rt-headline { font-size: 9px; text-align: center; opacity: 0.85; margin-bottom: 20px; }
      .rt-creative .rt-sidebar-section-title { font-size: 8.5px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.7; margin-bottom: 8px; margin-top: 16px; }
      .rt-creative .rt-contact-item { font-size: 8.5px; opacity: 0.9; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; word-break: break-all; }
      .rt-creative .rt-skill-tag { display: inline-block; background: rgba(255,255,255,0.25); border-radius: 3px; padding: 2px 6px; font-size: 8px; font-weight: 600; margin: 2px; }
      .rt-creative .rt-main { padding: 28px 28px 24px; }
      .rt-creative .rt-section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #f5576c; border-left: 3px solid #f5576c; padding-left: 8px; margin-bottom: 10px; margin-top: 18px; }
      .rt-creative .rt-section-title:first-child { margin-top: 0; }
      .rt-creative .rt-exp-role { font-size: 10.5px; font-weight: 700; }
      .rt-creative .rt-exp-company { font-size: 9.5px; color: #f5576c; font-weight: 600; }
      .rt-creative .rt-exp-date { font-size: 8.5px; color: #999; }
      .rt-creative .rt-exp-desc { font-size: 9px; color: #555; line-height: 1.5; margin-top: 4px; }
      .rt-creative .rt-summary { font-size: 9.5px; color: #444; line-height: 1.6; }
    `;
  }
}
