from django.db import models
import uuid

class FieldBoundary(models.Model):
    """XML-Import für Feldgrenzen"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    coordinates = models.JSONField()  # z.B. [[lat, lng], ...]
    area_hectares = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ABTrace(models.Model):
    """XML-Import für AB-Spuren"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    field = models.ForeignKey(FieldBoundary, on_delete=models.CASCADE)
    trace_data = models.JSONField()  # GPS-Spurdaten
    distance_km = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trace for {self.field.name}"
    
class Role(models.Model):
    """Rollen für Zugriffskontrolle der Datenbank"""
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class Policy (models.Model):
    """ Casbin Policies für Zugriffskontrolle der Datenbank"""
    ACTIONS = [ 
        ('read', 'Read Access'),
        ('write', 'Write Access'),
        ('delete', 'Delete Access'),
        ('admin', 'Admin Access'),
        ('denied', 'Denied Access'),
        ('custom', 'Custom Access'),
        ('temporary', 'Temporary Access'),
    ]    

    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    resource = models.CharField(max_length=100)  # z.B. 'fieldboundary', 'trace'
    action = models.CharField(max_length=50, choices=ACTIONS)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('role', 'resource', 'action')
    
    def __str__(self):
        return f"{self.role.name} - {self.action} - {self.resource}"

