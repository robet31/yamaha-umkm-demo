# Yamaha UMKM Demo App - Deployment Guide

**Live Demo:** (Will be updated after Vercel deployment)

## Overview

This is a **demo-only** React + Vite application for the Yamaha UMKM platform. It runs entirely in the browser with in-memory demo data—**no real database connection required**.

### Key Features

✅ **Customer Dashboard**: Browse vehicles, track jobs, view recommendations  
✅ **Admin Dashboard**: Create jobs, manage bookings, assign technicians  
✅ **Technician App**: View assigned jobs, update status, track in real-time  
✅ **Demo Mode**: Toggle via environment variable `VITE_USE_DEMO_DATA=true`  
✅ **Zero Backend**: No Supabase connection needed—all data is hardcoded  

---

## Quick Start (Local Development)

### Prerequisites
- Node.js v18+ 
- npm v10+

### Installation

```bash
# Clone the repository
git clone https://github.com/robet31/yamaha-umkm-demo.git
cd yamaha-umkm-demo

# Install dependencies
npm install

# Start dev server with demo mode
$env:VITE_USE_DEMO_DATA='true'
.\node_modules\.bin\vite --port 4000

# Or on Linux/Mac:
VITE_USE_DEMO_DATA=true npm run dev
```

Visit [http://localhost:4000](http://localhost:4000)

---

## User Roles & Demo Accounts

### 1. Customer Role
- **Email:** `customer@demo.com`
- **Password:** (any value, demo mode ignores passwords)
- **Access:** 
  - View personal dashboard
  - Manage vehicles
  - View booking history
  - Track job status
  - Get AI recommendations

### 2. Admin Role
- **Email:** `admin@demo.com`
- **Password:** (any value)
- **Access:**
  - Create new jobs
  - Assign technicians
  - Manage pending bookings
  - View real-time job updates
  - Analytics dashboard

### 3. Technician Role
- **Email:** `technician@demo.com`
- **Password:** (any value)
- **Access:**
  - View assigned jobs
  - Update job status
  - Real-time job tracking
  - Accept/reject assignments

### How to Switch Roles (Manual)

**Option 1: URL Parameter** (if implemented)
```
http://localhost:4000?user=admin@demo.com
http://localhost:4000?user=customer@demo.com
```

**Option 2: Edit `src/app/demo/demoData.ts`**
```typescript
// Change currentUser to any demo account
export const demoStore = {
  currentUser: {
    id: 'user_admin_001',
    email: 'admin@demo.com',
    role: 'admin',
  },
  // ... rest of data
}
```

**Option 3: Browser DevTools** (if role selector UI added)
- Look for role switcher in the app navbar
- Click toggle to change user role

---

## Production Build

### Build for Deployment

```bash
npm run build
```

Output: `dist/` folder (ready for Vercel)

### Deploy to Vercel

**Option 1: GitHub Integration (Recommended)**

1. Push code to GitHub:
   ```bash
   git remote add origin https://github.com/robet31/yamaha-umkm-demo.git
   git branch -M main
   git push -u origin main
   # (Use Personal Access Token or SSH key for authentication)
   ```

2. Import on Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Select GitHub repository: `yamaha-umkm-demo`
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Dir: `dist`

3. Add Environment Variables in Vercel:
   ```
   VITE_USE_DEMO_DATA = true
   ```

4. Deploy and get live URL!

**Option 2: Vercel CLI**

```bash
npm install -g vercel
vercel
# Follow prompts, set VITE_USE_DEMO_DATA=true when asked
```

---

## Demo Data

All demo data is hardcoded in [src/app/demo/demoData.ts](src/app/demo/demoData.ts):

### Sample Data Included
- **2 Users**: customer@demo.com, admin@demo.com
- **2 Vehicles**: Yamaha Service Motorcycle, Test Vehicle
- **2 Jobs**: Maintenance, Oil Change
- **Real-time Updates**: Simulated booking/job changes

### Modifying Demo Data

Edit `src/app/demo/demoData.ts` to add/change users, vehicles, or jobs:

```typescript
export const demoStore = {
  currentUser: { /* ... */ },
  users: [
    { id: 'user1', email: 'customer@demo.com', role: 'customer' },
    { id: 'user2', email: 'admin@demo.com', role: 'admin' },
    // Add more users here
  ],
  vehicles: [
    { id: 'v1', name: 'Yamaha Mio', model: '2023', owner_id: 'user1' },
    // Add more vehicles
  ],
  // ... etc
}
```

Then rebuild: `npm run build`

---

## Architecture

### Frontend Stack
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI + shadcn/ui
- **State**: React hooks + AuthContext
- **Charts**: Recharts
- **Notifications**: Sonner toasts

### Demo Mode Implementation

When `VITE_USE_DEMO_DATA=true`:
1. Supabase client is replaced with an in-memory mock
2. All API calls return demo data from `demoData.ts`
3. Auth is simulated (no real password validation)
4. Real-time updates are stubbed (return mock data)

File: [src/app/utils/supabase/client.tsx](src/app/utils/supabase/client.tsx)

---

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_USE_DEMO_DATA` | `true` | Enable in-memory demo mode |
| `VITE_SUPABASE_URL` | (unused in demo) | Original Supabase project URL |
| `VITE_SUPABASE_KEY` | (unused in demo) | Original Supabase anon key |

---

## Troubleshooting

### "vite not found" error
**Solution**: Use direct path:
```bash
.\node_modules\.bin\vite --port 4000
```

### Demo data not loading
**Solution**: Check environment variable:
```bash
echo $env:VITE_USE_DEMO_DATA  # Should print: true
```

### Changes not reflecting
**Solution**: Restart dev server:
1. Kill current process (Ctrl+C)
2. Run again with demo flag

### Git push authentication fails
**Solution**: Use Personal Access Token (PAT)
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic) with `repo` scope
3. Use token as password when prompted (or set git credential)

---

## File Structure

```
yamaha-umkm-demo/
├── src/
│   ├── app/
│   │   ├── components/           # React components
│   │   ├── pages/                # Route pages
│   │   ├── hooks/                # Custom hooks
│   │   ├── contexts/             # Context providers
│   │   ├── utils/
│   │   │   └── supabase/
│   │   │       └── client.tsx    # Demo mode shim
│   │   └── demo/
│   │       └── demoData.ts       # In-memory demo data
│   ├── styles/                   # Global CSS
│   └── main.tsx                  # App entry point
├── index.html                    # HTML template
├── vite.config.ts                # Vite configuration
├── package.json                  # Dependencies
└── postcss.config.mjs            # PostCSS config
```

---

## Next Steps

1. **Push to GitHub** (Use PAT for authentication)
2. **Deploy to Vercel** (Auto-deploy on main branch)
3. **Add Role Switcher UI** (Optional feature)
4. **Connect Real Database** (When needed, replace demo shim)

---

## Support

For issues or questions:
- Check demo data in `src/app/demo/demoData.ts`
- Verify environment variable: `VITE_USE_DEMO_DATA=true`
- Review Vite config in `vite.config.ts`

---

**Status**: ✅ Ready for demo/development  
**Database**: ❌ Not required (in-memory only)  
**Auth**: ✅ Simulated (no password check)  
**Deployment**: ✅ Vercel-ready
