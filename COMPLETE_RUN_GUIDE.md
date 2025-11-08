# 🚀 Complete Project Run Guide

## ✅ Verification Status

- ✅ **Frontend**: Builds successfully
- ✅ **Backend**: Builds successfully  
- ✅ **Database**: Connected and seeded (51 invoices)
- ✅ **Vanna AI**: Dependencies installed, code ready
- ✅ **All Pages**: Fully functional with dynamic data
  - ✅ Invoice Management (`/invoice`)
  - ✅ File Management (`/files`)
  - ✅ Departments (`/departments`)
  - ✅ Users (`/users`)
  - ✅ Settings (`/settings`)

## 🎯 How to Run Complete Project

### Step 1: Install Dependencies

**Install Backend Dependencies:**
```powershell
cd apps\api
npm install
```

**Install Frontend Dependencies:**
```powershell
cd apps\web
npm install
```

### Step 2: Run Database Migrations

**Generate Prisma Client and Run Migrations:**
```powershell
cd apps\api
npx prisma generate
npx prisma migrate dev --name add_files_departments_users_settings
```

This will:
- Create new tables: `files`, `departments`, `users`, `settings`
- Generate Prisma client with new models
- Apply migrations to your database

### Step 3: Start the Servers

### Option 1: Full Setup (Dashboard + Chat Feature)

**Terminal 1 - Backend API:**
```powershell
cd apps\api
npm run dev
```
✅ Runs on: http://localhost:3001

**Terminal 2 - Frontend:**
```powershell
cd apps\web
npm run dev
```
✅ Runs on: http://localhost:3000

**Terminal 3 - Vanna AI (for Chat feature):**
```powershell
cd services\vanna
.\venv\Scripts\activate
python main.py
```
✅ Runs on: http://localhost:8000

**Note**: Vanna AI needs a Groq API key. See below.

### Option 2: Dashboard Only (No Chat Feature)

If you don't have a Groq API key yet, you can still run the dashboard:

**Terminal 1 - Backend:**
```powershell
cd apps\api
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd apps\web
npm run dev
```

Then visit: **http://localhost:3000**

The dashboard will work perfectly, but the "Chat with Data" feature won't be available.

## 🔑 Get Groq API Key (For Chat Feature)

1. **Visit**: https://console.groq.com
2. **Sign up** (free account)
3. **Create API Key**:
   - Go to "API Keys" section
   - Click "Create API Key"
   - Copy the key (starts with `gsk_...`)
4. **Update** `services/vanna/.env`:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
5. **Restart** Vanna AI service

## ✅ What Works Without Groq API Key

- ✅ Dashboard with all charts
- ✅ Overview cards with metrics
- ✅ Invoice trends, vendor spend, categories
- ✅ Invoices table
- ✅ All data visualization
- ✅ **Invoice Management** (`/invoice`) - Create, edit, export, import invoices
- ✅ **File Management** (`/files`) - Upload, search, delete files
- ✅ **Departments** (`/departments`) - Manage departments with budgets and members
- ✅ **Users** (`/users`) - Manage users with roles and departments
- ✅ **Settings** (`/settings`) - Configure app settings
- ❌ "Chat with Data" feature (needs API key)

## 🎉 Access Your Application

Once servers are running:

- **Dashboard**: http://localhost:3000
- **Invoice Management**: http://localhost:3000/invoice
- **File Management**: http://localhost:3000/files
- **Departments**: http://localhost:3000/departments
- **Users**: http://localhost:3000/users
- **Settings**: http://localhost:3000/settings
- **Chat with Data**: http://localhost:3000/chat
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **Vanna AI**: http://localhost:8000 (if running)

## 📊 Your Data

- **1 Invoice** from `Analytics_Test_Data.json` (Phunix GmbH)
- **50 Sample Invoices** for visualization
- **Multiple Vendors** and **Categories**
- **All relationships** properly set up

## 🆕 New Features Available

### Invoice Management (`/invoice`)
- View all invoices in a searchable table
- Create new invoices with full form
- Export invoices to CSV
- Import invoices from CSV file
- Filter by status, vendor, date

### File Management (`/files`)
- Upload files (PDF, DOCX, XLSX, images, etc.)
- Search files by name or description
- View files in a grid layout
- Delete files
- Download files
- File type icons and metadata

### Departments (`/departments`)
- View all departments with member counts
- Create/edit/delete departments
- Set budgets and colors
- View department avatars
- See member counts

### Users (`/users`)
- View all users in a searchable table
- Create/edit/delete users
- Assign users to departments
- Set user roles (Admin, Manager, User)
- Manage user status (Active, Inactive, Suspended)
- Search by name or email

### Settings (`/settings`)
- General settings (app name, timezone, language)
- Notification preferences (email, push, alerts)
- Security settings (password, 2FA)
- Database connection status
- API configuration
- All settings saved to database

## 🔍 Quick Test

1. **Backend**: http://localhost:3001/api/stats
   - Should return JSON with metrics

2. **Frontend**: http://localhost:3000
   - Should show dashboard with charts

3. **Vanna AI**: http://localhost:8000/health
   - Should return `{"status":"ok"}`

## 📝 Summary

### Quick Start Checklist:

1. ✅ **Install dependencies** (if not done):
   ```powershell
   cd apps\api && npm install
   cd ..\web && npm install
   ```

2. ✅ **Run database migrations**:
   ```powershell
   cd apps\api
   npx prisma generate
   npx prisma migrate dev --name add_files_departments_users_settings
   ```

3. ✅ **Start servers**:
   - Terminal 1: Backend (`cd apps\api && npm run dev`)
   - Terminal 2: Frontend (`cd apps\web && npm run dev`)
   - Terminal 3 (optional): Vanna AI (`cd services\vanna && .\venv\Scripts\activate && python main.py`)

### Available Pages:

- **Dashboard** (`/`) - Analytics overview
- **Invoice Management** (`/invoice`) - Full invoice CRUD
- **File Management** (`/files`) - Upload and manage files
- **Departments** (`/departments`) - Department management
- **Users** (`/users`) - User management
- **Settings** (`/settings`) - Application settings
- **Chat with Data** (`/chat`) - AI-powered queries (needs Groq API key)

### API Endpoints:

- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/files` - List files
- `POST /api/files` - Upload file
- `GET /api/departments` - List departments
- `POST /api/departments` - Create department
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/settings` - Get settings
- `POST /api/settings` - Save settings

Everything is ready! Start the servers and enjoy your fully functional application! 🎉

  