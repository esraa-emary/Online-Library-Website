from django.contrib import admin
from .models import User,Book,Category,BorrowedBook
admin.site.register(User)
admin.site.register(Book)
admin.site.register(Category)
admin.site.register(BorrowedBook)


# Register your models here.
