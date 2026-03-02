from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import MeSerializer, RegisterSerializer, UserSummarySerializer


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
