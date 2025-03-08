from django.urls import path
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