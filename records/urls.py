from django.urls import include, path
from rest_framework.routers import DefaultRouter

from records.views import MedicalEventViewSet

router = DefaultRouter()
router.register("events", MedicalEventViewSet, basename="medical-event")

urlpatterns = [
    path("", include(router.urls)),
]
