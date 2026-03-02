from rest_framework import serializers

from records.models import MedicalEvent


class MedicalEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalEvent
        fields = [
            "id",
            "type",
            "title",
            "date",
            "description",
            "location",
            "doctor",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
