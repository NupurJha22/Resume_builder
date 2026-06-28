const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  url: { type: String, default: '' },
  technologies: { type: String, default: '' },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  url: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
  {
    resumeName: { type: String, default: 'My Resume' },
    template: { type: String, default: 'modern', enum: ['modern', 'classic', 'creative'] },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: { type: [String], default: [] },
    projects: [projectSchema],
    certifications: [certificationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
