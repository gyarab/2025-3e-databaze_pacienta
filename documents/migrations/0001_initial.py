from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0001_initial'),
        ('records', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to='medical_documents/%Y/%m/')),
                ('mime_type', models.CharField(blank=True, max_length=128)),
                ('file_size', models.PositiveIntegerField(default=0)),
                ('sha256', models.CharField(blank=True, max_length=64)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('medical_event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='documents', to='records.medicalevent')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to=settings.AUTH_USER_MODEL)),
                ('patient_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='users.patientprofile')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='document',
            index=models.Index(fields=['owner', 'created_at'], name='documents_d_owner_i_71cf99_idx'),
        ),
    ]
