from django.urls import path
from . import views
urlpatterns = [
    path('LibraSphere/Home', views.Home, name='Home'),
    path('LibraSphere/About', views.About, name='About'),
    path('LibraSphere/AddBook', views.AddBook, name='AddBook'),
    path('LibraSphere/Bookreveiw', views.Bookreveiw, name='Bookreveiw'),
    path('LibraSphere/BorrowBook', views.BorrowBook, name='BorrowBook'),
    path('LibraSphere/BorrowPage', views.BorrowPage, name='BorrowPage'),
    path('LibraSphere/EditBook', views.EditBook, name='EditBook'),
    path('LibraSphere/ListPage', views.ListPage, name='ListPage'),
    path('LibraSphere/ManageBook', views.ManageBook, name='ManageBook'),
    path('LibraSphere/Search', views.Search, name='Search'),
    path('LibraSphere/Profile', views.Profile, name='Profile'),
    path('LibraSphere/Login', views.Login, name='Login'),
    path('LibraSphere/Signup', views.Signup, name='Signup'),
]