const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all available courses
router.get('/', (req, res) => {
  const courses = db.getAllCourses();
  res.json(courses);
});

// Get user's enrolled courses
router.get('/my-courses', authenticate, (req, res) => {
  const courses = db.getUserCourses(req.userId);
  res.json(courses);
});

// Enroll in a course
router.post('/:courseId/enroll', authenticate, (req, res) => {
  try {
    db.enrollUser(req.userId, parseInt(req.params.courseId));
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    if (error.message.includes('Already')) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

// Get course details
router.get('/:id', (req, res) => {
  const course = db.getCourseById(parseInt(req.params.id));
  
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  
  res.json(course);
});

module.exports = router;
