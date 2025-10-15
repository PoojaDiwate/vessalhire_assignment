#!/bin/bash

# Docker Compose Management Script for Vessel Hire Application
# This script provides easy commands to manage the Docker containers

set -e

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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
}

# Function to build and start all services
start_all() {
    print_status "Starting Vessel Hire Application with Docker Compose..."
    check_docker
    
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    print_status "Starting all services..."
    docker-compose up -d
    
    print_success "All services started successfully!"
    print_status "Application is available at:"
    echo "  - Frontend: http://localhost"
    echo "  - Backend API: http://localhost/api"
    echo "  - Django Admin: http://localhost/admin"
    echo "  - Database: localhost:1433"
}

# Function to stop all services
stop_all() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped!"
}

# Function to restart all services
restart_all() {
    print_status "Restarting all services..."
    docker-compose restart
    print_success "All services restarted!"
}

# Function to view logs
view_logs() {
    print_status "Viewing logs for all services..."
    docker-compose logs -f
}

# Function to view logs for specific service
view_service_logs() {
    if [ -z "$1" ]; then
        print_error "Please specify a service name (backend, frontend, db, nginx)"
        exit 1
    fi
    
    print_status "Viewing logs for $1..."
    docker-compose logs -f "$1"
}

# Function to access database
access_db() {
    print_status "Accessing MS SQL Server database..."
    docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123'
}

# Function to run Django commands
django_command() {
    if [ -z "$1" ]; then
        print_error "Please specify a Django command (e.g., makemigrations, migrate, createsuperuser)"
        exit 1
    fi
    
    print_status "Running Django command: $1"
    docker-compose exec backend python manage.py "$1"
}

# Function to check service health
check_health() {
    print_status "Checking service health..."
    
    echo "Database:"
    docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd123' -Q "SELECT 1" > /dev/null 2>&1 && print_success "✓ Database is healthy" || print_error "✗ Database is not responding"
    
    echo "Backend:"
    curl -f http://localhost/api/vessels/ > /dev/null 2>&1 && print_success "✓ Backend is healthy" || print_error "✗ Backend is not responding"
    
    echo "Frontend:"
    curl -f http://localhost/ > /dev/null 2>&1 && print_success "✓ Frontend is healthy" || print_error "✗ Frontend is not responding"
    
    echo "Nginx:"
    curl -f http://localhost/health > /dev/null 2>&1 && print_success "✓ Nginx is healthy" || print_error "✗ Nginx is not responding"
}

# Function to clean up Docker resources
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show help
show_help() {
    echo "Vessel Hire Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start           Build and start all services"
    echo "  stop            Stop all services"
    echo "  restart         Restart all services"
    echo "  logs            View logs for all services"
    echo "  logs [service]  View logs for specific service"
    echo "  db              Access database"
    echo "  django [cmd]    Run Django management command"
    echo "  health          Check service health"
    echo "  cleanup         Clean up Docker resources"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 django migrate"
    echo "  $0 health"
}

# Main script logic
case "$1" in
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    logs)
        if [ -n "$2" ]; then
            view_service_logs "$2"
        else
            view_logs
        fi
        ;;
    db)
        access_db
        ;;
    django)
        django_command "$2"
        ;;
    health)
        check_health
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

