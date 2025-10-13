# 🚀 VesselHire - Quick Start Guide

## Daily Development Workflow

### 🔧 Start Development

```powershell
# 1. Activate Virtual Environment
.\venv\Scripts\Activate.ps1

# 2. Start Django Backend (Terminal 1)
python manage.py runserver

# 3. Start React Frontend (Terminal 2)
cd vesselhire_frontend
npm start
```

**Access:**
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:8000/admin/
- API: http://localhost:8000/api/

---

## 👤 User Accounts

### Create Admin User (First Time)
```powershell
python manage.py createsuperuser
```

### Create Regular User
Use Django Admin Panel at http://localhost:8000/admin/auth/user/add/

---

## 📊 Managing Vessel Data

### Option 1: Django Admin Panel (Recommended for Admins)
1. Go to: http://localhost:8000/admin/
2. Login with admin credentials
3. Click "Vessel datas"
4. Click "Add Vessel Data" button
5. Fill in:
   - Vessel name (e.g., "Evergreen")
   - Date
   - Hire rate (e.g., 20000)
   - Market rate (e.g., 19000)
6. Click "Save"

### Option 2: Command Line (Seed Sample Data)
```powershell
python manage.py seed_vessels
```
This creates 3 vessels × 30 days of random data

---

## 🎯 Testing the Application

### Test User Dashboard
1. Open http://localhost:3000
2. Login with any credentials
3. Select "User" dashboard
4. Use filters:
   - Select vessel from dropdown
   - Choose date range
5. View line chart with hire/market rates

### Test Admin Dashboard  
1. Open http://localhost:3000
2. Login with **admin** credentials
3. Select "Admin" dashboard
4. View aggregated chart (all vessels combined)
5. Filter by date range

---

## 🛠️ Common Commands

### Database
```powershell
# Run migrations
python manage.py migrate

# Create migrations (after model changes)
python manage.py makemigrations

# Reset database (delete all vessel data)
python manage.py shell
>>> from vessels.models import VesselData
>>> VesselData.objects.all().delete()
>>> exit()
```

### Virtual Environment
```powershell
# Activate
.\venv\Scripts\Activate.ps1

# Deactivate
deactivate

# Install new package
pip install package_name

# Update requirements.txt
pip freeze > requirements.txt
```

### Git
```powershell
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push to remote
git push

# Pull from remote
git pull
```

---

## 📱 Application Flow

### 1. Login Flow
```
User enters credentials → JWT token generated → Stored in localStorage → Redirected to dashboard
```

### 2. User Dashboard Flow
```
Select vessel → Choose date range → API call with filters → Data returned → Chart rendered
```

### 3. Admin Dashboard Flow
```
Choose date range → API call for aggregated data → Sum calculated → Chart rendered
```

### 4. Data Entry Flow (Admin)
```
Login to admin panel → Add vessel data → Save to database → Appears in frontend dashboards
```

---

## 🔐 API Quick Reference

### Login
```bash
POST http://localhost:8000/api/login/
Body: {"username": "admin", "password": "yourpassword"}
Response: {"access": "token", "refresh": "token"}
```

### Get Vessel Data (Authenticated)
```bash
GET http://localhost:8000/api/vessels/
Headers: Authorization: Bearer <access_token>

# With filters
GET http://localhost:8000/api/vessels/?vessel=Evergreen&start_date=2025-09-10&end_date=2025-10-10
```

### Get Aggregated Data (Admin Only)
```bash
GET http://localhost:8000/api/vessels/aggregate/
Headers: Authorization: Bearer <access_token>

# With filters
GET http://localhost:8000/api/vessels/aggregate/?start_date=2025-09-10&end_date=2025-10-10
```

---

## ❌ Troubleshooting

### Frontend Can't Connect to Backend
- Verify Django is running on port 8000
- Check CORS settings in `settings.py`
- Verify `CORS_ALLOW_ALL_ORIGINS = True`

### Authentication Fails
- Check user credentials
- Verify JWT tokens are being stored in localStorage
- Check browser console for errors

### No Data in Charts
- Verify database has vessel data
- Run: `python manage.py seed_vessels`
- Check date filters match data range

### Database Connection Error
- Verify SQL Server is running
- Check connection settings in `settings.py`
- Ensure ODBC Driver 17 is installed

### Port Already in Use
```powershell
# Find process on port 8000
netstat -ano | findstr :8000

# Kill process (use PID from above)
taskkill /PID <pid> /F
```

---

## 📋 Pre-deployment Checklist

- [ ] Virtual environment activated
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Sample data seeded
- [ ] Django backend running (port 8000)
- [ ] React frontend running (port 3000)
- [ ] Can login successfully
- [ ] User dashboard displays charts
- [ ] Admin dashboard shows aggregated data
- [ ] Admin panel accessible for data entry

---

## 🎉 You're Ready!

Your VesselHire Dashboard is fully operational!

**Quick Access:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Admin Panel: http://localhost:8000/admin/
- 📊 API Docs: See PROJECT_DOCUMENTATION.md

**Need Help?**
- Check PROJECT_DOCUMENTATION.md for detailed info
- Review terminal logs for errors
- Verify all services are running


