# 📦 Deployment Guide

## Deploying SIT LMS to Production

### Option 1: Deploy on Vercel + Heroku

#### Deploy Frontend on Vercel

1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Connect GitHub account
4. Select the frontend folder
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.herokuapp.com
   ```
6. Deploy

#### Deploy Backend on Heroku

1. Create Heroku account
2. Install Heroku CLI
3. Run:
   ```bash
   cd backend
   heroku login
   heroku create your-app-name
   heroku config:set JWT_SECRET=your_secure_secret
   git push heroku main
   ```

### Option 2: Deploy on AWS

#### Backend (EC2)
```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone your-repo
cd lms/backend
npm install
npm start
```

#### Frontend (S3 + CloudFront)
```bash
cd frontend
npm run build
# Upload build/ to S3
# Configure CloudFront distribution
```

### Option 3: Deploy on DigitalOcean

```bash
# Create App Platform app
# Connect GitHub repo
# Set environment variables
# Deploy automatically
```

---

## Environment Variables

### Backend (.env)
```
PORT=8000
JWT_SECRET=your_super_secret_key_min_32_chars
NODE_ENV=production
DATABASE_URL=path_to_your_database
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-production-api.com
```

---

## Database Setup for Production

1. **Use PostgreSQL instead of SQLite:**
   ```bash
   npm install pg pg-pool
   ```
   Update `db.js` to use PostgreSQL

2. **Backup Strategy:**
   - Enable automated backups
   - Backup daily to external storage

3. **Security:**
   - Use environment variables for credentials
   - Enable SSL/TLS
   - Restrict database access

---

## SSL/HTTPS Setup

### Using Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

---

## Monitoring & Maintenance

- **Uptime Monitoring:** Use UptimeRobot
- **Error Tracking:** Integrate Sentry
- **Performance:** Use New Relic or DataDog
- **Logs:** Centralize with LogRocket

---

## Performance Optimization

1. **Frontend:**
   - Enable gzip compression
   - Minify CSS/JS
   - Use CDN for assets
   - Lazy load components

2. **Backend:**
   - Enable caching
   - Use load balancer
   - Database indexing
   - Connection pooling

---

## Scaling

For large user base:
- Use microservices architecture
- Implement message queues
- Cache with Redis
- Use CDN
- Database replication
