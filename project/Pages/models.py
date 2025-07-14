from django.db import models

class User(models.Model):
    Fname=models.EmailField(max_length=30)
    Lname=models.EmailField(max_length=30,default=" ")
    Email=models.CharField(max_length=50)
    Password=models.CharField(default="123456",max_length=50)
    Phone=models.IntegerField(null=True)
    gender=[
        ("male","Male"),
        ("female","female"),
    ]
    sex=models.CharField(max_length=10,choices=gender,null=True)
    isadmin=models.BooleanField(default=False)
    age=models.IntegerField(default=0)
    silvercoins=models.IntegerField(default=0)
    def __str__(self):
        return self.Name

class Category(models.Model):
   category=models.CharField(max_length=50)
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
   
class BorrowedBook(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    book=models.ForeignKey(Book,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    def __str__(self):
        return self.user.Name + " borrowed " + self.book.Title
    
class Interactions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    likes = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Interaction"  # ← add this line just temporarily



# Create your models here.
