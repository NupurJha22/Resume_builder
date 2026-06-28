const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'resumes.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readAll() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeAll(resumes) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(resumes, null, 2), 'utf8');
}

function toListItem(r) {
  return {
    _id: r._id,
    resumeName: r.resumeName,
    template: r.template,
    personalInfo: { fullName: r.personalInfo?.fullName || '' },
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

exports.findAll = async () => {
  return readAll()
    .map(toListItem)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

exports.findById = async (id) => {
  return readAll().find((r) => r._id === id) || null;
};

exports.create = async (data) => {
  const now = new Date().toISOString();
  const resume = {
    ...data,
    _id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const resumes = readAll();
  resumes.push(resume);
  writeAll(resumes);
  return resume;
};

exports.update = async (id, data) => {
  const resumes = readAll();
  const index = resumes.findIndex((r) => r._id === id);
  if (index === -1) return null;

  const updated = {
    ...resumes[index],
    ...data,
    _id: id,
    updatedAt: new Date().toISOString(),
  };
  resumes[index] = updated;
  writeAll(resumes);
  return updated;
};

exports.delete = async (id) => {
  const resumes = readAll();
  const index = resumes.findIndex((r) => r._id === id);
  if (index === -1) return null;
  const [removed] = resumes.splice(index, 1);
  writeAll(resumes);
  return removed;
};
