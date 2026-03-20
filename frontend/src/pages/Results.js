import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './Results.css';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('/api/results/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(res.data || []);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  if (loading) return <div className="loading">Loading results...</div>;

  const passedCount = results.filter(r => r.status === 'PASSED').length;
  const totalExams = results.length;
  const averageScore = totalExams > 0 
    ? (results.reduce((sum, r) => sum + r.percentage, 0) / totalExams).toFixed(2)
    : 0;

  return (
    <div className="results-page">
      <Header />
      
      <div className="container">
        <div className="results-header">
          <h1>Exam Results</h1>
          <Link to="/courses" className="btn-take-exam-link">Take More Exams</Link>
        </div>

        {totalExams > 0 && (
          <div className="stats-overview">
            <div className="stat">
              <h3>{totalExams}</h3>
              <p>Total Exams</p>
            </div>
            <div className="stat">
              <h3 className="passed">{passedCount}</h3>
              <p>Passed</p>
            </div>
            <div className="stat">
              <h3 className="failed">{totalExams - passedCount}</h3>
              <p>Failed</p>
            </div>
            <div className="stat">
              <h3>{averageScore}%</h3>
              <p>Average Score</p>
            </div>
          </div>
        )}

        {results.length > 0 ? (
          <div className="results-list">
            <h2>Your Results</h2>
            {results.map((result) => (
              <div key={result.id} className={`result-card ${result.status.toLowerCase()}`}>
                <div className="result-header">
                  <div className="result-title">
                    <h3>{result.exam_name}</h3>
                    <p className="course-name">{result.course_name}</p>
                  </div>
                  <div className={`result-status ${result.status.toLowerCase()}`}>
                    {result.status === 'PASSED' ? '✓ PASSED' : '✗ FAILED'}
                  </div>
                </div>

                <div className="result-details">
                  <div className="detail">
                    <span className="label">Score</span>
                    <span className="value">{result.score}/{result.total_questions}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Percentage</span>
                    <span className="value">{result.percentage.toFixed(2)}%</span>
                  </div>
                  <div className="detail">
                    <span className="label">Date Taken</span>
                    <span className="value">{new Date(result.attempted_at).toLocaleDateString()}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Time</span>
                    <span className="value">{new Date(result.attempted_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="result-bar">
                  <div className="bar-fill" style={{ width: `${result.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h2>No exam results yet</h2>
            <p>You haven't taken any exams yet. Start learning and take an exam!</p>
            <Link to="/courses" className="btn-start">
              Explore Courses & Exams
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
