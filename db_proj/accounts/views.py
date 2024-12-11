from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.db import transaction
from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .models import FakeUser, House
from .serializers import FakeUserSerializer, HouseSerializer

class HouseListView(APIView):
    permission_classes = [AllowAny]

    def get(self,request):
        houses = House.objects.all()
        serializer = HouseSerializer(houses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # If you want to ensure the owner is the current user, do so here:
        # request.data['owner'] = request.user.id  (if using token or session)
        serializer = HouseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HouseDetailView(APIView):
    def get(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        serializer = HouseSerializer(house)
        return Response(serializer.data)

    @transaction.atomic
    def put(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        serializer = HouseSerializer(house, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def delete(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        house.delete()
        return Response({"message": "House deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class FakeUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(FakeUser, pk=user_id)
        serializer = FakeUserSerializer(user)
        return Response(serializer.data)

    def put(self, request, user_id):
        user = get_object_or_404(FakeUser, pk=user_id)
        serializer = FakeUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        user = get_object_or_404(FakeUser, pk=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterUserView(APIView):
    def post(self, request):
        username = request.data.get("user_name")
        email = request.data.get("email")

        if not username or not email:
            return Response({"error": "Username and email are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create user without a password
            user = FakeUser.objects.create_user(user_name=username, email=email, password=None)
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class LoginUserView(APIView):
    def post(self, request):
        username = request.data.get("username")

        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Try to get the user by username
        user, created = FakeUser.objects.get_or_create(user_name=username, defaults={'email': f'{username}@example.com'})
        
        if user.current_session:
            return Response({"error": "User is already logged in elsewhere."}, status=status.HTTP_403_FORBIDDEN)
        
        # If no password is required, we skip authenticate
        # Simply log the user in by setting current_session = True
        user.current_session = True
        user.save()

        if created:
            return Response({"message": "New user created and logged in", "user_id": user.id}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Login successful", "user_id": user.id}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutUserView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = FakeUser.objects.get(id=user_id)
        except FakeUser.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Set current_session to False
        user.current_session = False
        user.save()

        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

class MyHousesView(APIView):
    def get(self, request):
        from django.db import connection
        user_id = request.user.id
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, status, street, city, zipcode, price, number_of_bedrooms,
                       number_of_bathrooms, square_footage, year_built, updated_at
                FROM accounts_house
                WHERE owner_id = %s
            """, [user_id])
            rows = cursor.fetchall()

        columns = [
            'id','status','street','city','zipcode','price',
            'number_of_bedrooms','number_of_bathrooms',
            'square_footage','year_built','updated_at'
        ]
        houses = [dict(zip(columns, row)) for row in rows]
        return Response(houses, status=status.HTTP_200_OK)
