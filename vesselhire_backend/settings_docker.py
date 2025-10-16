"""
Docker production settings for vesselhire_backend project.
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Import everything except DATABASES from base settings
from .settings import *
# Remove the inherited DATABASES so we can define our own
if 'DATABASES' in globals():
    del globals()['DATABASES']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Security settings for production
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-docker-production-key-change-this')

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'backend',
    'nginx',
    '0.0.0.0',
    os.environ.get('ALLOWED_HOSTS', 'localhost').split(',')
]

# Database configuration for Docker - MS SQL Server
DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': os.environ.get('DATABASE_NAME', 'vesselhire_db'),
        'USER': os.environ.get('DATABASE_USER', 'sa'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD', 'YourStrong@Passw0rd123'),
        'HOST': os.environ.get('DATABASE_HOST', 'db'),
        'PORT': os.environ.get('DATABASE_PORT', '1433'),
        'OPTIONS': {
            'driver': 'ODBC Driver 18 for SQL Server',
            'extra_params': 'TrustServerCertificate=yes;Encrypt=yes;',
        },
    }
}

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = '/app/staticfiles'

# Additional locations of static files
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = '/app/media'

# CORS settings for Docker environment
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:80",
    "http://frontend:3000",
    "http://nginx:80",
]

CORS_ALLOW_CREDENTIALS = True

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Session settings
SESSION_COOKIE_SECURE = False  # Set to True if using HTTPS
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 86400  # 24 hours

# CSRF settings
CSRF_COOKIE_SECURE = False  # Set to True if using HTTPS
CSRF_COOKIE_HTTPONLY = True

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'vessels': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Cache configuration (using database cache for simplicity)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'django_cache_table',
    }
}

# Email configuration (for production)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'localhost')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')

# Celery configuration (if using background tasks)
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://redis:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://redis:6379/0')

# Performance settings
CONN_MAX_AGE = 60

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
