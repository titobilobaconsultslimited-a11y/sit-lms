import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './Exam.css';

function Exam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`/api/exams/${id}/questions`);
        setQuestions(res.data || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);

    try {
      const response = await axios.post(
        `/api/exams/${id}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/results', { 
        state: { 
          message: response.data.message,
          score: response.data.score,
          total: response.data.total,
          percentage: response.data.percentage,
          status: response.data.status
        }
      });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading exam...</div>;

  const question = questions[currentQuestion];
  const answered = Object.keys(answers).length;
  const answeredCurrentQuestion = !!answers[question?.id];

  return (
    <div className="exam-page">
      <Header />
      
      <div className="container">
        <div className="exam-container">
          {/* Question Navigation */}
          <div className="question-nav">
            <h3>Questions</h3>
            <div className="nav-grid">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  className={`nav-button ${idx === currentQuestion ? 'current' : ''} ${answers[q.id] ? 'answered' : ''}`}
                  onClick={() => setCurrentQuestion(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div className="progress-info">
              Answered: {answered}/{questions.length}
            </div>
          </div>

          {/* Question Display */}
          <div className="question-display">
            {question && (
              <>
                <div className="question-header">
                  <h2>Question {currentQuestion + 1} of {questions.length}</h2>
                  <span className={`status ${answeredCurrentQuestion ? 'answered' : 'unanswered'}`}>
                    {answeredCurrentQuestion ? '✓ Answered' : '◯ Not Answered'}
                  </span>
                </div>

                <div className="question-text">
                  {question.question_text}
                </div>

                <div className="options">
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((option, idx) => {
                    const optionValue = String.fromCharCode(65 + idx);
                    const isSelected = answers[question.id] === optionValue;

                    return (
                      <div key={option} className="option">
                        <input
                          type="radio"
                          id={`${question.id}-${option}`}
                          name={`question-${question.id}`}
                          value={optionValue}
                          checked={isSelected}
                          onChange={() => handleAnswer(question.id, optionValue)}
                        />
                        <label htmlFor={`${question.id}-${option}`}>
                          <span className="option-letter">{optionValue}</span>
                          <span className="option-text">{question[option]}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="navigation-buttons">
                  <button
                    className="btn-prev"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    ← Previous
                  </button>

                  {currentQuestion < questions.length - 1 ? (
                    <button
                      className="btn-next"
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      className="btn-submit"
                      onClick={() => setShowConfirm(true)}
                      disabled={answered < questions.length}
                    >
                      Submit Exam
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Submit Exam?</h3>
            <p>You have answered {answered} out of {questions.length} questions.</p>
            {answered < questions.length && (
              <p className="warning">⚠️ Some questions are not answered. They will be marked wrong.</p>
            )}
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exam;
