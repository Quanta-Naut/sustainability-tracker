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
    """ViewSet for managing sustainability actions via JSON file storage"""
    
    def _read_json(self):
        """Read sustainability actions from JSON file"""
        if not os.path.exists(JSON_FILE_PATH):
            return []
        
        with open(JSON_FILE_PATH, 'r') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    
    def _write_json(self, data):
        """Save actions data to JSON file"""
        with open(JSON_FILE_PATH, 'w') as file:
            json.dump(data, file, indent=4)
    
    def _get_next_id(self, actions):
        """Generate next ID for a new action by finding max ID + 1"""
        if not actions:
            return 1
        return max(action.get('id', 0) for action in actions) + 1
    
    def list(self, request):
        """GET: Return all sustainability actions"""
        actions = self._read_json()
        return Response(actions)
    
    def create(self, request):
        """POST: Create a new sustainability action"""
        serializer = SustainabilityActionSerializer(data=request.data)
        if serializer.is_valid():
            actions = self._read_json()
            new_action = serializer.validated_data
            new_action['id'] = self._get_next_id(actions)  # Assign unique ID
            
            # Convert date to string for JSON serialization
            new_action['date'] = new_action['date'].isoformat()
            
            actions.append(dict(new_action))
            self._write_json(actions)
            
            return Response(new_action, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """GET: Return a specific action by ID"""
        actions = self._read_json()
        # Find action with matching ID
        action = next((a for a in actions if a.get('id') == int(pk)), None)
        
        if action:
            return Response(action)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """PUT: Complete update of an action by ID"""
        actions = self._read_json()
        action_index = next((i for i, a in enumerate(actions) if a.get('id') == int(pk)), None)
        
        if action_index is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SustainabilityActionSerializer(data=request.data)
        if serializer.is_valid():
            updated_action = serializer.validated_data
            updated_action['id'] = int(pk)  # Preserve original ID
            updated_action['date'] = updated_action['date'].isoformat()
            
            actions[action_index] = dict(updated_action)
            self._write_json(actions)
            
            return Response(updated_action)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        """PATCH: Partially update an action by ID"""
        actions = self._read_json()
        action_index = next((i for i, a in enumerate(actions) if a.get('id') == int(pk)), None)
        
        if action_index is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        current_action = actions[action_index]
        
        # Handle date conversion for PATCH requests
        if 'date' in request.data and request.data['date']:
            try:
                date_obj = datetime.strptime(request.data['date'], '%Y-%m-%d').date()
                current_action['date'] = date_obj.isoformat()
            except ValueError:
                return Response({"date": ["Date has wrong format. Use YYYY-MM-DD format."]}, 
                               status=status.HTTP_400_BAD_REQUEST)
        
        # Update requested fields only
        for key, value in request.data.items():
            if key in ['action', 'points'] and value is not None:
                current_action[key] = value
        
        # Validate the updated action
        temp_data = dict(current_action)
        if isinstance(temp_data['date'], str):
            temp_data['date'] = datetime.strptime(temp_data['date'], '%Y-%m-%d').date()
        
        serializer = SustainabilityActionSerializer(data=temp_data)
        if serializer.is_valid():
            actions[action_index] = current_action
            self._write_json(actions)
            return Response(current_action)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """DELETE: Remove an action by ID"""
        actions = self._read_json()
        action_index = next((i for i, a in enumerate(actions) if a.get('id') == int(pk)), None)
        
        if action_index is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        actions.pop(action_index)  # Remove action from list
        self._write_json(actions)
        
        return Response(status=status.HTTP_204_NO_CONTENT)