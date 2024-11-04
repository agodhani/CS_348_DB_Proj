from django.db import models

#schema
#User(PK: user_id, user_name, password, user_type, email, created_at)
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_name

#House(PK: id, FK: owner, status, street,city, zipcode, price, number_of_bedrooms, 
#number_of_bathrooms, squarefootage, year_built, updated_at)
class House(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.CharField(max_length=150) #models.ForeignKey(User, on_delete=models.CASCADE)
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
