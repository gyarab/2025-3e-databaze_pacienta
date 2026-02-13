from django.contrib import admin

from documents.models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "title", "mime_type", "file_size", "created_at")
    list_filter = ("mime_type", "created_at")
    search_fields = ("title", "owner__username", "owner__email")
