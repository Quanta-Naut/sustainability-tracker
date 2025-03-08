from django.db import models

class SustainabilityAction(models.Model):
    """Model for tracking sustainability actions with points."""
    action = models.CharField(max_length=255)  # Description of the action
    date = models.DateField()                  # Date when action was performed
    points = models.IntegerField()             # Points awarded for this action

    def __str__(self):
        """String representation: action (date)"""
        return f"{self.action} ({self.date})"