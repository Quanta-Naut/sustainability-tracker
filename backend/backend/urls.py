# URLs configuration for backend project
# Includes admin site and API endpoints from actions app
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),    # Django admin interface
    path('api/', include('actions.urls')),    # API endpoints
]