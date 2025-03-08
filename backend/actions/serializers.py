from rest_framework import serializers
from .models import SustainabilityAction

class SustainabilityActionSerializer(serializers.ModelSerializer):
    """
    Serializer for the SustainabilityAction model.

    Provides serialization/deserialization for SustainabilityAction objects,
    exposing id, action, date, and points fields.
    """
    class Meta:
        model = SustainabilityAction
        fields = ['id', 'action', 'date', 'points']