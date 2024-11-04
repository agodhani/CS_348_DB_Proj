from django.contrib import admin
from .models import User, House

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'user_name', 'email', 'user_type', 'created_at')

@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'status', 'city', 'price', 'number_of_bedrooms', 'number_of_bathrooms', 'year_built', 'updated_at')
