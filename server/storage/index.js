const Resume = require('../models/Resume');
const fileStore = require('./fileStore');

let useFileStore = false;

exports.setFileStoreMode = (enabled) => {
  useFileStore = enabled;
};

exports.isFileStoreMode = () => useFileStore;

exports.findAll = async () => {
  if (useFileStore) return fileStore.findAll();
  const resumes = await Resume.find(
    {},
    'resumeName template personalInfo.fullName createdAt updatedAt'
  ).sort({ updatedAt: -1 });
  return resumes;
};

exports.findById = async (id) => {
  if (useFileStore) return fileStore.findById(id);
  return Resume.findById(id);
};

exports.create = async (data) => {
  if (useFileStore) return fileStore.create(data);
  const resume = new Resume(data);
  return resume.save();
};

exports.update = async (id, data) => {
  if (useFileStore) return fileStore.update(id, data);
  return Resume.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.delete = async (id) => {
  if (useFileStore) return fileStore.delete(id);
  return Resume.findByIdAndDelete(id);
};
