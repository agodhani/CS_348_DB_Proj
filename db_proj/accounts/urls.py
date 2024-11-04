# urls.py (Main project-level URL configuration)
from django.contrib import admin
from django.urls import path, include
from accounts.views import RegisterUserView, LoginUserView, UserDetailView, HouseListView, HouseDetailView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register_user'),
    path('login/', LoginUserView.as_view(), name='login_user'),
    path('user/<int:user_id>/', UserDetailView.as_view(), name='user_detail'),
    path('houses/', HouseListView.as_view(), name='house-list'),
    path('houses/<int:house_id>/', HouseDetailView.as_view(), name='house-detail'),
]
