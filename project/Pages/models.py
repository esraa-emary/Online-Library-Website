from django.db import models


class User(models.Model):
    Name=models.CharField(max_length=30)
    Email=models.CharField()
    Password=models.CharField(default="123456")
    Phone=models.IntegerField(null=True)
    gender=[
        ("male","Male"),
        ("female","female"),
    ]
    sex=models.CharField(max_length=10,choices=gender,null=True)
    isadmin=models.BooleanField(default=False)
    def __str__(self):
        return self.Name

class Category(models.Model):
   category=models.CharField()
   def __str__(self):
        return self.category

class Book(models.Model):
    Title=models.CharField(max_length=50)
    description=models.TextField(default="No description available ")
    Author=models.CharField(max_length=30)
    Price=models.IntegerField()
    image=models.ImageField(default="s.png",upload_to="static/images")
    category=models.ForeignKey(Category,on_delete=models.CASCADE,null=True)
    available=models.BooleanField(default=True)
    def __str__(self):
        return self.Title
   
class borrowedBook(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    book=models.ForeignKey(Book,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    def __str__(self):
        return self.user.Name + " borrowed " + self.book.Title
    

# Create your models here.
