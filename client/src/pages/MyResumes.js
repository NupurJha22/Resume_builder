import { api } from '../api.js';
import { showToast, showLoading, hideLoading, formatRelativeDate } from '../utils.js';

export class MyResumesPage {
  constructor() {
    this.resumes = [];
    this.el = null;
  }

  async init(container) {
    this.el = container;
    this.render('<div class="flex-center" style="height:60vh;"><div class="loading-spinner" style="width:40px;height:40px;border-width:3px;"></div></div>');
    await this.loadResumes();
  }

  async loadResumes() {
    showLoading('Loading your resumes…');
    try {
      this.resumes = await api.getAllResumes();
    } catch (e) {
      showToast('Could not connect to server. Is it running?', 'error');
      this.resumes = [];
    } finally {
      hideLoading();
    }
    this.render(this.getHTML());
    this.bindEvents();
  }

  render(html) {
    this.el.innerHTML = html;
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
            <button class="nav-btn nav-btn-ghost" onclick="window.router.navigate('home')">Home</button>
            <button class="nav-btn nav-btn-primary" id="btn-new-resume" onclick="window.router.navigate('builder')">+ New Resume</button>
          </div>
        </nav>

        <div class="my-resumes-page">
          <div class="page-header">
            <div>
              <h1 class="page-title">My Resumes</h1>
              <p class="text-muted text-sm mt-1">${this.resumes.length} resume${this.resumes.length !== 1 ? 's' : ''} saved</p>
            </div>
            <button class="btn btn-primary" id="btn-create-new" onclick="window.router.navigate('builder')">
              ✨ Create New
            </button>
          </div>

          ${this.resumes.length === 0 ? this.getEmptyState() : this.getResumesGrid()}
        </div>
      </div>
    `;
  }

  getEmptyState() {
    return `
      <div class="empty-state animate-fade-in">
        <span class="empty-state-icon">📄</span>
        <div class="empty-state-title">No Resumes Yet</div>
        <p style="margin-bottom:2rem;">Create your first professional resume in minutes.</p>
        <button class="btn btn-primary btn-lg" onclick="window.router.navigate('builder')">
          🚀 Build My First Resume
        </button>
      </div>`;
  }

  getResumesGrid() {
    return `
      <div class="resumes-grid">
        ${this.resumes.map(r => this.getResumeCard(r)).join('')}
      </div>`;
  }

  getResumeCard(r) {
    const template = r.template || 'modern';
    const name = r.resumeName || 'Untitled Resume';
    const ownerName = r.personalInfo?.fullName || '';
    const updated = formatRelativeDate(r.updatedAt);

    return `
      <div class="resume-card animate-fade-in" data-id="${r._id}">
        <div class="resume-card-preview resume-card-preview-${template}">
          <div class="resume-card-preview-lines">
            <div class="resume-card-line h"></div>
            <div class="resume-card-line s"></div>
            <div class="resume-card-line m" style="margin-top:8px;"></div>
            <div class="resume-card-line s"></div>
            <div class="resume-card-line m"></div>
          </div>
        </div>
        <div class="resume-card-body">
          <div class="resume-card-name">${name}</div>
          ${ownerName ? `<div class="resume-card-meta">${ownerName}</div>` : ''}
          <div class="resume-card-meta">Updated ${updated}</div>
          <div class="resume-card-template-badge badge-${template}">${template.charAt(0).toUpperCase() + template.slice(1)}</div>
          <div class="resume-card-actions">
            <button class="btn btn-primary btn-sm" data-edit="${r._id}" style="flex:1;justify-content:center;">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" data-delete="${r._id}" style="justify-content:center;">🗑</button>
          </div>
        </div>
      </div>`;
  }

  bindEvents() {
    this.el.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.router.navigate('builder', { editId: btn.dataset.edit });
      });
    });

    this.el.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.delete;
        if (!confirm('Delete this resume? This cannot be undone.')) return;
        showLoading('Deleting…');
        try {
          await api.deleteResume(id);
          showToast('Resume deleted', 'success');
          await this.loadResumes();
        } catch (e) {
          showToast('Failed to delete resume', 'error');
        } finally {
          hideLoading();
        }
      });
    });
  }
}
