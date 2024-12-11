from django.contrib import admin
from .models import FakeUser, House

@admin.register(FakeUser)
class FakeUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'email', 'created_at', 'current_session')

@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'status', 'city', 'price', 'number_of_bedrooms', 'number_of_bathrooms', 'year_built', 'updated_at')
