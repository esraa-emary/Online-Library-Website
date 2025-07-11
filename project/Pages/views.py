from django.shortcuts import render,get_object_or_404, redirect
from django.http import JsonResponse
from .models import User,Book,Category,borrowedBook
from django.db.models import Q
# Create your views here.
# Home
def Home(request):
    books=Book.objects.all()
    try:
        username= request.GET.get('user')
        user= User.objects.get(Name=username)
        return render(request, 'index.html',{'user': user,'books':books})
    except:   
            return render(request, 'index.html',{'books':books})
# About
def About(request):
    try:
        userName= request.GET.get('user')
        if userName != None:
            user = User.objects.get(Name=userName)
            return render(request, 'Pages/About-Us.html',{'user': user})
    except:
        return render(request, 'Pages/About-Us.html')

# Book Reveiw
def Bookreveiw(request):
    title= request.GET.get('title')
    book = Book.objects.get(Title=title)
    username= request.GET.get('user')
    if username != None:
        user = User.objects.get(Name=username)
        return render(request, 'Pages/Book-Review.html', {'book': book,'user': user})
    else:
        user = None
        return render(request, 'Pages/Book-Review.html', {'book': book})
# Borrow Book
def BorrowBook(request):
    title = request.GET.get('title')
    username = request.GET.get('user')
    book = Book.objects.get(Title=title)
    user= User.objects.get(Name=username)
    if request.method == 'POST':
        if book.available == True:
            bookborrowed = borrowedBook(user=user, book=book)
            bookborrowed.save()
            book.available = False
            book.save()
            return JsonResponse({})

    return render(request, 'Pages/Borrow-Page.html', {'user': user, 'book': book})


# borrowed books
def BorrowedBooks(request):
    username= request.GET.get('user')
    user= User.objects.get(Name=username)
    borrowed= borrowedBook.objects.filter(user=user)
    if request.method == 'POST':
        title = request.POST.get('title')
        book = Book.objects.get(Title=title)
        borrowedBook.objects.filter(user=user, book=book).delete()
        book.available = True
        book.save()
        return JsonResponse({'success': True})

    return render(request, 'Pages/Borrowed-Books.html',{'user': user ,'borrowed': borrowed})


# Borrow Page
def BorrowPage(request):
    userName= request.GET.get('user')
    if userName != None:
        user = User.objects.get(Name=userName)
        return render(request, 'Pages/Borrow-Page.html',{'user': user})
    else:
        return render(request, 'Pages/Borrow-Page.html')


# List Book
def ListPage(request):
    books = Book.objects.all()
    categories = Category.objects.all()
    try:
        userName= request.GET.get('user')
        if userName != None:
            user = User.objects.get(Name=userName)
            context = {
            'books': books,
            'categories': categories,
            'user': user
            }
    except:
        
        context = {
            'books': books,
            'categories': categories,

        }   
    return render(request, 'Pages/List-Page.html', context)

# Search
def Search(request):
    userName= request.GET.get('user')   
    user = User.objects.get(Name=userName)
    query = request.GET.get('q')
    results = Book.objects.filter(
        Q(Title__icontains=query)|
        Q(Author__icontains=query)|
        Q(category__category__icontains=query)

    ) 
    return render(request, 'Pages/Search.html', {
        'query': query,
        'books': results,
        'user':user
    })    
   
# Profile
def Profile(request):
    userName = request.GET.get('user')
    currentuser = User.objects.get(Name=userName)
    if request.method == "POST":  # When the form is submitted
        userName = request.GET.get('user')
        newName = request.POST.get('user')
        newEmail = request.POST.get('email')
        newphone = request.POST.get('phone')

        newgender = request.POST.get('gender')
        users = User.objects.all()
        for user in users:
            if user.Name == newName and user.Name != currentuser.Name:
                return JsonResponse({'type':'erroruser','error_message': 'Username or email already exists'})
            if user.Email == newEmail and user.Email != currentuser.Email:
                return JsonResponse({'type':'erroremail','error_message': 'Username or email already exists'})
        if newName != None:
            currentuser.Name = newName
            currentuser.Email = newEmail
            if(newphone != ""):
             currentuser.Phone = newphone
            else:
             currentuser.Phone = None 
            currentuser.sex = newgender
            currentuser.save()
            return JsonResponse({'success': True, 'user': newName})
   
    return render(request, 'Pages/Profile.html',{'user':currentuser})
