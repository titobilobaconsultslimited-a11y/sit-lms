const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
};

// File paths
const usersFile = path.join(dataDir, 'users.json');
const coursesFile = path.join(dataDir, 'courses.json');
const userCoursesFile = path.join(dataDir, 'user_courses.json');
const examsFile = path.join(dataDir, 'exams.json');
const questionsFile = path.join(dataDir, 'questions.json');
const resultsFile = path.join(dataDir, 'results.json');

// Read JSON file
const readFile = (filePath, defaultValue = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
  return defaultValue;
};

// Write JSON file
const writeFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
  }
};

// Initialize data files
const init = () => {
  ensureDataDir();
  
  if (!fs.existsSync(usersFile)) writeFile(usersFile, []);
  if (!fs.existsSync(coursesFile)) writeFile(coursesFile, []);
  if (!fs.existsSync(userCoursesFile)) writeFile(userCoursesFile, []);
  if (!fs.existsSync(examsFile)) writeFile(examsFile, []);
  if (!fs.existsSync(questionsFile)) writeFile(questionsFile, []);
  if (!fs.existsSync(resultsFile)) writeFile(resultsFile, []);
  
  console.log('✓ Database initialized');
};

// Get next ID for an entity
const getNextId = (filePath) => {
  const data = readFile(filePath, []);
  if (data.length === 0) return 1;
  return Math.max(...data.map(item => item.id || 0)) + 1;
};

// Get enrollment ID
const getEnrollmentId = (callback) => {
  const year = new Date().getFullYear();
  const users = readFile(usersFile, []);
  const yearUsers = users.filter(u => new Date(u.created_at).getFullYear() === year);
  const nextNumber = String(yearUsers.length + 1).padStart(3, '0');
  const enrollmentId = `SIT/${nextNumber}/${year}`;
  callback(null, enrollmentId);
};

module.exports = {
  init,
  getEnrollmentId,
  
  // Users operations
  addUser: (data) => {
    const users = readFile(usersFile, []);
    const newUser = {
      id: getNextId(usersFile),
      ...data,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    writeFile(usersFile, users);
    return newUser;
  },
  
  getUserByEmail: (email) => {
    const users = readFile(usersFile, []);
    return users.find(u => u.email === email);
  },
  
  getUserById: (id) => {
    const users = readFile(usersFile, []);
    return users.find(u => u.id === id);
  },
  
  // Courses operations
  getAllCourses: () => readFile(coursesFile, []),
  
  getCourseById: (id) => {
    const courses = readFile(coursesFile, []);
    return courses.find(c => c.id === id);
  },
  
  addCourse: (data) => {
    const courses = readFile(coursesFile, []);
    const newCourse = { id: getNextId(coursesFile), ...data };
    courses.push(newCourse);
    writeFile(coursesFile, courses);
    return newCourse;
  },
  
  // User Courses operations
  enrollUser: (userId, courseId) => {
    const userCourses = readFile(userCoursesFile, []);
    const exists = userCourses.find(uc => uc.user_id === userId && uc.course_id === courseId);
    if (exists) throw new Error('Already enrolled');
    
    const enrollment = {
      id: getNextId(userCoursesFile),
      user_id: userId,
      course_id: courseId,
      enrollment_date: new Date().toISOString(),
      progress: 0
    };
    userCourses.push(enrollment);
    writeFile(userCoursesFile, userCourses);
    return enrollment;
  },
  
  getUserCourses: (userId) => {
    const userCourses = readFile(userCoursesFile, []);
    const courses = readFile(coursesFile, []);
    
    return userCourses
      .filter(uc => uc.user_id === userId)
      .map(uc => {
        const course = courses.find(c => c.id === uc.course_id);
        return { ...course, ...uc };
      });
  },
  
  // Exams operations
  getCourseExams: (courseId) => {
    const exams = readFile(examsFile, []);
    return exams.filter(e => e.course_id === courseId);
  },
  
  addExam: (data) => {
    const exams = readFile(examsFile, []);
    const newExam = { id: getNextId(examsFile), ...data, created_at: new Date().toISOString() };
    exams.push(newExam);
    writeFile(examsFile, exams);
    return newExam;
  },
  
  // Questions operations
  getExamQuestions: (examId) => {
    const questions = readFile(questionsFile, []);
    return questions.filter(q => q.exam_id === examId);
  },
  
  addQuestion: (data) => {
    const questions = readFile(questionsFile, []);
    const newQuestion = { id: getNextId(questionsFile), ...data };
    questions.push(newQuestion);
    writeFile(questionsFile, questions);
    return newQuestion;
  },
  
  // Results operations
  addResult: (data) => {
    const results = readFile(resultsFile, []);
    const newResult = {
      id: getNextId(resultsFile),
      ...data,
      attempted_at: new Date().toISOString()
    };
    results.push(newResult);
    writeFile(resultsFile, results);
    return newResult;
  },
  
  getUserResults: (userId) => {
    const results = readFile(resultsFile, []);
    const exams = readFile(examsFile, []);
    const courses = readFile(coursesFile, []);
    
    return results
      .filter(r => r.user_id === userId)
      .map(r => {
        const exam = exams.find(e => e.id === r.exam_id);
        const course = exam ? courses.find(c => c.id === exam.course_id) : null;
        return {
          ...r,
          exam_name: exam?.exam_name,
          course_name: course?.course_name
        };
      })
      .sort((a, b) => new Date(b.attempted_at) - new Date(a.attempted_at));
  }
};
