# 🚀 Quick Start Guide

## Method 1: Use the Start Script (Easiest)

Simply run the PowerShell script:

```powershell
.\start-all-services.ps1
```

This will automatically start all 3 services in separate windows:
- ✅ Backend API (port 3001)
- ✅ Frontend (port 3000)
- ✅ Vanna AI Chat Service (port 8000)

Then visit: **http://localhost:3000**

---

## Method 2: Manual Start (3 Terminals)

### Terminal 1 - Backend API
```powershell
cd apps\api
npm run dev
```
✅ Runs on: http://localhost:3001

### Terminal 2 - Frontend
```powershell
cd apps\web
npm run dev
```
✅ Runs on: http://localhost:3000

### Terminal 3 - Vanna AI (Chat Feature)
```powershell
cd services\vanna
.\venv\Scripts\activate
python main.py
```
✅ Runs on: http://localhost:8000

---

## 📋 First Time Setup

If you haven't installed dependencies yet:

### 1. Install Backend Dependencies
```powershell
cd apps\api
npm install
```

### 2. Install Frontend Dependencies
```powershell
cd apps\web
npm install
```

### 3. Setup Database (if needed)
```powershell
cd apps\api
npx prisma generate
npx prisma migrate dev
```

### 4. Setup Vanna AI (if needed)
```powershell
cd services\vanna
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Make sure `services/vanna/.env` has:
```env
DATABASE_URL=your_database_url
GROQ_API_KEY=your_groq_api_key
PORT=8000
```

---

## ✅ Verify Everything is Running

1. **Backend**: http://localhost:3001/health
   - Should return: `{"status":"ok"}`

2. **Frontend**: http://localhost:3000
   - Should show the dashboard

3. **Vanna AI**: http://localhost:8000/health
   - Should return: `{"status":"ok"}`

---

## 🎯 Access Your Application

Once running, visit:
- **Dashboard**: http://localhost:3000
- **Invoice Management**: http://localhost:3000/invoice
- **Files**: http://localhost:3000/files
- **Departments**: http://localhost:3000/departments
- **Users**: http://localhost:3000/users
- **Settings**: http://localhost:3000/settings
- **Chat with Data**: http://localhost:3000/chat

---

## 📱 Responsive Design

The app is now fully responsive! Test on:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop screens

The sidebar automatically becomes a hamburger menu on mobile devices.

---

## 🆘 Troubleshooting

### Port Already in Use?
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Vanna AI Not Starting?
- Check `services/vanna/.env` exists
- Verify `DATABASE_URL` and `GROQ_API_KEY` are set
- Make sure Python virtual environment is activated

### Frontend Not Loading?
- Make sure backend is running first
- Check browser console for errors
- Try hard refresh: `Ctrl + F5`

---

## 🎉 That's It!

Your application should now be running and fully responsive on all devices!
