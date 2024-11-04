# views.py
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from .models import User, House
from .serializers import UserSerializer, HouseSerializer
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# User CRUD Views
class UserDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# House CRUD Views
class HouseListView(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        houses = House.objects.all()
        serializer = HouseSerializer(houses, many=True)
        print('hit')
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = HouseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

class HouseDetailView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        serializer = HouseSerializer(house)
        return Response(serializer.data)

    def put(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        serializer = HouseSerializer(house, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, house_id):
        print('hit')
        house = get_object_or_404(House, id=house_id)
        house.delete()
        return Response({"message": "House deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# RegisterUserView
@method_decorator(csrf_exempt, name='dispatch')
class RegisterUserView(APIView):
    def post(self, request):
        username = request.data.get("user_name")
        password = request.data.get("password")
        email = request.data.get("email")
        user_type = request.data.get("user_type")

        if not username or not password or not email:
            return Response({"error": "Username, password, and email are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(user_name=username, password=password, email=email, user_type=user_type)
            user.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# LoginUserView
@method_decorator(csrf_exempt, name='dispatch')
class LoginUserView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
