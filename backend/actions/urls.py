from django.urls import path
"""
URL patterns configuration for the actions app.
Defines API endpoints for sustainability actions:
- GET/POST /actions/ - List all actions or create a new one
- GET/PUT/PATCH/DELETE /actions/<id>/ - Retrieve, update, or delete a specific action by ID
"""
from . import views

urlpatterns = [
    path('actions/', views.SustainabilityActionViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('actions/<int:pk>/', views.SustainabilityActionViewSet.as_view({
        'get': 'retrieve', 
        'put': 'update', 
        'patch': 'partial_update', 
        'delete': 'destroy'
    })),
]