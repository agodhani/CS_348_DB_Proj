from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

class FakeUserManager(BaseUserManager):
    def create_user(self, user_name, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(user_name=user_name, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_name, email, password=None):
        user = self.create_user(user_name, email, password)
        return user

class FakeUser(AbstractBaseUser, PermissionsMixin):
    user_name = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    current_session = models.BooleanField(default=False)

    objects = FakeUserManager()

    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.user_name


class House(models.Model):
    # Make sure AUTH_USER_MODEL is set in settings.py to 'accounts.FakeUser'
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='houses')
    status = models.CharField(max_length=50)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    number_of_bedrooms = models.IntegerField()
    number_of_bathrooms = models.DecimalField(max_digits=4, decimal_places=1)
    square_footage = models.IntegerField()
    year_built = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.street}, {self.city}'
