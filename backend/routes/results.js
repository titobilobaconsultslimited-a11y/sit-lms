const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user's exam results
router.get('/user', authenticate, (req, res) => {
  const results = db.getUserResults(req.userId);
  res.json(results);
});

// Get specific exam result
router.get('/:resultId', authenticate, (req, res) => {
  const results = db.getUserResults(req.userId);
  const result = results.find(r => r.id === parseInt(req.params.resultId));
  
  if (!result) {
    return res.status(404).json({ error: 'Result not found' });
  }
  
  res.json(result);
});

module.exports = router;
