# 🐳 Vessel Hire Application - Docker Deployment

This document provides instructions for deploying the Vessel Hire Application using Docker Compose with Django, React, MS SQL Server, and Nginx.

## 📋 Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** (included with Docker Desktop)
- **Git** (for cloning the repository)
- **8GB+ RAM** (recommended for MS SQL Server)

## 🚀 Quick Start

### 1. Clone and Navigate to Project
```bash
git clone <repository-url>
cd vesselhire_assignment
```

### 2. Start All Services
```bash
# Make the script executable (Linux/Mac)
chmod +x docker-commands.sh

# Start all services
./docker-commands.sh start
```

### 3. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Django Admin**: http://localhost/admin
- **Database**: localhost:1433

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Nginx      │    │    React App    │    │  Django API     │
│   (Port 80)     │    │   (Port 3000)   │    │   (Port 8000)   │
│  Reverse Proxy  │    │   Frontend      │    │    Backend      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MS SQL Server │
                    │   (Port 1433)   │
                    │    Database     │
                    └─────────────────┘
```

## 🛠️ Services

### 1. **Database (MS SQL Server)**
- **Image**: `mcr.microsoft.com/mssql/server:2022-latest`
- **Port**: 1433
- **Credentials**: 
  - Username: `sa`
  - Password: `YourStrong@Passw0rd123`
  - Database: `vesselhire_db`

### 2. **Backend (Django)**
- **Image**: Custom built from `Dockerfile.backend`
- **Port**: 8000
- **Features**: REST API, Admin Panel, Database migrations

### 3. **Frontend (React)**
- **Image**: Custom built from `Dockerfile.frontend`
- **Port**: 3000
- **Features**: Modern UI, Interactive charts, Responsive design

### 4. **Nginx (Reverse Proxy)**
- **Image**: `nginx:alpine`
- **Port**: 80 (HTTP), 443 (HTTPS)
- **Features**: Load balancing, Static file serving, SSL termination

## 📁 File Structure

```
vesselhire_assignment/
├── Dockerfile.backend          # Django container
├── Dockerfile.frontend         # React container
├── docker-compose.yml          # Multi-container orchestration
├── nginx.conf                  # Nginx configuration
├── .dockerignore              # Docker ignore patterns
├── docker-commands.sh         # Management script
├── env.docker                 # Environment variables
├── init.sql                   # Database initialization
└── README-Docker.md           # This file
```

## 🔧 Management Commands

### Using the Management Script
```bash
# Start all services
./docker-commands.sh start

# Stop all services
./docker-commands.sh stop

# Restart services
./docker-commands.sh restart

# View logs
./docker-commands.sh logs
./docker-commands.sh logs backend

# Access database
./docker-commands.sh db

# Run Django commands
./docker-commands.sh django migrate
./docker-commands.sh django createsuperuser

# Check health
./docker-commands.sh health

# Cleanup (removes everything)
./docker-commands.sh cleanup
```

### Using Docker Compose Directly
```bash
# Build and start
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Execute commands in containers
docker-compose exec backend python manage.py migrate
docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123'
```

## 🗄️ Database Management

### Initial Setup
```bash
# Run migrations
./docker-commands.sh django migrate

# Create superuser
./docker-commands.sh django createsuperuser

# Load sample data (if available)
./docker-commands.sh django loaddata sample_data.json
```

### Accessing Database
```bash
# Using management script
./docker-commands.sh db

# Using Docker Compose directly
docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123'

# Using external tools
# Server: localhost
# Port: 1433
# Username: sa
# Password: YourStrong@Passw0rd123
# Database: vesselhire_db
```

## 🔍 Monitoring and Debugging

### Check Service Status
```bash
# View all containers
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
docker-compose logs nginx

# Check resource usage
docker stats
```

### Common Issues and Solutions

#### 1. **Database Connection Issues**
```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

#### 2. **Frontend Not Loading**
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

#### 3. **Backend API Issues**
```bash
# Check backend logs
docker-compose logs backend

# Run migrations
./docker-commands.sh django migrate

# Restart backend
docker-compose restart backend
```

#### 4. **Nginx Proxy Issues**
```bash
# Check nginx configuration
docker-compose exec nginx nginx -t

# Reload nginx
docker-compose exec nginx nginx -s reload

# Check nginx logs
docker-compose logs nginx
```

## 🔒 Security Considerations

### Production Deployment
1. **Change default passwords** in `env.docker`
2. **Use SSL certificates** (update `nginx.conf`)
3. **Set strong SECRET_KEY** in Django settings
4. **Configure firewall** rules
5. **Use environment variables** for sensitive data
6. **Enable HTTPS** (uncomment SSL section in `nginx.conf`)

### SSL Configuration
```bash
# Generate SSL certificates
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem

# Uncomment SSL server block in nginx.conf
# Restart nginx
docker-compose restart nginx
```

## 📊 Performance Optimization

### Resource Limits
Add to `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

### Caching
- **Static files**: Served by Nginx with 1-year cache
- **Database**: Connection pooling enabled
- **Frontend**: Production build optimized

### Monitoring
```bash
# Monitor resource usage
docker stats

# Check disk usage
docker system df

# Clean up unused resources
docker system prune -f
```

## 🚀 Deployment to Production

### 1. **Cloud Deployment**
- **AWS**: Use ECS or EKS
- **Azure**: Use Container Instances or AKS
- **Google Cloud**: Use Cloud Run or GKE
- **DigitalOcean**: Use App Platform or Droplets

### 2. **CI/CD Pipeline**
```yaml
# Example GitHub Actions workflow
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

### 3. **Backup Strategy**
```bash
# Backup database
docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123' -Q "BACKUP DATABASE vesselhire_db TO DISK = '/var/opt/mssql/backup/vesselhire_db.bak'"

# Backup volumes
docker run --rm -v vesselhire_mssql_data:/data -v $(pwd):/backup alpine tar czf /backup/mssql_backup.tar.gz /data
```

## 📞 Support

### Troubleshooting
1. **Check logs**: `./docker-commands.sh logs`
2. **Verify health**: `./docker-commands.sh health`
3. **Restart services**: `./docker-commands.sh restart`
4. **Clean rebuild**: `./docker-commands.sh cleanup && ./docker-commands.sh start`

### Common Commands Reference
```bash
# Quick restart
docker-compose restart

# Force rebuild
docker-compose build --no-cache

# View running containers
docker ps

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec db bash
```

---

**🎉 Congratulations! Your Vessel Hire Application is now running with Docker Compose!**

For more information, check the main README.md file or contact the development team.

