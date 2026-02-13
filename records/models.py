from django.conf import settings
from django.db import models


class MedicalEvent(models.Model):
    class EventType(models.TextChoices):
        SURGERY = "surgery", "Surgery"
        MEDICATION = "medication", "Medication"
        REHABILITATION = "rehabilitation", "Rehabilitation"
        DOCUMENT = "document", "Document"
        SPA = "spa", "Spa"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="medical_events",
    )
    patient_profile = models.ForeignKey(
        "users.PatientProfile",
        on_delete=models.CASCADE,
        related_name="medical_events",
    )
    type = models.CharField(max_length=32, choices=EventType.choices)
    title = models.CharField(max_length=255)
    date = models.DateField()
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    doctor = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [
            models.Index(fields=["owner", "date"]),
            models.Index(fields=["owner", "type"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} ({self.type})"
