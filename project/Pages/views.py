from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
# Home
def Home(request):
    return render(request, 'index.html')
# About
def About(request):
    return render(request, 'Pages/About-Us.html')
# Add Book
def AddBook(request):
    return render(request, 'Pages/Add-Book.html')
# Book Reveiw
def Bookreveiw(request):
    return render(request, 'Pages/Book-Review.html')
# Borrow Book
def BorrowBook(request):
    return render(request, 'Pages/Borrowed-Books.html')
# Borrow Page
def BorrowPage(request):
    return render(request, 'Pages/Borrow-Page.html')
# Edit Book
def EditBook(request):
    return render(request, 'Pages/Edit-Book.html')
# List Book
def ListPage(request):
    return render(request, 'Pages/List-Page.html')
# Manage Books
def ManageBook(request):
    return render(request, 'Pages/Manage-Books.html')
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
    return render(request, 'Pages/Sign-Up.html')
