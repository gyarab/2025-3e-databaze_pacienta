from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from records.models import MedicalEvent
from users.models import PatientProfile


class DocumentsApiTests(APITestCase):
    def test_upload_document_for_own_event(self):
        user = get_user_model().objects.create_user(username="doc", password="pass-12345")
        PatientProfile.objects.create(user=user)
        event = MedicalEvent.objects.create(
            owner=user,
            patient_profile=user.patient_profile,
            type=MedicalEvent.EventType.DOCUMENT,
            title="Kontrola",
            date="2024-01-01",
        )

        self.client.force_authenticate(user)
        file = SimpleUploadedFile("report.pdf", b"fake-pdf", content_type="application/pdf")
        response = self.client.post(
            reverse("document-list"),
            {"title": "Zprava", "file": file, "medical_event_id": event.id},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Zprava")
