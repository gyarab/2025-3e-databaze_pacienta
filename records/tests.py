from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from records.models import MedicalEvent
from users.models import PatientProfile


class MedicalEventApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="alice", email="alice@example.com", password="test-pass-123"
        )
        self.other_user = get_user_model().objects.create_user(
            username="bob", email="bob@example.com", password="test-pass-123"
        )
        PatientProfile.objects.create(user=self.user)
        PatientProfile.objects.create(user=self.other_user)
        self.list_url = reverse("medical-event-list")

    def test_authentication_required(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_only_own_events(self):
        self.client.force_authenticate(self.user)
        user_event = MedicalEvent.objects.create(
            owner=self.user,
            patient_profile=self.user.patient_profile,
            type=MedicalEvent.EventType.SURGERY,
            title="Knee surgery",
            date="2024-01-10",
        )
        MedicalEvent.objects.create(
            owner=self.other_user,
            patient_profile=self.other_user.patient_profile,
            type=MedicalEvent.EventType.DOCUMENT,
            title="Other event",
            date="2024-01-11",
        )

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], user_event.id)

    def test_create_event_auto_creates_profile(self):
        user = get_user_model().objects.create_user(
            username="charlie", email="charlie@example.com", password="test-pass-123"
        )
        PatientProfile.objects.create(user=user).delete()

        self.client.force_authenticate(user)
        payload = {
            "type": MedicalEvent.EventType.MEDICATION,
            "title": "New medication",
            "date": "2024-02-01",
            "description": "Ibuprofen",
            "location": "Clinic",
            "doctor": "MUDr. Novak",
        }

        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(hasattr(user, "patient_profile"))
        self.assertEqual(MedicalEvent.objects.filter(owner=user).count(), 1)
