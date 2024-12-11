from rest_framework import serializers
from .models import FakeUser, House

class FakeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FakeUser
        fields = ['id', 'user_name', 'email', 'created_at', 'current_session']

class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = [
            'id', 'owner', 'status', 'street', 'city', 'zipcode', 'price',
            'number_of_bedrooms', 'number_of_bathrooms', 'square_footage',
            'year_built', 'updated_at'
        ]
