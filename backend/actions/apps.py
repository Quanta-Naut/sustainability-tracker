# Configuration class for the 'actions' app, defining default auto field and app name
from django.apps import AppConfig

class ActionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'actions'