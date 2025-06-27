# Vercel Deployment Guide for AlgoSync Backend

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Have a Vercel account (sign up at vercel.com)
3. MongoDB database (MongoDB Atlas recommended)

## Environment Variables Setup

Before deploying, make sure to set up these environment variables in Vercel:

1. `MONGO_URI` - Your MongoDB connection string
2. `JWT_SECRET` - Secret key for JWT token generation
3. `CORS_ORIGIN` - Your frontend URL (e.g., https://algosyncv1.vercel.app)
4. `NODE_ENV` - Set to "production"

## Deployment Steps

### Method 1: Using Vercel CLI (Recommended)

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: algosync-backend (or your preferred name)
   - Directory: ./ (current directory)

5. Set environment variables:
   ```bash
   vercel env add MONGO_URI
   vercel env add JWT_SECRET
   vercel env add CORS_ORIGIN
   vercel env add NODE_ENV
   ```

6. Deploy to production:
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to vercel.com and create a new project
3. Import your GitHub repository
4. Set the root directory to `Backend`
5. Configure environment variables in the dashboard
6. Deploy

## Post-Deployment

1. Update your frontend API base URL to point to your new Vercel backend URL
2. Test all API endpoints to ensure they're working correctly
3. Update CORS settings if needed

## Troubleshooting

- If you get CORS errors, make sure `CORS_ORIGIN` is set correctly
- If database connection fails, verify your `MONGO_URI` is correct
- Check Vercel function logs for any runtime errors

## API Endpoints

Your API will be available at: `https://your-project-name.vercel.app`

- Health check: `GET /api/health`
- Auth routes: `POST /api/auth/register`, `POST /api/auth/login`
- Questions: `GET /api/questions`, `POST /api/questions`
- Notes: `GET /api/notes`, `POST /api/notes`
- AI: `POST /api/ai/chat` 