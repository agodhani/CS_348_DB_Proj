from rest_framework import serializers
from .models import User, House

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ['id', 'owner', 'status', 'street', 'city', 'zipcode', 'price',
                  'number_of_bedrooms', 'number_of_bathrooms', 'square_footage',
                  'year_built', 'updated_at']
