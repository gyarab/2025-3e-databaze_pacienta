from rest_framework import serializers

from documents.models import Document
from records.models import MedicalEvent


class DocumentSerializer(serializers.ModelSerializer):
    medical_event_id = serializers.PrimaryKeyRelatedField(
        source="medical_event",
        queryset=MedicalEvent.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "file",
            "mime_type",
            "file_size",
            "sha256",
            "created_at",
            "medical_event",
            "medical_event_id",
        ]
        read_only_fields = ["id", "mime_type", "file_size", "sha256", "created_at", "medical_event"]

    def validate(self, attrs):
        request = self.context.get("request")
        medical_event = attrs.get("medical_event")
        if medical_event and medical_event.owner != request.user:
            raise serializers.ValidationError("Vybraný záznam nepatří přihlášenému uživateli.")
        return attrs
