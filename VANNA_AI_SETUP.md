# ✅ Vanna AI Service - Setup Complete!

## ✅ What's Done

- ✅ Python virtual environment created
- ✅ All dependencies installed (including `groq`)
- ✅ `.env` file created
- ✅ Database connection configured

## 🔑 Next Step: Get Groq API Key

The service needs a Groq API key to work. Here's how to get one:

### Step 1: Sign Up for Groq
1. Go to: **https://console.groq.com**
2. Sign up (free account)
3. Verify your email if required

### Step 2: Create API Key
1. In Groq Console, go to **"API Keys"** section
2. Click **"Create API Key"**
3. Copy the key (it starts with `gsk_...`)

### Step 3: Update .env File
1. Open `services/vanna/.env`
2. Replace `your_groq_api_key_here` with your actual API key:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
3. Save the file

## 🚀 Start Vanna AI Service

Once you have the API key:

```powershell
cd services\vanna
.\venv\Scripts\activate
python main.py
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## ✅ Verify It Works

1. **Health Check**: http://localhost:8000/health
   - Should return: `{"status":"ok"}`

2. **Test from Backend**:
   - Make sure backend is running
   - Go to http://localhost:3000/chat
   - Try asking: "What's the total spend?"

## 📋 Complete Project Run (All 3 Services)

### Terminal 1 - Backend API:
```powershell
cd apps\api
npm run dev
```

### Terminal 2 - Frontend:
```powershell
cd apps\web
npm run dev
```

### Terminal 3 - Vanna AI (Optional):
```powershell
cd services\vanna
.\venv\Scripts\activate
python main.py
```

## ⚠️ Without Groq API Key

If you don't have a Groq API key yet:
- ✅ Dashboard will work perfectly
- ✅ All charts and data will display
- ❌ "Chat with Data" feature won't work
- You can add the API key later

## 🎯 Current Status

- ✅ Dependencies installed
- ✅ Service code ready
- ⏳ Waiting for Groq API key

Once you add the API key, the Chat feature will work!

