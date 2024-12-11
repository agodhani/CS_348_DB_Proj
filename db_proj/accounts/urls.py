# urls.py (Main project-level URL configuration)
from django.contrib import admin
from django.urls import path, include
from accounts.views import RegisterUserView, LoginUserView, HouseDetailView, FakeUserDetailView, HouseListView, MyHousesView, LogoutUserView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register_user'),
    path('login/', LoginUserView.as_view(), name='login_user'),
    path('user/<int:user_id>/', FakeUserDetailView.as_view(), name='user_detail'),
    path('houses/', HouseListView.as_view(), name='house-list'),
    path('houses/<int:house_id>/', HouseDetailView.as_view(), name='house-detail'),
    path('myhouses/', MyHousesView.as_view(), name='my-houses'),
    path('logout/', LogoutUserView.as_view(), name='logout_user'),
]
