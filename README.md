# SIT LMS - Learning Management System

A comprehensive Learning Management System (LMS) for SIT (Strategic Information Technology) Envoys with course management, exams, and result tracking.

## Features

✅ **User Authentication**
- Signup & Login with secure password hashing
- Unique enrollment ID generation (SIT/001/2026 format)
- JWT token-based authentication

✅ **Course Management**
- Browse available courses
- Enroll in courses
- Track course progress
- Course-specific exams

✅ **Exam System**
- Multiple choice questions
- Timed exams
- Automatic scoring
- Pass/Fail tracking

✅ **Results & Analytics**
- Detailed exam results
- Progress tracking
- Performance statistics
- Historical data

✅ **Dashboard**
- User profile with enrollment ID
- Quick stats (courses, exams taken, passed)
- Recent results display
- Course progress visualization

✅ **Modern UI**
- Green, white, and yellow color theme
- Responsive design (mobile, tablet, desktop)
- Intuitive navigation
- Professional styling

## Tech Stack

**Backend:**
- Node.js
- Express.js
- SQLite3
- JWT Authentication
- Bcrypt (password hashing)

**Frontend:**
- React 18
- React Router v6
- Axios (HTTP client)
- CSS3

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Start the backend server:
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Start the React app:
```bash
npm start
```

App runs on: `http://localhost:3000`

## Database Seeding

To add sample courses and exams:

```bash
cd backend
node seed.js
```

This will populate the database with:
- 5 Sample Courses
- 10 Exams (2 per course)
- 100 Sample Questions

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/my-courses` - Get enrolled courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:courseId/enroll` - Enroll in course

### Exams
- `GET /api/exams/course/:courseId` - Get course exams
- `GET /api/exams/:examId/questions` - Get exam questions
- `POST /api/exams/:examId/submit` - Submit exam answers

### Results
- `GET /api/results/user` - Get user's results
- `GET /api/results/:resultId` - Get specific result

## Enrollment ID System

The system automatically generates unique enrollment IDs:
- Format: `SIT/XXX/YYYY`
- Example: `SIT/001/2026`, `SIT/002/2026`, etc.
- XXX: Sequential number (001, 002, 003...)
- YYYY: Current year

## Usage Guide

### For Students

1. **Signup**: Create account with name, email, and password
   - Receive unique enrollment ID automatically

2. **Explore Courses**: Browse available courses from dashboard

3. **Enroll**: Click "Enroll Now" on any course

4. **Take Exams**: Access exams from course detail page
   - Answer multiple choice questions
   - Submit answers for automatic grading

5. **View Results**: Check exam results and performance
   - See scores, percentages, and pass/fail status
   - Track overall performance metrics

### For Administrators

To add courses and exams, directly insert into database or extend API:

```
courses table - Add new courses
exams table - Add exams to courses
questions table - Add multiple choice questions
```

## Database Schema

**Users** - Student accounts and enrollment IDs
**Courses** - Available courses
**User_Courses** - Enrollment records
**Exams** - Course exams
**Questions** - Exam questions
**Results** - Student exam results

## Customization

### Colors
Edit CSS variables in `frontend/src/index.css`:
```css
:root {
  --primary: #22c55e;      /* Green */
  --secondary: #eab308;    /* Yellow */
  --white: #ffffff;
  --dark: #1f2937;
  --light: #f9fafb;
}
```

### Passing Scores
Modify in exam creation or seed script

### Enrollment ID Format
Edit `backend/db.js` -> `getEnrollmentId()` function

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Secure API endpoints
- Input validation
- CORS enabled

## Future Enhancements

- Email notifications
- Certificate generation
- Progress analytics dashboard
- Video content integration
- Discussion forums
- Assignment submissions
- Role-based access (Admin, Teacher, Student)
- Advanced reporting

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in backend/.env
PORT=5001
```

**Database connection failed:**
- Ensure database directory has write permissions
- Check file path in `db.js`

**CORS errors:**
- Verify proxy in `frontend/package.json`
- Check backend CORS configuration

## Support

For issues or questions, refer to the documentation or check logs in the console.

---

**Created for SIT Envoys Learning Platform** 📚
