import hashlib

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from documents.models import Document
from documents.serializers import DocumentSerializer
from users.models import PatientProfile


class DocumentViewSet(ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user).select_related("medical_event")

    def perform_create(self, serializer):
        uploaded_file = serializer.validated_data["file"]
        sha256 = hashlib.sha256()
        for chunk in uploaded_file.chunks():
            sha256.update(chunk)

        patient_profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        serializer.save(
            owner=self.request.user,
            patient_profile=patient_profile,
            mime_type=getattr(uploaded_file, "content_type", "") or "",
            file_size=uploaded_file.size,
            sha256=sha256.hexdigest(),
        )
