import json
import os
from datetime import datetime
from django.conf import settings
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import SustainabilityAction
from .serializers import SustainabilityActionSerializer

# Path for JSON file storage
JSON_FILE_PATH = os.path.join(settings.BASE_DIR, 'actions_data.json')

class SustainabilityActionViewSet(viewsets.ViewSet):
    def _read_json(self):
        """Read data from JSON file"""
        if not os.path.exists(JSON_FILE_PATH):
            return []
        
        with open(JSON_FILE_PATH, 'r') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    
    def _write_json(self, data):
        """Write data to JSON file"""
        with open(JSON_FILE_PATH, 'w') as file:
            json.dump(data, file, indent=4)
    
    def _get_next_id(self, actions):
        """Generate next ID for a new action"""
        if not actions:
            return 1
        return max(action.get('id', 0) for action in actions) + 1
    
    def list(self, request):
        """GET /api/actions/"""
        actions = self._read_json()
        return Response(actions)
    
    def create(self, request):
        """POST /api/actions/"""
        serializer = SustainabilityActionSerializer(data=request.data)
        if serializer.is_valid():
            actions = self._read_json()
            new_action = serializer.validated_data
            new_action['id'] = self._get_next_id(actions)
            
            # Convert date to string for JSON serialization
            new_action['date'] = new_action['date'].isoformat()
            
            actions.append(dict(new_action))
            self._write_json(actions)
            
            return Response(new_action, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """GET /api/actions/<id>/"""
        actions = self._read_json()
        action = next((a for a in actions if a.get('id') == int(pk)), None)
        
        if action:
            return Response(action)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """PUT /api/actions/<id>/"""
        actions = self._read_json()
        action_index = next((i for i, a in enumerate(actions) if a.get('id') == int(pk)), None)
        
        if action_index is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SustainabilityActionSerializer(data=request.data)
        if serializer.is_valid():
            updated_action = serializer.validated_data
            updated_action['id'] = int(pk)
            # Convert date to string for JSON serialization
            updated_action['date'] = updated_action['date'].isoformat()
            
            actions[action_index] = dict(updated_action)
            self._write_json(actions)
            
            return Response(updated_action)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        """PATCH /api/actions/<id>/"""
        actions = self._read_json()
        action_index = next((i for i, a in enumerate(actions) if a.get('id') == int(pk)), None)
        
        if action_index is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        current_action = actions[action_index]
        
        # Handle date field specially if it exists in the request data
        if 'date' in request.data and request.data['date']:
            try:
                # Convert to date object then back to ISO format string
                date_obj = datetime.strptime(request.data['date'], '%Y-%m-%d').date()
                current_action['date'] = date_obj.isoformat()
            except ValueError:
                return Response({"date": ["Date has wrong format. Use YYYY-MM-DD format."]}, 
                               status=status.HTTP_400_BAD_REQUEST)
        
        # Update other fields
        for key, value in request.data.items():
            if key in ['action', 'points'] and value is not None:
                current_action[key] = value
        
        # Validate the updated data
        temp_data = dict(current_action)
        # Convert ISO date string to expected format for validation
        if isinstance(temp_data['date'], str):
            temp_data['date'] = datetime.strptime(temp_data['date'], '%Y-%m-%d').date()
        
        serializer = SustainabilityActionSerializer(data=temp_data)
        if serializer.is_valid():
            actions[action_index] = current_action
            self._write_json(actions)
            return Response(current_action)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """DELETE /api/actions/<id>/"""
        actions = self._read_json()
        action_index = next((i for i, a in enumerate(actions) if a.get('id') == int(pk)), None)
        
        if action_index is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        actions.pop(action_index)
        self._write_json(actions)
        
        return Response(status=status.HTTP_204_NO_CONTENT)