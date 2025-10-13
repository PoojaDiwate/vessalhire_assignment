"""
URL configuration for vesselhire_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from vessels.views import vessel_data, vessel_aggregate, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from vesselhire_backend.views import home_view, login_view, dashboard_view, admin_panel_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/vessels/', vessel_data, name='vessel-data'),
    path('api/vessels/aggregate/', vessel_aggregate, name='vessel-aggregate'),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Frontend routes
    path('', home_view, name='home'),
    path('login/', login_view, name='login'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('admin-panel/', admin_panel_view, name='admin-panel'),
    
    # Catch all other routes and serve the main app
    re_path(r'^(?!api/|admin/|static/).*$', home_view, name='app'),
]

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
