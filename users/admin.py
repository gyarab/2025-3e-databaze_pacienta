from django.contrib import admin

from users.models import PatientProfile


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "date_of_birth", "insurance_provider", "created_at")
    search_fields = ("user__username", "user__email", "insurance_provider")
