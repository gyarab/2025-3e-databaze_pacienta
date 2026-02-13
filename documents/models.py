from django.conf import settings
from django.db import models


class Document(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    patient_profile = models.ForeignKey(
        "users.PatientProfile",
        on_delete=models.CASCADE,
        related_name="documents",
    )
    medical_event = models.ForeignKey(
        "records.MedicalEvent",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="documents",
    )
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="medical_documents/%Y/%m/")
    mime_type = models.CharField(max_length=128, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    sha256 = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["owner", "created_at"])]

    def __str__(self) -> str:
        return self.title
