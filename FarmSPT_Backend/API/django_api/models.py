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
