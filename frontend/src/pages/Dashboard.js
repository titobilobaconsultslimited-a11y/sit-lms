import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, coursesRes, resultsRes] = await Promise.all([
          axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/courses/my-courses', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/results/user', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setUser(userRes.data);
        setCourses(coursesRes.data || []);
        setResults(resultsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <Header />
      
      <div className="container">
        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="profile-card">
            <h2>Welcome, {user?.name}!</h2>
            <div className="info-row">
              <span>Enrollment ID:</span>
              <strong>{user?.enrollment_id}</strong>
            </div>
            <div className="info-row">
              <span>Email:</span>
              <strong>{user?.email}</strong>
            </div>
            <Link to="/courses" className="btn-explore">
              Explore Courses
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{courses.length}</h3>
              <p>Courses Enrolled</p>
            </div>
            <div className="stat-card">
              <h3>{results.length}</h3>
              <p>Exams Taken</p>
            </div>
            <div className="stat-card">
              <h3>
                {results.length > 0 ? 
                  (results.filter(r => r.status === 'PASSED').length) : 0
                }
              </h3>
              <p>Exams Passed</p>
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        {courses.length > 0 && (
          <div className="recent-section">
            <h3>Your Courses</h3>
            <div className="courses-list">
              {courses.map((course) => (
                <div key={course.id} className="course-item">
                  <h4>{course.course_name}</h4>
                  <p>{course.description}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span>{course.progress}% Complete</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="recent-section">
            <h3>Recent Exam Results</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 5).map((result) => (
                  <tr key={result.id} className={result.status === 'PASSED' ? 'passed' : 'failed'}>
                    <td>{result.exam_name}</td>
                    <td>{result.course_name}</td>
                    <td>{result.percentage.toFixed(2)}%</td>
                    <td className={result.status}>{result.status}</td>
                    <td>{new Date(result.attempted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/results" className="view-all-link">View All Results →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
