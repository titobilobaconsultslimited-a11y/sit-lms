const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get exams for a course
router.get('/course/:courseId', (req, res) => {
  const exams = db.getCourseExams(parseInt(req.params.courseId));
  res.json(exams);
});

// Get exam questions
router.get('/:examId/questions', (req, res) => {
  const questions = db.getExamQuestions(parseInt(req.params.examId));
  // Don't send the correct answer to frontend
  const safeQuestions = questions.map(q => ({
    id: q.id,
    exam_id: q.exam_id,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d
  }));
  res.json(safeQuestions);
});

// Submit exam answers
router.post('/:examId/submit', authenticate, (req, res) => {
  try {
    const { answers } = req.body;
    const questions = db.getExamQuestions(parseInt(req.params.examId));

    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / questions.length) * 100;
    const totalQuestions = questions.length;
    const exams = db.getCourseExams(0).concat(db.getCourseExams(1)).concat(db.getCourseExams(2)).concat(db.getCourseExams(3)).concat(db.getCourseExams(4)).concat(db.getCourseExams(5));
    const exam = exams.find(e => e.id === parseInt(req.params.examId));

    const status = percentage >= exam.passing_score ? 'PASSED' : 'FAILED';

    const result = db.addResult({
      user_id: req.userId,
      exam_id: parseInt(req.params.examId),
      score: correctCount,
      total_questions: totalQuestions,
      percentage: percentage,
      status
    });

    res.json({
      message: 'Exam submitted successfully',
      score: correctCount,
      total: totalQuestions,
      percentage: percentage.toFixed(2),
      status
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save results' });
  }
});

module.exports = router;
