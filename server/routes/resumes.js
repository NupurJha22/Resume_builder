const express = require('express');
const router = express.Router();
const {
  getAllResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
} = require('../controllers/resumeController');

router.get('/', getAllResumes);
router.get('/:id', getResume);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;
