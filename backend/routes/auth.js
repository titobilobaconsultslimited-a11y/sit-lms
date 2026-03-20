const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if email exists
    if (db.getUserByEmail(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Get next enrollment ID
    db.getEnrollmentId(async (err, enrollmentId) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to generate enrollment ID' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = db.addUser({
        enrollment_id: enrollmentId,
        name,
        email,
        password: hashedPassword
      });

      const token = jwt.sign(
        { userId: user.id, email, enrollmentId },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User created successfully',
        enrollmentId,
        token,
        userId: user.id
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, enrollmentId: user.enrollment_id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      userId: user.id,
      enrollmentId: user.enrollment_id,
      name: user.name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile', authenticate, (req, res) => {
  const user = db.getUserById(req.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    enrollment_id: user.enrollment_id
  });
});

module.exports = router;
