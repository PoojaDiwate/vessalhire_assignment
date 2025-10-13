# 🚢 Vessel Hire Dashboard

A full-stack web application for tracking and visualizing vessel hire and market rates with authentication and admin features.

## 📋 Features

- **User Authentication** - Login with JWT token storage
- **Interactive Dashboard** - View vessel rates with beautiful charts
- **Date Range Filtering** - Filter data by custom date ranges
- **Admin Panel** - Add new vessel data (admin only)
- **Responsive Design** - Works on all devices
- **Mock Data** - 3 vessels with 30 days of data for testing

## 🚀 Quick Start

### Frontend (React)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:3000`

### Demo Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**User Account:**
- Username: `user`
- Password: `user123`

## 🎨 Features

### Login Page
- Secure authentication
- Token storage in localStorage
- Role-based access (admin/user)

### Dashboard
- Select vessel from dropdown
- Filter by date range
- Interactive line chart (Recharts)
  - Yellow line: Hire Rate
  - Blue line: Market Rate
- Real-time statistics
- Hover tooltips with exact values

### Admin Panel (Admin Only)
- Add data for existing vessels
- Create new vessels
- Input hire and market rates
- Instant updates to dashboard

## 📊 Tech Stack

- **Frontend:** React 18
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Build Tool:** Vite
- **Styling:** CSS3 (Custom)

## 🔧 Backend Integration

Currently using **mock data** stored in localStorage. To connect to a real backend:

1. Update `src/data/mockData.js` with API calls
2. Replace localStorage operations with fetch/axios calls
3. Update authentication to use real JWT tokens

## 📁 Project Structure

```
src/
├── components/
│   ├── Login.jsx          # Login page component
│   ├── Login.css
│   ├── Dashboard.jsx      # Main dashboard
│   ├── Dashboard.css
│   ├── AdminPanel.jsx     # Admin panel
│   └── AdminPanel.css
├── data/
│   └── mockData.js        # Mock data & API functions
├── App.jsx                # Main app with routing
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## 🎯 Assignment Requirements

✅ User login with authentication  
✅ Protected routes  
✅ Vessel data display  
✅ Line chart with hire & market rates  
✅ Dropdown vessel selector  
✅ Date range filtering  
✅ Admin panel for data entry  
✅ Token storage in localStorage  
✅ Responsive design  

## 📝 Notes

- All data is stored in browser localStorage
- 3 vessels come pre-loaded with 30 days of data
- Admin can add unlimited vessel data
- Charts automatically update when data changes

## 🔮 Future Enhancements

- Connect to Django REST API
- Real database (MS SQL Server)
- User registration
- Data export functionality
- Advanced analytics

---

Built with ❤️ for Vessel Hire Management




