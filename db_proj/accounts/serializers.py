from rest_framework import serializers
from .models import User, House

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'user_type', 'created_at']

class HouseSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = House
        fields = ['id', 'owner', 'status', 'street', 'city', 'zipcode', 'price',
                  'number_of_bedrooms', 'number_of_bathrooms', 'square_footage',
                  'year_built', 'updated_at']
