# Generated by Django 4.2.16 on 2024-11-04 02:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_remove_user_full_name_alter_user_user_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="house", name="owner", field=models.CharField(max_length=150),
        ),
    ]
