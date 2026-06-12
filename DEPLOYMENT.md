# Deployment Guide — CockroachDB + Render + Vercel

## Stack
- **Database**: CockroachDB (free forever, 10 GB)
- **Backend**: Node.js + Express → hosted on Render (free tier)
- **Frontend**: React + Vite → hosted on Vercel (free tier)

---

## Step 1: Set Up CockroachDB (Free Forever)

1. Go to https://cockroachlabs.cloud and sign up (free, no credit card)
2. Click **Create Cluster** → choose **Serverless** (free tier)
3. Select region closest to you → click **Create Cluster**
4. Once created, click **Connect** → choose **Connection String**
5. Copy the connection string — it looks like:
   ```
   postgresql://username:password@free-tier.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
   ```
6. Open the **SQL Shell** tab in the CockroachDB console
7. Paste the entire contents of `backend/config/schema.sql` and run it
   - This creates all tables and seeds sample products

---

## Step 2: Deploy Backend on Render (Free Tier)

1. Push your project to GitHub (include the `backend/` folder)
2. Go to https://render.com and sign up
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
6. Add **Environment Variables** (click "Add Environment Variable"):
   ```
   DATABASE_URL     = postgresql://username:password@...cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
   JWT_SECRET       = any_long_random_string_eg_abc123xyz789
   FRONTEND_URL     = https://your-app.vercel.app  (update after Vercel deploy)
   RAZORPAY_KEY_ID  = your_razorpay_key_id
   RAZORPAY_KEY_SECRET = your_razorpay_key_secret
   NODE_ENV         = production
   ```
7. Click **Create Web Service**
8. Wait for deploy → copy your Render URL: `https://unified-portal-backend.onrender.com`

> ⚠️ Free Render instances sleep after 15 min of inactivity. First request after sleep takes ~30s.

---

## Step 3: Deploy Frontend on Netlify

1. Go to https://netlify.com and sign up
2. Click **Add new site** → **Import an existing project** → connect GitHub
3. Select your repo
4. Configure (auto-detected from `netlify.toml`):
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
5. Click **Add environment variables** → add:
   ```
   VITE_API_URL          = https://unified-portal-backend.onrender.com
   VITE_RAZORPAY_KEY_ID  = your_razorpay_key_id
   ```
6. Click **Deploy site**
7. Copy your Netlify URL: `https://your-app.netlify.app`

> The `netlify.toml` file already handles:
> - Node 22 version pinning
> - SPA redirect rules (all routes → index.html)
> - Build command and publish directory

## Step 3b: Deploy Frontend on Vercel (alternative)

1. Go to https://vercel.com and sign up
2. Click **Add New** → **Project** → import your GitHub repo
3. Framework Preset: **Vite**, Root Directory: `.`
4. Add Environment Variables:
   ```
   VITE_API_URL          = https://unified-portal-backend.onrender.com
   VITE_RAZORPAY_KEY_ID  = your_razorpay_key_id
   ```
5. Click **Deploy**

---

## Step 4: Update CORS on Backend

1. Go to Render dashboard → your service → **Environment**
2. Update `FRONTEND_URL` to your actual Vercel URL
3. Render will auto-redeploy

---

## Step 5: Test the App

Visit your Vercel URL and test:
- ✅ Register / Login
- ✅ Property buyer/seller registration
- ✅ Browse properties
- ✅ Matrimonial profile + payment
- ✅ Browse profiles with swipe
- ✅ Add to cart + checkout
- ✅ Admin dashboard

---

## Local Development

### Backend
```bash
cd backend
npm install
# Edit .env with your CockroachDB connection string
npm run dev   # runs on http://localhost:5000
```

### Frontend
```bash
# In root directory
npm install
# Edit .env — set VITE_API_URL=http://localhost:5000
npm run dev   # runs on http://localhost:5173
```

---

## Environment Variables Summary

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://...cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
JWT_SECRET=your_long_random_secret
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
```

### Frontend (`.env`)
```
VITE_API_URL=https://unified-portal-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

## CockroachDB Free Tier Limits
| Resource | Free Limit |
|----------|------------|
| Storage  | 10 GB      |
| RAM      | Shared     |
| Request Units | 50M/month |
| Data persistence | Forever |
| Rows | No limit |

10 GB is enough for **100,000+ user registrations** with all data.
