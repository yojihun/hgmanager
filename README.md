# HGManager — Home Ground Baseball Management System

A web-based management system for baseball training centers with KakaoTalk bot integration for parent communication.

## Quick Start

### 1. Set Up Environment Variables

Create a Neon PostgreSQL database and generate an admin password hash.

**Create Database:**
1. Go to [neon.tech](https://neon.tech) and sign up (free tier available)
2. Create a new PostgreSQL database
3. Copy the connection string and add it to `.env`:

```bash
DATABASE_URL="postgresql://user:password@host/database"
```

**Generate Admin Password:**
```bash
npm run hash-password YOUR_ADMIN_PASSWORD
```
Copy the output and add to `.env` as `ADMIN_PASSWORD_HASH`

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

Add to `.env` as `NEXTAUTH_SECRET`

### 2. Complete `.env` File

```
DATABASE_URL="your-neon-connection-string"
ADMIN_PASSWORD_HASH="your-bcrypt-hash"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
KAKAO_REST_API_KEY="fd507cdc26e4a31047b80d5497159c25"
KAKAO_CHANNEL_PUBLIC_ID=""
KAKAO_ADMIN_KEY=""
```

### 3. Initialize Database

```bash
npx prisma migrate dev --name init
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your admin password.

## Kakao Setup

### Create KakaoTalk Channel

1. Go to [Kakao Business](https://business.kakao.com)
2. Create a new KakaoTalk Channel (카카오채널)
3. Go to [Kakao i Open Builder](https://chatbot.kakao.com)
4. Create a chatbot connected to your channel

### Configure Webhook

In Kakao i Open Builder:
- Go to "기능 설정" → "HTTP 스킬"
- Set Webhook URL: `https://your-domain.vercel.app/api/kakao/webhook`

(Get the real URL after deploying to Vercel)

## Deploy to Vercel

```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin <github-repo>
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add environment variables
4. Deploy

Update Kakao webhook URL with your Vercel domain after deployment.

## Features

- **Admin Dashboard**: Track attendance, manage kids, create sessions
- **KakaoTalk Bot**: Parents self-register and respond to attendance polls
- **Attendance Tracking**: See who's attending and needs pickup
- **Notifications**: Send reminders to parents via KakaoTalk

## Next Steps

1. Set up Neon database
2. Configure `.env`
3. Run `npm run dev`
4. Add kids in the dashboard
5. Set up Kakao channel and connect webhook
6. Deploy to Vercel
