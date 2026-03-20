import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './Courses.css';

function Courses() {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [allRes, enrolledRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/courses/my-courses', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setAllCourses(allRes.data || []);
        setEnrolledCourses(enrolledRes.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`/api/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully enrolled!');
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.error || 'Enrollment failed');
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;

  const enrolledIds = enrolledCourses.map(c => c.id);
  const availableCourses = allCourses.filter(c => !enrolledIds.includes(c.id));

  return (
    <div className="courses-page">
      <Header />
      
      <div className="container">
        <h1>Courses</h1>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'enrolled' ? 'active' : ''}`}
            onClick={() => setActiveTab('enrolled')}
          >
            My Courses ({enrolledCourses.length})
          </button>
          <button 
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Courses ({availableCourses.length})
          </button>
        </div>

        <div className="courses-grid">
          {activeTab === 'enrolled' ? (
            enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <div key={course.id} className="course-card enrolled">
                  <div className="course-header">
                    <h3>{course.course_name}</h3>
                    <span className="badge">Enrolled</span>
                  </div>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>Duration: {course.duration} hours</span>
                  </div>
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="progress-text">{course.progress}% Complete</span>
                  </div>
                  <Link to={`/courses/${course.id}`} className="btn-view">
                    View Course
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-courses">You haven't enrolled in any courses yet.</p>
            )
          ) : (
            availableCourses.length > 0 ? (
              availableCourses.map((course) => (
                <div key={course.id} className="course-card available">
                  <div className="course-header">
                    <h3>{course.course_name}</h3>
                    <span className="badge available-badge">Available</span>
                  </div>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>Duration: {course.duration} hours</span>
                  </div>
                  <button 
                    className="btn-enroll"
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              ))
            ) : (
              <p className="no-courses">No available courses to enroll in.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
