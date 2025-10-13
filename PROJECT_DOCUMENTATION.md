# VesselHire Dashboard - Complete Implementation Guide

## 🚀 Project Overview
Full-stack vessel hire and market rate dashboard with Django backend, MS SQL Server database, and React frontend.

---

## 📋 Implemented Features

### ✅ 1. User Authentication (JWT-based)
- **Login System**: Custom JWT authentication with role information
- **Token Management**: Access and refresh tokens
- **Role Detection**: Automatic admin/user role identification
- **Protected Routes**: All data endpoints require authentication

**Endpoints:**
- `POST /api/login/` - User login (returns JWT tokens)
- `POST /api/token/refresh/` - Refresh access token

---

### ✅ 2. Admin Data Entry Window

**Django Admin Panel** - Professional interface for admins to manage vessel data

**Access:** http://localhost:8000/admin/

**Features:**
- ✅ Add new vessel records
- ✅ Edit existing records
- ✅ Delete records
- ✅ Search by vessel name
- ✅ Filter by vessel name and date
- ✅ Date hierarchy navigation
- ✅ Clean organized form with fieldsets:
  - Vessel Information (name, date)
  - Rate Information (hire rate, market rate)

**How to Use:**
1. Login with admin credentials
2. Click "Vessel datas" under VESSELS section
3. Click "Add Vessel Data" button
4. Fill in the form and save

---

### ✅ 3. User Dashboard

**Access:** http://localhost:3000/dashboard

**Features:**
- ✅ Vessel dropdown selector
- ✅ Date range filters (from/to)
- ✅ Interactive line chart (Recharts)
  - Yellow line: Hire Rate
  - Blue line: Market Rate
  - Tooltips with exact values
  - Responsive design
- ✅ Auto-refresh when filters change
- ✅ Logout functionality

**API Endpoint:**
- `GET /api/vessels/?vessel={name}&start_date={date}&end_date={date}`

---

### ✅ 4. Admin Dashboard

**Access:** http://localhost:3000/admin-dashboard

**Features:**
- ✅ Admin-only access (requires is_staff or is_superuser)
- ✅ Aggregated view - Sum of all vessels per day
- ✅ Date range filtering
- ✅ Interactive line chart showing:
  - Total Hire Rate (all vessels combined)
  - Total Market Rate (all vessels combined)
- ✅ Auto-redirect non-admin users to regular dashboard

**API Endpoint:**
- `GET /api/vessels/aggregate/?start_date={date}&end_date={date}` (Admin only)

---

## 🗄️ Database Schema

**Table: VesselData**
```
- id (AutoField, Primary Key)
- vessel_name (CharField, max 100)
- date (DateField)
- hire_rate (IntegerField)
- market_rate (IntegerField)
```

**Database:** MS SQL Server
- Database: `vessalhire_db`
- User: `sa`
- Password: `Admin@123`
- Host: `localhost\SQLEXPRESS`

---

## 🔧 Technology Stack

**Backend:**
- Django 5.2.7
- Django REST Framework 3.16.1
- djangorestframework-simplejwt 5.5.1
- mssql-django 1.6
- pyodbc 5.2.0
- django-cors-headers 4.9.0

**Frontend:**
- React 19.2.0
- React Router 6.30.1
- Recharts 3.2.1
- Modern responsive UI

**Database:**
- Microsoft SQL Server

---

## 🎯 How to Run the Project

