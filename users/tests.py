from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from records.models import MedicalEvent
from users.models import PatientProfile


class UsersApiTests(APITestCase):
    def test_register_and_login(self):
        register_response = self.client.post(
            reverse("register"),
            {
                "username": "new-user",
                "email": "new@example.com",
                "password": "strong-pass-123",
            },
            format="json",
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        token_response = self.client.post(
            reverse("token_obtain_pair"),
            {"username": "new-user", "password": "strong-pass-123"},
            format="json",
        )
        self.assertEqual(token_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", token_response.data)

    def test_admin_overview_shows_counts(self):
        admin = get_user_model().objects.create_user(
            username="admin", password="pass-12345", is_staff=True
        )
        user = get_user_model().objects.create_user(
            username="alice", email="alice@example.com", password="pass-12345"
        )
        PatientProfile.objects.create(user=user)
        MedicalEvent.objects.create(
            owner=user,
            patient_profile=user.patient_profile,
            type=MedicalEvent.EventType.SURGERY,
            title="Op",
            date="2024-01-01",
        )

        self.client.force_authenticate(admin)
        response = self.client.get(reverse("admin_overview"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        alice_entry = next((item for item in response.data if item["username"] == "alice"), None)
        self.assertIsNotNone(alice_entry)
        self.assertEqual(alice_entry["event_count"], 1)

    def test_profile_update_and_change_password(self):
        user = get_user_model().objects.create_user(username="eva", password="old-pass-123")
        self.client.force_authenticate(user)

        profile_response = self.client.patch(
            reverse("profile"),
            {"height_cm": 172, "weight_kg": 68, "national_id": "010101/1234"},
            format="json",
        )
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data["height_cm"], 172)

        password_response = self.client.post(
            reverse("change_password"),
            {"old_password": "old-pass-123", "new_password": "new-pass-123"},
            format="json",
        )
        self.assertEqual(password_response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.check_password("new-pass-123"))
