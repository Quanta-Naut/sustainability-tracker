from rest_framework import serializers
from .models import SustainabilityAction

class SustainabilityActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SustainabilityAction
        fields = ['id', 'action', 'date', 'points']