import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './CourseDetail.css';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, examsRes] = await Promise.all([
          axios.get(`/api/courses/${id}`),
          axios.get(`/api/exams/course/${id}`)
        ]);
        
        setCourse(courseRes.data);
        setExams(examsRes.data || []);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading course...</div>;

  return (
    <div className="course-detail-page">
      <Header />
      
      <div className="container">
        <Link to="/courses" className="back-link">← Back to Courses</Link>
        
        {course && (
          <div className="course-content">
            <div className="course-hero">
              <h1>{course.course_name}</h1>
              <p className="course-code">Course Code: {course.course_code}</p>
            </div>

            <div className="course-main">
              <div className="course-info">
                <h3>Course Description</h3>
                <p>{course.description}</p>
                
                <div className="course-details">
                  <div className="detail-item">
                    <span>Duration:</span>
                    <strong>{course.duration} hours</strong>
                  </div>
                </div>
              </div>

              <div className="course-sidebar">
                <div className="exams-section">
                  <h3>Available Exams</h3>
                  
                  {exams.length > 0 ? (
                    <div className="exams-list">
                      {exams.map((exam) => (
                        <div key={exam.id} className="exam-item">
                          <h4>{exam.exam_name}</h4>
                          <p className="exam-info">
                            {exam.total_questions} Questions | {exam.duration} mins
                          </p>
                          <p className="exam-pass">
                            Pass Score: {exam.passing_score}%
                          </p>
                          <Link to={`/exam/${exam.id}`} className="btn-take-exam">
                            Take Exam
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-exams">No exams available for this course yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
