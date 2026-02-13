from django.contrib import admin

from records.models import MedicalEvent


@admin.register(MedicalEvent)
class MedicalEventAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "type", "title", "date", "created_at")
    list_filter = ("type", "date")
    search_fields = ("title", "description", "doctor", "location", "owner__username")
