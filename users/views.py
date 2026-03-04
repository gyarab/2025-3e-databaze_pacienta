from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import PatientProfile
from users.serializers import (
    ChangePasswordSerializer,
    MeSerializer,
    PatientProfileSerializer,
    RegisterSerializer,
    UserSummarySerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = MeSerializer(request.user)
        return Response(serializer.data)


class AdminUsersOverviewView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = (
            get_user_model()
            .objects.annotate(event_count=Count("medical_events"))
            .order_by("username")
            .values("username", "email", "event_count")
        )
        serializer = UserSummarySerializer(users, many=True)
        return Response(serializer.data)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = PatientProfile.objects.get_or_create(user=request.user)
        serializer = PatientProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = PatientProfile.objects.get_or_create(user=request.user)
        serializer = PatientProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Původní heslo nesouhlasí."}, status=400)

        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        return Response({"detail": "Heslo bylo změněno."})
