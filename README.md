# Golf Charity Subscription Platform — Drive For Good


## 🌍 Live Demo

| Link | URL |
|------|-----|
| **🎨 Frontend (Vercel)** | https://drive-for-good-2c1s.vercel.app/ |
| **⚙️ Backend API (Render)** | https://drive-for-good.onrender.com/api |




## 📋 Project Overview

**Drive For Good** is a modern subscription platform combining golf performance tracking, monthly prize draws, and charitable giving. 

### Features---
- User authentication (register/login/JWT)
- Subscription management (monthly/yearly)
- Real Razorpay test-mode payment checkout + verification
- Stableford score entry (1-45 range, latest 5 auto-retained)
- Monthly draw system (random & algorithmic modes)
- 3-tier prize pools with jackpot rollover
- Charity selection (min 10% to max 100%) + contribution tracking
- Winner verification workflow with proof uploads
- Admin dashboard (users, draws, winners, charities, analytics)
- User dashboard (subscription, scores, winnings, participation)
- 6 seeded charity partners with full details
- Responsive mobile-first UI
- Legal pages: Privacy Policy, Terms & Conditions, Responsible Gaming
- FAQ and Charity showcase

---

**Test Credentials:**
- Admin: `admin@driveforgood.app` / `admin123`
- User: `test@driveforgood.app` / `admin123`

---

## 🚀 Quick Start

### Backend
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your values (or use provided Supabase/Razorpay test keys)
npm run dev
```
Backend: `http://localhost:5000`

### Frontend
```bash
cd Frontend
npm install
npm run dev
```
Frontend: `http://localhost:5173`

---

## 🎯 Default Credentials

| Account | Email | Password |
|---------|-------|----------|
| Admin | admin@driveforgood.app | admin123 |
| Test User | test@driveforgood.app | admin123 |

---

## 🔑 Test Razorpay Credentials

Test API keys are pre-populated in `Backend/.env`:
- **Key ID:** `rzp_test_SYjtcnyeeU7Pav`
- **Key Secret:** `ueKfhKsZ2le7HG0vmXYR1E0o`

Use test card: `4111111111111111` (any expiry/CVV)

---

## 📁 Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js (config loader)
│   │   │   └── seedContent.js (charities, FAQ, platform content)
│   │   ├── controllers/ (auth, user, draw, admin, charity)
│   │   ├── middlewares/ (auth, role checks)
│   │   ├── models/ (validators via Zod)
│   │   ├── routes/ (API endpoints)
│   │   ├── services/ (dataStore, draw logic, Razorpay)
│   │   └── app.js (Express app)
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/ (Login, Register, ProtectedRoute)
│   │   │   ├── public/ (Landing, FAQ, Charities, Legal)
│   │   │   ├── dashboard/ (User Dashboard)
│   │   │   ├── admin/ (Admin Dashboard)
│   │   │   └── shared/ (API client)
│   │   ├── app.routes.jsx (router)
│   │   └── style.scss (complete styling)
│   └── index.html
├── supabase-schema.sql (production SQL schema + RLS)
├── SUBMISSION_GUIDE.md (deployment checklist)
├── UPLOAD_READY_CHECKLIST.md (pre-upload validation)
└── Frontend/public/
    ├── PRIVACY_POLICY.md
    ├── TERMS_CONDITIONS.md
    └── RESPONSIBLE_GAMING.md
```

---

## 🎨 Design System

**Colors:**
- Primary Accent: `#ff6b35` (vibrant orange)
- Secondary Accent: `#00a896` (teal)
- Background: `#f7f4ef` (warm cream)
- Ink: `#0f172a` (dark navy)

**Typography:**
- Headings: Space Grotesk (bold, modern)
- Body: Outfit (clean, friendly)

**Aesthetic:**
- None of the traditional golf website clichés
- Modern, emotion-driven interface
- Smooth animations and micro-interactions
- Mobile-first, fully responsive

---


---

## 🔐 Security

- JWT token-based authentication
- Razorpay signature verification for payments
- Role-based access control (user/admin)
- Active subscription validation on protected endpoints
- Zod schema validation on all inputs
- Environment variables for sensitive data

---

## 🗄️ Data Persistence

**Current:** JSON file datastore (ready for immediate testing)
**Production:** Supabase PostgreSQL with RLS policies (schema provided)

Switch to Supabase by updating backend environment and using the provided `supabase-schema.sql`.

---

## 📧 Email Notifications (Future)

Ready for integration. Required .env vars:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`

---

## 🚀 Deployment

### Vercel (Frontend)
1. Connect GitHub repo
2. Set `VITE_API_URL` environment variable
3. Deploy `Frontend/` folder

### Render.com or Railway.app (Backend)
1. Connect GitHub repo
2. Set all backend environment variables
3. Deploy `Backend/` folder

See [SUBMISSION_GUIDE.md](SUBMISSION_GUIDE.md) for detailed steps.

---

## 📝 What You Need to Provide

1. **Email SMTP Credentials** (for notifications)
2. **Razorpay Production Keys** (for live payments)
3. **Deployment Domains** (frontend, backend)
4. **Optional:** Custom logo, colors, or charity images

---

## ✨ Key Features

- ⚡ Fast, responsive interface
- 💰 Real prize payouts via Razorpay
- ❤️ Direct charity support
- 📊 Admin analytics and controls
- 🔐 Secure, verified gameplay
- 📱 Mobile-first design
- ♿ Accessible UI patterns

---




**Last Updated:** April 4, 2026

# Drive-For-Good
