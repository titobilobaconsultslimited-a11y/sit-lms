const db = require('./db');

/**
 * Seed sample data into JSON files
 * Run: node seed.js
 */

const seedData = () => {
  // Sample Courses
  const courses = [
    {
      course_code: 'SIT-101',
      course_name: 'Introduction to Information Technology',
      description: 'Learn the fundamentals of IT including hardware, software, networking, and security basics. This foundational course covers essential concepts needed for IT professionals.',
      duration: 40
    },
    {
      course_code: 'SIT-102',
      course_name: 'Web Development Basics',
      description: 'Master HTML, CSS, and JavaScript to build interactive web applications. Create responsive and modern websites from scratch.',
      duration: 50
    },
    {
      course_code: 'SIT-103',
      course_name: 'Database Management',
      description: 'Understand relational databases, SQL queries, and data management principles. Learn to design efficient databases for business applications.',
      duration: 45
    },
    {
      course_code: 'SIT-104',
      course_name: 'Cybersecurity Essentials',
      description: 'Discover security threats, protection mechanisms, and best practices. Essential knowledge for protecting systems and data.',
      duration: 35
    },
    {
      course_code: 'SIT-105',
      course_name: 'Cloud Computing Fundamentals',
      description: 'Explore cloud services, infrastructure, and deployment models. Learn how organizations leverage cloud for scalability.',
      duration: 42
    }
  ];

  // Insert Courses
  const coursesData = [];
  courses.forEach((course) => {
    const newCourse = db.addCourse(course);
    coursesData.push(newCourse);
    console.log(`✓ Course added: ${course.course_name}`);
  });

  // Add exams
  coursesData.forEach((course) => {
    const exams = [
      {
        course_id: course.id,
        exam_name: `Mid-Term Exam`,
        total_questions: 20,
        passing_score: 60,
        duration: 60
      },
      {
        course_id: course.id,
        exam_name: `Final Exam`,
        total_questions: 30,
        passing_score: 70,
        duration: 90
      }
    ];

    exams.forEach((exam) => {
      const newExam = db.addExam(exam);
      console.log(`✓ Exam added: ${exam.exam_name}`);

      // Add sample questions
      const questions = generateQuestions(exam.total_questions);
      questions.forEach((question) => {
        db.addQuestion({
          exam_id: newExam.id,
          question_text: question.text,
          option_a: question.a,
          option_b: question.b,
          option_c: question.c,
          option_d: question.d,
          correct_answer: question.correct
        });
      });
    });
  });
};

const generateQuestions = (count) => {
  const questionsList = [
    {
      text: 'What does IT stand for?',
      a: 'Internet Technology',
      b: 'Information Technology',
      c: 'Interactive Tools',
      d: 'Information Transformer',
      correct: 'B'
    },
    {
      text: 'Which of the following is a primary function of an operating system?',
      a: 'Running applications and managing hardware',
      b: 'Creating documents',
      c: 'Browsing the internet',
      d: 'Playing music',
      correct: 'A'
    },
    {
      text: 'What is the most commonly used programming language?',
      a: 'Python',
      b: 'JavaScript',
      c: 'Java',
      d: 'C++',
      correct: 'B'
    },
    {
      text: 'Which database language is used for querying?',
      a: 'XML',
      b: 'HTML',
      c: 'SQL',
      d: 'CSS',
      correct: 'C'
    },
    {
      text: 'What is the primary purpose of a firewall?',
      a: 'To speed up internet',
      b: 'To protect networks from unauthorized access',
      c: 'To store files',
      d: 'To manage passwords',
      correct: 'B'
    },
    {
      text: 'Which of the following is a cloud service provider?',
      a: 'Windows',
      b: 'AWS',
      c: 'Linux',
      d: 'Android',
      correct: 'B'
    },
    {
      text: 'What is the purpose of encryption?',
      a: 'To make files smaller',
      b: 'To protect data from unauthorized access',
      c: 'To speed up processing',
      d: 'To delete files',
      correct: 'B'
    },
    {
      text: 'Which protocol is used for secure web browsing?',
      a: 'HTTP',
      b: 'FTP',
      c: 'HTTPS',
      d: 'SMTP',
      correct: 'C'
    },
    {
      text: 'What is RAM used for?',
      a: 'Permanent storage',
      b: 'Temporary storage for running programs',
      c: 'Backing up files',
      d: 'Internet connection',
      correct: 'B'
    },
    {
      text: 'Which type of malware replicates itself?',
      a: 'Trojan',
      b: 'Virus',
      c: 'Spyware',
      d: 'Adware',
      correct: 'B'
    }
  ];

  // Return random questions from the list
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(questionsList[i % questionsList.length]);
  }
  return result;
};

console.log('🌱 Starting Database Seed...\n');
db.init();
seedData();
console.log('\n✓ Seeding completed! Sample data has been added.\n');