def ManageBooks(request):
    userName= request.GET.get('user')
    user=User.objects.get(Name=userName)
    books=Book.objects.all()
    categories=Category.objects.all()
    if request.method=="POST":
        title=request.POST.get('title')
        book=Book.objects.get(Title=title)
        book.delete()
        # Delete empty categories
        for category in categories:
            if not Book.objects.filter(category=category).exists():
             category.delete()

    return render(request,'Pages\Manage-Books.html',{'user':user , 'books':books , 'categories':categories})
def AddBooks(request):

    username=request.GET.get('user')
    user=User.objects.get(Name=username)

    if request.method == "POST": 
        title=request.POST.get('title')
        author=request.POST.get('author')
        category=request.POST.get('category')
        try :
            findCategory=Category.objects.get(category=category)
        except :
            category1=Category(category=category)
            category1.save() 
        price=request.POST.get('price')
        description=request.POST.get('description')
        avaliable=request.POST.get('availability')
        image=request.FILES.get('cover')
        getcategory=Category.objects.get(category=category)
        if avaliable == "available":
            book=Book(Title=title,Author=author,category=getcategory,Price=price,available=True,image=image)
            book.save()
        else:
            book=Book(
                Title=title,
                Author=author,
                category=getcategory,
                Price=price,
                available=False,
                description=description,
                image=image
            )
            book.save()    
    return render(request,'Pages\Add-Book.html',{'user':user})
def EditBooks(request):
    title=request.GET.get('title')
    book=Book.objects.get(Title=title)
    name=request.GET.get('user')
    user=User.objects.get(Name=name)
    if request.method == "POST": 
        title=request.POST.get('title')
        author=request.POST.get('author')
        category=request.POST.get('category')
        try :
            findCategory=Category.objects.get(category=category)
        except Book.DoesNotExist:
            category1=Category(category=category)
            category1.save() 
        book.Author=author
        book.Price=request.POST.get('price')
        book.description=request.POST.get('description')
        avaliable=request.POST.get('availability')
        if avaliable == "available":
            book.available=True
        else:
            book.available=False    
        book.category=Category.objects.get(category=category)
        book.save()
        


    return render(request,'Pages\Edit-Book.html',{'book':book,'user':user})
    
# Login
def Login(request):
    
    if request.method == "POST": 
        userName = request.POST.get('userName')
        password = request.POST.get('password')

        if userName and password:
            try:
                user = User.objects.get(Name=userName)
                if user.Password == password:
                    # Return a JSON response indicating success
                    return JsonResponse({'success': True, 'user': userName})
                else:
                    # Return an error message if username or password is incorrect
                    return JsonResponse({'success': False, 'error_message': 'Invalid username or password.'})
            except User.DoesNotExist:
                # Return an error message if the user does not exist
                return JsonResponse({'success': False, 'error_message': 'Invalid username or password.'})
        else:
            # Return an error message if fields are missing
            return JsonResponse({'success': False, 'error_message': 'Both fields are required.'})

    # For GET requests (when the login page is first loaded), render the login page
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
            return JsonResponse( {'type':'erroruser','error_message': 'Username already exists'})
        if user.Email == email:
            return JsonResponse( {'type':'erroremail','error_message': 'Email already exists'})
    if password != confirm:
        return JsonResponse( {'type':'errorpassword','error_message': 'Password does not match'})
    return render(request, 'Pages/Sign-Up.html')
    
def ValidateSignup(request):
    username = request.POST.get('userName')
    email = request.POST.get('email')
    password = request.POST.get('password')
    confirm = request.POST.get('confirmPassword')
    users= User.objects.all()
    isadmin=request.POST.get('role')
    for user in users:
        if user.Name == username:
            return JsonResponse( {'type':'erroruser','error_message': 'Username already exists'})
        if user.Email == email:
            return JsonResponse( {'type':'erroremail','error_message': 'Email already exists'})
    if password != confirm:
        return JsonResponse( {'type':'errorpassword','error_message': 'Password does not match'})
    if username and email and password and confirm:
        if(isadmin=='admin'):
            user = User(Name=username, Email=email, Password=password,isadmin=True)
            user.save()
        else:
            user = User(Name=username, Email=email, Password=password,isadmin=False)
            user.save()
        return JsonResponse({ 'success': True})