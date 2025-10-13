from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json

def home_view(request):
    """Serve the main application interface"""
    return render(request, 'index.html')

def login_view(request):
    """Handle login requests"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            # Authenticate user
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # For now, return success - in real app you'd generate JWT token
                return JsonResponse({
                    'success': True,
                    'message': 'Login successful',
                    'user': {
                        'username': user.username,
                        'is_staff': user.is_staff,
                        'is_superuser': user.is_superuser
                    }
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)
    
    return JsonResponse({'message': 'Login endpoint'})

def dashboard_view(request):
    """Serve dashboard interface"""
    return render(request, 'index.html')

def admin_panel_view(request):
    """Serve admin panel interface"""
    return render(request, 'index.html')
