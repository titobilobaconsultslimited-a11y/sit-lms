# 🚀 SIT LMS - Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Seed Database (Optional but Recommended)

```bash
cd backend
node seed.js
```

This adds:
- 5 sample courses
- 10 sample exams
- 100 sample questions

### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✓ Runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✓ Runs on http://localhost:3000

### Step 4: Access Application

Open browser and go to: **http://localhost:3000**

---

## 🧪 Test Login

**Option 1: Create New Account**
- Click "Sign up here"
- Fill in details
- You'll get a unique enrollment ID
- Example: `SIT/001/2026`

**Option 2: Use Seeded Test Data**
After running `seed.js`, create a user via signup and then use those credentials.

---

## 📊 Dashboard Overview

After login, you'll see:
- 📚 Enrolled courses count
- ✅ Exams completed count
- 🏆 Exams passed count
- 📈 Recent exam results

---

## 🎓 Taking an Exam

1. Go to **Courses** tab
2. Click on "My Courses"
3. Select a course
4. Click "Take Exam"
5. Answer all multiple-choice questions
6. Submit to see results

---

## 📋 Enrollment ID System

Each user gets a unique ID on signup:
- **Format:** `SIT/XXX/YYYY`
- **Example:** `SIT/001/2026`, `SIT/002/2026`
- **Stored in:** User profile and dashboard
- **Auto-incremented:** Per year

---

## 🎨 Color Theme

The application uses:
- 🟢 **Green** (#22c55e) - Primary actions
- 🟡 **Yellow** (#eab308) - Secondary highlights
- ⚪ **White** (#ffffff) - Background
- ⚫ **Dark** (#1f2937) - Text

---

## 📁 Project Structure

```
lms/
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── db.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

---

## ⚙️ Configuration

### Change Backend Port
Edit `backend/.env`:
```
PORT=5001
```

### Change Database Location
Edit `backend/db.js`:
```javascript
const dbPath = path.join(__dirname, 'your_db_path/lms.db');
```

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt
- Tokens expire in 7 days
- CORS enabled for localhost
- JWT authentication on protected routes

---

## 📞 Common Issues

**"Port 5000 already in use"**
- Change PORT in `.env` or kill process

**"Cannot find module"**
- Run `npm install` in that directory

**"Database locked"**
- Close other connections
- Restart the backend server

---

## 🎯 Next Steps

1. ✅ Seed database
2. ✅ Create test account
3. ✅ Enroll in a course
4. ✅ Take an exam
5. ✅ View results

Happy Learning! 🎓
