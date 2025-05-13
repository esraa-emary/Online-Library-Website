from django.contrib import admin
from .models import User,Book,Category,borrowedBook
admin.site.register(User)
admin.site.register(Book)
admin.site.register(Category)
admin.site.register(borrowedBook)


# Register your models here.
