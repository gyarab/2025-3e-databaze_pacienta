from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from records.models import MedicalEvent
from records.serializers import MedicalEventSerializer
from users.models import PatientProfile


class MedicalEventViewSet(ModelViewSet):
    serializer_class = MedicalEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalEvent.objects.filter(owner=self.request.user).select_related(
            "patient_profile"
        )

    def perform_create(self, serializer):
        patient_profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        serializer.save(owner=self.request.user, patient_profile=patient_profile)