### 1. Activate Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
```

### 2. Start Django Backend
```powershell
python manage.py runserver
```
Backend runs on: http://localhost:8000

### 3. Start React Frontend (New Terminal)
```powershell
cd vesselhire_frontend
npm start
```
Frontend runs on: http://localhost:3000

### 4. Database Setup (First Time Only)
```powershell
# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Seed sample data (3 vessels × 30 days)
python manage.py seed_vessels
```

---

## 👥 User Roles & Access

### Regular User
- **Access:** User Dashboard only
- **Can:** View individual vessel data with filtering
- **Cannot:** Access admin dashboard or aggregated data

### Admin User (is_staff or is_superuser)
- **Access:** Both User & Admin Dashboards
- **Can:** 
  - View individual vessel data
  - View aggregated data across all vessels
  - Add/Edit/Delete vessel data via Django Admin Panel
  - Full CRUD operations

---

## 📊 Data Flow

1. **Login:** User enters credentials → JWT token generated → Stored in localStorage
2. **Dashboard Access:** Token sent with every API request → Backend validates → Returns data
3. **Admin Data Entry:** Admin logs into Django Admin → Adds vessel data → Saved to database
4. **Visualization:** Frontend fetches data → Recharts renders line graphs → Interactive tooltips

---

## 🔐 Authentication Flow

1. User enters username/password on login page
2. Selects dashboard type (User/Admin)
3. Backend validates credentials
4. JWT token generated with user role info (is_staff, is_superuser)
5. Token stored in localStorage
6. Frontend decodes token to check admin status
7. Redirects to appropriate dashboard
8. Protected routes verify token on every request

---

## 📡 API Endpoints Summary

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/login/` | POST | None | All | User login |
| `/api/token/refresh/` | POST | None | All | Refresh token |
| `/api/vessels/` | GET | Required | All | Get vessel data (filterable) |
| `/api/vessels/aggregate/` | GET | Required | Admin | Get aggregated data |
| `/admin/` | GET/POST | Required | Admin | Django admin panel |

---

## 🎨 UI Features

### Login Page
- Clean modern design
- Username/password inputs
- Dashboard type selection (User/Admin radio buttons)
- Error/success messages
- Auto-redirect if authenticated

### User Dashboard
- Vessel dropdown selector
- Date range pickers
- Responsive line chart
- Logout button (top-right)
- Clean card-based layout

### Admin Dashboard
- Date range filters
- Aggregated line chart
- Sum of all vessel rates per day
- Admin-only access indicator
- Logout button

### Django Admin Panel
- Professional Django admin interface
- List view with sorting
- Search and filters
- Date hierarchy
- Clean data entry forms

---

## 🧪 Testing the Application

### Test User Login
1. Go to http://localhost:3000
2. Enter credentials
3. Select "User" dashboard
4. Login
5. Verify vessel data displays

### Test Admin Login
1. Go to http://localhost:3000
2. Enter admin credentials
3. Select "Admin" dashboard
4. Login
5. Verify aggregated data displays

### Test Admin Data Entry
1. Go to http://localhost:8000/admin/
2. Login with admin credentials
3. Click "Vessel datas"
4. Click "Add Vessel Data"
5. Fill form and save
6. Verify data appears in frontend dashboards

---

## 📦 Sample Data

**Seeded Vessels:**
- Evergreen
- Poseidon
- ExcelMarine

**Data Range:** 30 days (from today backwards)

**Rate Ranges:**
- Hire Rate: $15,000 - $25,000
- Market Rate: $14,000 - $26,000

---

## ✅ Assignment Requirements Checklist

- ✅ Django backend with MS SQL Server
- ✅ User authentication (JWT-based)
- ✅ Protected API endpoints
- ✅ VesselData table with required schema
- ✅ Seed data (3 vessels × 30 days)
- ✅ React login form
- ✅ Token storage in localStorage
- ✅ Dashboard with vessel/date filters
- ✅ Line chart with hire & market rates
- ✅ Tooltips on hover
- ✅ **BONUS:** Admin-only aggregated view
- ✅ **BONUS:** Role-based access control
- ✅ **BONUS:** Admin data entry window (Django Admin)

---

## 🚀 Next Steps for Docker Deployment

### Dockerfile for Django (backend)
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### Dockerfile for React (frontend)
```dockerfile
FROM node:18
WORKDIR /app
COPY vesselhire_frontend/package*.json ./
RUN npm install
COPY vesselhire_frontend/ .
CMD ["npm", "start"]
```

### docker-compose.yml (to be created)
```yaml
version: '3.8'
services:
  mssql:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      ACCEPT_EULA: Y
      SA_PASSWORD: Admin@123
  backend:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - mssql
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

---

## 📝 Notes

- Virtual environment: `venv/` (excluded from Git)
- Frontend runs on port 3000
- Backend runs on port 8000
- Database: MS SQL Server (localhost\SQLEXPRESS)
- CORS enabled for localhost:3000

---

## 🎉 Success!

Your VesselHire Dashboard is fully functional with all features implemented:
- ✅ Authentication & Authorization
- ✅ Admin Data Entry (Django Admin)
- ✅ User Dashboard with Charts
- ✅ Admin Dashboard with Aggregated Data
- ✅ Complete CRUD Operations
- ✅ Modern Responsive UI

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin/


