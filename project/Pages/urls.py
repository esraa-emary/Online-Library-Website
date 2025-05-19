from django.urls import path
from . import views
urlpatterns = [
    path('', views.Home, name='Home'),
    path('LibraSphere/About', views.About, name='About'),
    path('LibraSphere/Bookreveiw', views.Bookreveiw, name='Bookreview'),
    path('LibraSphere/BorrowBook', views.BorrowBook, name='BorrowBook'),
    path('LibraSphere/BorrowPage', views.BorrowPage, name='BorrowPage'),
    path('LibraSphere/ListPage', views.ListPage, name='ListPage'),
    path('LibraSphere/Search', views.Search, name='Search'),
    path('LibraSphere/Profile', views.Profile, name='Profile'),
    path('LibraSphere/Login', views.Login, name='Login'),
    path('LibraSphere/Signup', views.Signup, name='Signup'),
    path('LibraSphere/BorrowedBooks', views.BorrowedBooks, name='BorrowedBooks'),
    path('LibraSphere/ManageBooks',views.ManageBooks,name='ManageBooks'),
    path('LibraSphere/EditBooks',views.EditBooks,name='edit'),
    path('LibraSphere/AddBooks',views.AddBooks,name='Add'),



]