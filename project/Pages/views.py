from django.http import HttpResponse 
from django.shortcuts import render,get_object_or_404, redirect
from django.http import JsonResponse
from .models import User,Book,Category,BorrowedBook
from django.db.models import Q
# Create your views here.
# Homez
def Home(request):
    books=Book.objects.all()
    try:
        username= request.session.get('user')
        user= User.objects.get(Email=username)
        print(user.Fname)
        return render(request, 'index.html',{'user': user,'books':books})
    except:   
            return render(request, 'index.html',{'books':books})
# About
def About(request):
    try:
        userName= request.session.get('user')
        if userName != None:
            user = User.objects.get(Email=userName)
            return render(request, 'Pages/About-Us.html',{'user': user})
    except:
        return render(request, 'Pages/About-Us.html')

#return books in search


def searchBooks(request):
    query = request.GET.get("q")
    results = Book.objects.filter(
        Q(Title__icontains=query)|
        Q(Author__icontains=query)|
        Q(category__category__icontains=query)

    ) 

    titles=results.values_list("Title")
    return JsonResponse(list(titles),safe=False)

  
    
    

# Book Reveiw
def Bookreveiw(request):
    title= request.GET.get('title')
    book = Book.objects.get(Title=title)
    username= request.session.get('user')
    if username != None:
        user = User.objects.get(Email=username)
        return render(request, 'Pages/Book-Review.html', {'book': book,'user': user})
    else:
        user = None
        return render(request, 'Pages/Book-Review.html', {'book': book})
# Borrow Book
def BorrowBook(request):
    print(1)
    title = request.GET.get('title')
    print(title)
    book = Book.objects.get(Title=title)
    username = request.session.get('user')
    user= User.objects.get(Email=username)
    if request.method == 'POST':
        if book.available == True:
            bookborrowed = BorrowedBook(user=user, book=book)
            bookborrowed.save()
            book.available = False
            book.save()
            return JsonResponse({})

    return render(request, 'Pages/Borrow-Page.html', {'user': user, 'book': book})


# borrowed books
def BorrowedBooks(request):
    username= request.session.get('user')
    user= User.objects.get(Email=username)
    borrowed= BorrowedBook.objects.filter(user=user)
    if request.method == 'POST':
        title = request.POST.get('title')
        print(title,"+++++++++++++++++++++++++++++++++++")
        book = Book.objects.get(Title=title)
        BorrowedBook.objects.filter(user=user, book=book).delete()
        book.available = True
        book.save()
        return JsonResponse({'success': True})

    return render(request, 'Pages/Borrowed-Books.html',{'user': user ,'borrowed': borrowed})


# Borrow Page
def BorrowPage(request):
    userName= request.session.get('user')
    if userName != None:
        user = User.objects.get(Email=userName)
        return render(request, 'Pages/Borrow-Page.html',{'user': user})
    else:
        return render(request, 'Pages/Borrow-Page.html')


# List Book
def ListPage(request):
    books = Book.objects.all()
    categories = Category.objects.all()
    try:
        userName= request.session.get('user')
        if userName != None:
            user = User.objects.get(Email=userName)
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
    userName= request.session.get('user')   
    user = User.objects.get(Email=userName)
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
    userEmail = request.session.get('user')
    currentuser = User.objects.get(Email=userEmail)
    if request.method == "POST":  # When the form is submitted
        newName = request.POST.get('user')
        newEmail = request.POST.get('email')
        newphone = request.POST.get('phone')

        newgender = request.POST.get('gender')
        users = User.objects.all()
        for user in users:
            if user.Email == newEmail and user.Email != currentuser.Email:
                return JsonResponse({'type':'erroremail','error_message': 'Username or email already exists'})
        if newName != None:
            currentuser.Fname = newName
            currentuser.Email = newEmail
            if(newphone != ""):
             currentuser.Phone = newphone
            else:
             currentuser.Phone = None 
            currentuser.sex = newgender
            currentuser.save()
            request.session.flush()  
            request.session['user'] = newEmail
            return JsonResponse({'success': True, 'user': newName})
   
    return render(request, 'Pages/Profile.html',{'user':currentuser})
def ManageBooks(request):
    userName= request.session.get('user')
    user=User.objects.get(Email=userName)
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

    username=request.session.get('user')
    user=User.objects.get(Email=username)

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
    name=request.session.get('user')
    user=User.objects.get(Fname=name)
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
    request.session.flush()  
    if request.method == "POST": 
        userName = request.POST.get('email')
        password = request.POST.get('password')

        if userName and password:
            try:
                user = User.objects.get(Email=userName)
                if user.Password == password:
                    request.session['user'] = userName
                    return JsonResponse({'success': True, 'user': userName})
                else:
                    return JsonResponse({'success': False, 'error_message': 'Invalid username or password.'})
            except User.DoesNotExist:
                return JsonResponse({'success': False, 'error_message': 'Invalid username or password.'})
        else:

            return JsonResponse({'success': False, 'error_message': 'Both fields are required.'})
    return render(request, 'Pages/Log-In.html')



# Signup
def Signup(request):
    username = request.POST.get('userName')
    email = request.POST.get('email')
    password = request.POST.get('password')
    confirm = request.POST.get('confirmPassword')
    users= User.objects.all()
    isadmin=request.POST.get('role')
    for user in users:
        if user.Email == email:
            return JsonResponse( {'type':'erroremail','error_message': 'Email already exists'})
    if password != confirm:
        return JsonResponse( {'type':'errorpassword','error_message': 'Password does not match'})
    if username and email and password and confirm:
        if(isadmin=='admin'):
            user = User(Fname=username, Email=email, Password=password,isadmin=True)
            user.save()
        else:
            user = User(Fname=username, Email=email, Password=password,isadmin=False)
            user.save()
        return JsonResponse({ 'success': True})
    return render(request,'Pages/Sign-Up.html')

  