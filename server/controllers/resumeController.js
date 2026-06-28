const storage = require('../storage');

// GET all resumes
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await storage.findAll();
    res.json({ success: true, data: resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single resume
exports.getResume = async (req, res) => {
  try {
    const resume = await storage.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create resume
exports.createResume = async (req, res) => {
  try {
    const saved = await storage.create(req.body);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT update resume
exports.updateResume = async (req, res) => {
  try {
    const resume = await storage.update(req.params.id, req.body);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await storage.delete(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
