from django.contrib.auth import get_user_model
from rest_framework import serializers

from users.models import PatientProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = get_user_model()
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user_model = get_user_model()
        return user_model.objects.create_user(**validated_data)


class UserSummarySerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField(allow_blank=True)
    event_count = serializers.IntegerField()


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "is_staff"]


class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = [
            "date_of_birth",
            "phone_number",
            "emergency_contact",
            "insurance_provider",
            "height_cm",
            "weight_kg",
            "national_id",
            "consent_to_data_processing",
        ]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
