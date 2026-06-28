// Home page — landing page with hero + features + templates
export function renderHome(router) {
  return `
    <div class="page">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="navbar-brand" id="nav-logo" onclick="window.router.navigate('home')">
          <div class="navbar-logo">R</div>
          <span class="navbar-title">ResumeForge</span>
        </div>
        <div class="navbar-nav">
          <button class="nav-btn nav-btn-ghost" id="nav-my-resumes" onclick="window.router.navigate('my-resumes')">My Resumes</button>
          <button class="nav-btn nav-btn-primary" id="nav-build" onclick="window.router.navigate('builder')">Build Resume</button>
        </div>
      </nav>

      <!-- Hero -->
      <section class="hero" style="position:relative;">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>

        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          AI-Powered Resume Builder
        </div>

        <h1 class="hero-title">
          Build Your Dream<br/>
          <span class="hero-title-gradient">Resume in Minutes</span>
        </h1>

        <p class="hero-subtitle">
          Create stunning, ATS-friendly resumes with our interactive builder.
          Choose from beautiful templates, fill in your details, and download as PDF instantly.
        </p>

        <div class="hero-actions">
          <button id="cta-build" class="btn btn-primary btn-lg" onclick="window.router.navigate('builder')">
            🚀 Start Building
          </button>
          <button id="cta-resumes" class="btn btn-secondary btn-lg" onclick="window.router.navigate('my-resumes')">
            📁 My Resumes
          </button>
        </div>
      </section>

      <!-- Features -->
      <section class="features">
        <div class="section-label">Why ResumeForge</div>
        <h2 class="section-title">Everything You Need to Land That Job</h2>
        <p class="section-subtitle">Professional tools that make resume building effortless and enjoyable.</p>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">✨</div>
            <div class="feature-title">Live Preview</div>
            <div class="feature-desc">See your resume update in real-time as you type. No more guessing what it looks like.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <div class="feature-title">3 Premium Templates</div>
            <div class="feature-desc">Choose from Modern, Classic, and Creative templates designed by professionals.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📄</div>
            <div class="feature-title">One-Click PDF Download</div>
            <div class="feature-desc">Download your resume as a perfectly formatted PDF with a single click.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💾</div>
            <div class="feature-title">Cloud Storage</div>
            <div class="feature-desc">Your resumes are saved securely in MongoDB. Access them anytime, anywhere.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <div class="feature-title">Step-by-Step Wizard</div>
            <div class="feature-desc">Guided form wizard makes it easy to fill every section — from experience to skills.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <div class="feature-title">Edit Anytime</div>
            <div class="feature-desc">Load, edit, and update your saved resumes at any time. Always stay current.</div>
          </div>
        </div>
      </section>

      <!-- Templates Preview -->
      <section class="templates-section">
        <div class="section-label">Templates</div>
        <h2 class="section-title">Choose Your Style</h2>
        <p class="section-subtitle">Three professionally designed templates to match any career or industry.</p>

        <div class="templates-grid">
          <div class="template-card" id="tpl-modern" onclick="window.router.navigate('builder', {template:'modern'})">
            <div class="template-preview template-preview-modern">
              <div class="template-preview-lines">
                <div class="template-line header"></div>
                <div class="template-line subheader"></div>
                <div class="template-line short" style="margin-top:8px;"></div>
                <div class="template-line medium"></div>
                <div class="template-line short"></div>
              </div>
            </div>
            <div class="template-info">
              <div class="template-name">Modern</div>
              <div class="template-desc">Bold, colorful header with two-column layout. Perfect for tech & creative roles.</div>
            </div>
          </div>

          <div class="template-card" id="tpl-classic" onclick="window.router.navigate('builder', {template:'classic'})">
            <div class="template-preview template-preview-classic">
              <div class="template-preview-lines">
                <div class="template-line header" style="width:70%;margin:0 auto;"></div>
                <div class="template-line subheader" style="width:80%;margin:0 auto;"></div>
                <div class="template-line short" style="margin-top:8px;"></div>
                <div class="template-line medium"></div>
                <div class="template-line short"></div>
              </div>
            </div>
            <div class="template-info">
              <div class="template-name">Classic</div>
              <div class="template-desc">Traditional serif layout with clean structure. Ideal for finance, law & academia.</div>
            </div>
          </div>

          <div class="template-card" id="tpl-creative" onclick="window.router.navigate('builder', {template:'creative'})">
            <div class="template-preview template-preview-creative">
              <div class="template-preview-lines">
                <div class="template-line header" style="width:50%;background:rgba(255,255,255,0.4);"></div>
                <div class="template-line subheader"></div>
                <div class="template-line short" style="margin-top:8px;"></div>
                <div class="template-line medium"></div>
                <div class="template-line short"></div>
              </div>
            </div>
            <div class="template-info">
              <div class="template-name">Creative</div>
              <div class="template-desc">Vibrant gradient sidebar with bold typography. Great for design & marketing.</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section style="text-align:center;padding:5rem 2rem;background:linear-gradient(180deg, transparent, rgba(108,99,255,0.05));">
        <h2 style="font-size:clamp(1.8rem,4vw,2.5rem);margin-bottom:1rem;">Ready to Build Your Perfect Resume?</h2>
        <p style="color:var(--text-secondary);margin-bottom:2rem;font-size:1.05rem;">Join thousands who have landed their dream jobs with ResumeForge.</p>
        <button id="cta-final" class="btn btn-primary btn-lg" onclick="window.router.navigate('builder')">
          ✨ Start for Free
        </button>
      </section>
    </div>
  `;
}
