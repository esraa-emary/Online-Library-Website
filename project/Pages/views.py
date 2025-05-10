from django.shortcuts import render
from django.http import HttpResponse
from .models import User,Book,Category
# Create your views here.
# Home
def Home(request):
    return render(request, 'index.html')
# About
def About(request):
    return render(request, 'Pages/About-Us.html')

# Book Reveiw
def Bookreveiw(request):
    title= request.GET.get('title')
    book = Book.objects.get(Title=title)
    return render(request, 'Pages/Book-Review.html', {'book': book})
# Borrow Book
def BorrowBook(request):
    return render(request, 'Pages/Borrowed-Books.html')
# Borrow Page
def BorrowPage(request):
    return render(request, 'Pages/Borrow-Page.html')


# List Book
def ListPage(request):
    books = Book.objects.all()
    categories = Category.objects.all()
    context = {
        'books': books,
        'categories': categories
    }
    return render(request, 'Pages/List-Page.html', context)

# Search
def Search(request):
    return render(request, 'Pages/Search.html')
# Profile
def Profile(request):
    return render(request, 'Pages/Profile.html')
# Login
def Login(request):
    return render(request, 'Pages/Log-In.html')
# Signup
def Signup(request):
    username = request.POST.get('userName')
    email = request.POST.get('email')
    password = request.POST.get('password')
    confirm = request.POST.get('confirmPassword')
    users= User.objects.all()
    for user in users:
        if user.Name == username:
            return render(request, 'Pages/Sign-Up.html', {'erroruser': 'Username already exists'})
        if user.Email == email:
            return render(request, 'Pages/Sign-Up.html', {'erroremail': 'Email already exists'})
    if password != confirm:
        return render(request, 'Pages/Sign-Up.html', {'errorpassword': 'Password does not match'})
    if username and email and password and confirm:
        user = User(Name=username, Email=email, Password=password)
        user.save()
        return render(request, 'Pages/Sign-Up.html',{'successmessage': 'account created successfully'})
    return render(request, 'Pages/Sign-Up.html')
    
