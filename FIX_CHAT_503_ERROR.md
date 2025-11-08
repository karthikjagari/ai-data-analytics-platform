# Fix 503 Error - Chat Feature

## Current Error

```
503 Service Unavailable
```

This means the Vanna AI service is running, but the **Groq API key is not configured**.

## ✅ Quick Fix

### Step 1: Get Groq API Key

1. **Visit**: https://console.groq.com
2. **Sign up** (free account) or **Log in**
3. **Create API Key**:
   - Go to **"API Keys"** section
   - Click **"Create API Key"**
   - Copy the key (it starts with `gsk_...`)

### Step 2: Update Environment File

1. **Open**: `services/vanna/.env`
2. **Find the line**: `GROQ_API_KEY=your_groq_api_key_here`
3. **Replace with**: `GROQ_API_KEY=gsk_your_actual_key_here`
4. **Save the file**

### Step 3: Restart Vanna AI Service

1. **Stop** the current Vanna AI service (Ctrl+C in the terminal)
2. **Restart** it:
   ```powershell
   cd services\vanna
   .\venv\Scripts\activate
   python main.py
   ```

### Step 4: Test Again

1. Go to http://localhost:3000/chat
2. Try asking a question like: "What's the total spend?"
3. It should work now!

## 🔍 Verify Configuration

Check your `services/vanna/.env` file has:

```env
DATABASE_URL=postgresql://postgres:n624UIjwOdGqPkVY@db.dlpxzssrtsnvqddynsta.supabase.co:5432/postgres
GROQ_API_KEY=gsk_your_actual_key_here
PORT=8000
```

**Important**: 
- Replace `gsk_your_actual_key_here` with your real API key
- The key should start with `gsk_`
- No quotes needed around the key

## ⚠️ Alternative: Use Dashboard Without Chat

If you don't want to set up Groq API key right now:

- ✅ Dashboard works perfectly without it
- ✅ All charts and data visualization work
- ✅ Invoices table works
- ❌ Only "Chat with Data" feature needs the API key

You can add the API key later when you're ready to use the chat feature.

## 🎯 Current Status

- ✅ Vanna AI service is running
- ✅ Service is accessible
- ⏳ Waiting for Groq API key configuration

Once you add the API key and restart the service, the chat feature will work!

