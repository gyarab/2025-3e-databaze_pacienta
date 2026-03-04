from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MedicalEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('surgery', 'Surgery'), ('medication', 'Medication'), ('rehabilitation', 'Rehabilitation'), ('document', 'Document'), ('spa', 'Spa')], max_length=32)),
                ('title', models.CharField(max_length=255)),
                ('date', models.DateField()),
                ('description', models.TextField(blank=True)),
                ('location', models.CharField(blank=True, max_length=255)),
                ('doctor', models.CharField(blank=True, max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medical_events', to=settings.AUTH_USER_MODEL)),
                ('patient_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medical_events', to='users.patientprofile')),
            ],
            options={
                'ordering': ['-date', '-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='medicalevent',
            index=models.Index(fields=['owner', 'date'], name='records_med_owner_i_0ebfd1_idx'),
        ),
        migrations.AddIndex(
            model_name='medicalevent',
            index=models.Index(fields=['owner', 'type'], name='records_med_owner_i_e30629_idx'),
        ),
    ]
