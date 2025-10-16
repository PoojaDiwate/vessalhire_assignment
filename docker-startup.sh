#!/bin/bash

# Vessel Hire Application - Docker Startup Script
# This script helps you start the application with Docker

set -e  # Exit on any error

echo "🚢 Starting Vessel Hire Application with Docker..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

print_success "Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

print_success "docker-compose is available"

# Stop any existing containers
print_status "Stopping any existing containers..."
docker-compose down --remove-orphans

# Remove any existing volumes (optional - uncomment if you want fresh data)
# print_status "Removing existing volumes..."
# docker-compose down -v

# Build and start services
print_status "Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 15

# Check service health
print_status "Checking service health..."

# Check database
if docker-compose exec -T db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123' -Q "SELECT 1" > /dev/null 2>&1; then
    print_success "Database is ready"
else
    print_warning "Database might still be starting up..."
fi

# Check backend
if curl -f http://localhost:8000/admin/ > /dev/null 2>&1; then
    print_success "Backend is ready"
else
    print_warning "Backend might still be starting up..."
fi

# Check frontend
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    print_success "Frontend is ready"
else
    print_warning "Frontend might still be starting up..."
fi

# Check nginx
if curl -f http://localhost/ > /dev/null 2>&1; then
    print_success "Nginx proxy is ready"
else
    print_warning "Nginx might still be starting up..."
fi

echo ""
echo "🎉 Application startup completed!"
echo "=================================================="
echo ""
echo "📱 Access the application:"
echo "   🌐 Frontend: http://localhost"
echo "   🔧 Backend API: http://localhost/api"
echo "   👨‍💼 Django Admin: http://localhost/admin"
echo "   🗄️  Database: localhost:1433"
echo ""
echo "🔑 Login credentials:"
echo "   👑 Admin: admin / admin123"
echo "   👤 User:  user / user123"
echo ""
echo "📊 Useful commands:"
echo "   📋 View logs: docker-compose logs -f"
echo "   🔄 Restart: docker-compose restart"
echo "   🛑 Stop: docker-compose down"
echo "   🧹 Clean up: docker-compose down -v"
echo ""
echo "🐛 Troubleshooting:"
echo "   If services are not ready, wait a few more minutes"
echo "   Check logs with: docker-compose logs [service_name]"
echo "   Common services: backend, frontend, db, nginx"
echo ""

# Show running containers
print_status "Running containers:"
docker-compose ps
