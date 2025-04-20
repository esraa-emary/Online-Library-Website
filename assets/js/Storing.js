
// -------------------------------> Book Store
let bookStore = {
    books: [],

    addBook: function(title, author, price, category, isAvailable = true, description = '', cover = '', returnDate = null) {
        // Validate required fields
        if (!title || !author || !price || !category) {
            alert("Please fill in all required fields!");
            return false;
        }

        // Validate price is a positive number
        if (isNaN(price) || price <= 0) {
            alert("Please enter a valid price!");
            return false;
        }

        const newBook = {title,author,category, 
            price: parseFloat(price).toFixed(2),
            description,
            cover: cover || '../assets/img/default-book.jpg',
            isAvailable,
            returnDate: isAvailable ? null : returnDate || this.calculateReturnDate()
        };

        this.books.push(newBook);
        this.saveToLocalStorage();
        return true;
    },

    calculateReturnDate: function() {
        const today = new Date();
        today.setDate(today.getDate() + 20);
        return today.toISOString().split('T')[0];
    },

    editBook: function(title, author, updates) {
        const bookIndex = this.books.findIndex(book => 
            book.title.toLowerCase() === title.toLowerCase() && 
            book.author.toLowerCase() === author.toLowerCase()
        );
        
        if (bookIndex === -1) {
            alert("Book not found!");
            return false;
        }

        if (updates.title && !updates.title.trim()) {
            alert("Title cannot be empty!");
            return false;
        }

        if (updates.author && !updates.author.trim()) {
            alert("author cannot be empty!");
            return false;
        }

        if (updates.price && (isNaN(updates.price) || updates.price <= 0)) {
            alert("Please enter a valid price!");
            return false;
        }

        const updatedBook = { ...this.books[bookIndex], ...updates };
        
        if (updates.price) {
            updatedBook.price = parseFloat(updates.price).toFixed(2);
        }

        if ('isAvailable' in updates) {
            if (updates.isAvailable) {
                updatedBook.returnDate = null;
            } else if (!updatedBook.returnDate) {
                updatedBook.returnDate = this.calculateReturnDate();
            }
        }

        this.books[bookIndex] = updatedBook;
        this.saveToLocalStorage();
        return true;
    },

    handleAddBookForm: function(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const bookData = {
                title: formData.get('title'),
                author: formData.get('author'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                description: formData.get('description'),
                cover: formData.get('cover'),
                isAvailable: formData.get('availability') === 'available'
            };

            if (this.addBook(
                bookData.title,
                bookData.author,
                bookData.price,
                bookData.category,
                bookData.isAvailable,
                bookData.description,
                bookData.cover
            )) {
                alert("Book added successfully!");
                form.reset();
                if (window.location.pathname.includes("Manage-Books.html")) {
                    this.PrintListOfManageBooks(this.getBooks());
                }
            }
        });
    },

    handleEditBookForm: function(formId, bookTitle, bookauthor) {
        const form = document.getElementById(formId);
        if (!form) return;
         
        const book = this.books.find(b => 
            b.title.toLowerCase() === bookTitle.toLowerCase() && 
            b.author.toLowerCase() === bookauthor.toLowerCase()
        );
        
        if (!book) {
            alert("Book not found!");
            window.location.href = "Manage-Books.html";
            return;
        }

        form.elements['title'].value = book.title;
        form.elements['author'].value = book.author;
        form.elements['price'].value = book.price;
        form.elements['category'].value = book.category;
        form.elements['description'].value = book.description || '';
        form.elements['cover'].value = book.cover || '';
        form.elements['availability'].value = book.isAvailable ? 'available' : 'unavailable';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const updates = {
                title: formData.get('title'),
                author: formData.get('author'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                description: formData.get('description'),
                cover: formData.get('cover'),
                isAvailable: formData.get('availability') === 'available'
            };

            if (this.editBook(bookTitle, bookauthor, updates)) {
                alert("Book updated successfully!");
                if (window.location.pathname.includes("Manage-Books.html")) {
                    this.PrintListOfManageBooks(this.getBooks());
                } else {
                    window.location.href = "Manage-Books.html";
                }
            }
        });
    },

    initEditButtons: function() {
        document.querySelectorAll('.cardBtn.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const title = e.currentTarget.getAttribute('data-title');
                const author = e.currentTarget.getAttribute('data-author');
                
                window.location.href = `Edit-Book.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;
            });
        });
    },

    updateBookStatus: function(title , author, isAvailable) {
        const book = this.books.find(book => book.author === author && book.title === title);
        if (!book) return false;

        book.isAvailable = isAvailable;
        if (!isAvailable) {
            book.returnDate = this.calculateReturnDate();
        } else {
            book.returnDate = null;
        }

        this.saveToLocalStorage();
        return true;
    },

    removeBook: function(title , author) {
        const initialLength = this.books.length;
        this.books = this.books.filter(book => book.title !== title && book.author !== author);
        if (this.books.length < initialLength) {
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },

    getBooks: function() {
        return this.books;
    },
    
    getAvailableBooks: function() {
        return this.books.filter(book => book.isAvailable === true);
    },

    PrintListOfBooks: function(books) {
        const container = document.getElementById("list-books");
        if (!container) return;
        
        container.innerHTML = '';

        const grouped = {};
        books.forEach(book => {
            if (!grouped[book.category]) {
                grouped[book.category] = [];
            }
            grouped[book.category].push(book);
        });

        for (const category in grouped) {
            const section = document.createElement("div");
            section.className = "booktype";

            section.innerHTML = `
                <h2>${category} Books</h2>
                <div class="cards"></div>
            `;

            const cardsContainer = section.querySelector(".cards");

            grouped[category].forEach(book => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                <img src="${book.cover}" alt="${book.title}">
                <div class="card-body">
                    <h5 class="title">${book.title}</h5>
                    <p class="author">${book.author}</p>
                    <p class="price">${book.price}$</p>
                    <span class="availability ${book.isAvailable ? 'available' : 'unavailable'}">
                        ${book.isAvailable ? 'Available' : 'Unavailable until ' + book.returnDate}
                    </span>
                    <div class="card-actions">
                        <a href="Book-Review.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}">
                           <button class="Book-Review-btn">Book Review</button></a>
                           
                        <a href="Borrow-Page.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}">
                            <button class="borrow-btn" ${!book.isAvailable ? 'disabled' : ''}>
                                <i class="fas fa-hand-holding"></i>Borrow
                            </button>
                        </a>
                    </div>
                </div>
            `;
                cardsContainer.appendChild(card);
            });

            container.appendChild(section);
        }
    },

    //-------------------------------------------Function Print Books For Search Page
    
    PrintSearch: function(books) {
        // Get search value from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const searchValue = urlParams.get('q') ? urlParams.get('q').toLowerCase().trim() : '';
        
        const container = document.getElementById("search-page");
        if (!container) {
            console.error("Search container not found");
            return;
        }
    
        container.innerHTML = '';
    
        if (!searchValue) {
            container.innerHTML = `
                <div class="no-results">
                    <p>Please enter a search term to find books</p>
                    <a href="List-Page.html" class="browse-btn">Browse All Books</a>
                </div>
            `;
            return;
        }
    
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchValue) ||
            book.author.toLowerCase().includes(searchValue) ||
            book.category.toLowerCase().includes(searchValue)
        );
    
        if (filteredBooks.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>No results found for "<strong>${searchValue}</strong>"</p>
                    <a href="List-Page.html" class="browse-btn">Browse All Books</a>
                </div>
            `;
            return;
        }
    
        // Create search header
        const header = document.createElement('div');
        header.className = 'search-header';
        container.appendChild(header);
    
        // Group by category
        const grouped = {};
        filteredBooks.forEach(book => {
            if (!grouped[book.category]) {
                grouped[book.category] = [];
            }
            grouped[book.category].push(book);
        });
    
        // Create book sections
        for (const category in grouped) {
            const section = document.createElement("div");
            section.className = "booktype";
            
            const h2 = document.createElement("h2");
            h2.textContent = `${category} Books`;
            section.appendChild(h2);
            
            const cardsContainer = document.createElement("div");
            cardsContainer.className = "cards";
            section.appendChild(cardsContainer);
    
            grouped[category].forEach(book => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <img src="${book.cover}" alt="${book.title}" onerror="this.src='../assets/img/default-book.jpg'">
                    <div class="card-body">
                        <h5 class="title">${book.title}</h5>
                        <p class="author">${book.author}</p>
                        <p class="price">${book.price}$</p>
                        <span class="availability ${book.isAvailable ? 'available' : 'unavailable'}">
                            ${book.isAvailable ? 'Available' : 'Unavailable until ' + book.returnDate}
                        </span>
                        <div class="card-actions">
                            <a href="Book-Review.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}">
                                <button class="Book-Review-btn"><i class="fas fa-book-open"></i> Book Review</button>
                            </a>
                            <a href="Borrow-Page.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}">
                                <button class="borrow-btn" ${!book.isAvailable ? 'disabled' : ''}>
                                    <i class="fas fa-hand-holding"></i> Borrow
                                </button>
                            </a>
                        </div>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
    
            container.appendChild(section);
        }
    },
 
    PrintListOfManageBooks: function(books) {
        const container = document.getElementById("manage-books");
        if (!container) return;
        
        container.innerHTML = '';
    
        const grouped = {};
        books.forEach(book => {
            if (!grouped[book.category]) {
                grouped[book.category] = [];
            }
            grouped[book.category].push(book);
        });
    
        for (const category in grouped) {
            const section = document.createElement("div");
            section.className = "booktype";
    
            const addButton = document.createElement("button");
            addButton.className = "addBookBtn";
            addButton.textContent = "Add Book";
            addButton.addEventListener('click', () => {
                window.location.href = "Add-Book.html";
            });
    
            section.innerHTML = `
                <h2>${category} Books:-</h2>
                <div class="cards"></div>
            `;
    
            section.insertBefore(addButton, section.querySelector("h2"));
    
            const cardsContainer = section.querySelector(".cards");
    
            grouped[category].forEach(book => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <img src="${book.cover}" alt="${book.title}">
                    <div class="card-body">
                        <h5>${book.title}</h5>
                        <p class="author">${book.author}</p>
                        <p class="price">${book.price}$</p>
                        <span class="availability ${book.isAvailable ? 'available' : 'unavailable'}">
                            ${book.isAvailable ? 'Available' : 'Unavailable until ' + book.returnDate}
                        </span>
                        <div class="card-actions">
                            <button class="cardBtn edit" data-title="${book.title}" data-author="${book.author}"><i class="fas fa-edit"></i></button>
                            <button class="cardBtn delete" data-title="${book.title}" data-author="${book.author}"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
    
            container.appendChild(section);
        }
    
        this.addDeleteEventListeners();
        this.initEditButtons();
    },

    addDeleteEventListeners: function() {
        const deleteButtons = document.querySelectorAll('.cardBtn.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const bookauthor = event.currentTarget.getAttribute('data-author');
                const booktitle =  event.currentTarget.getAttribute('data-title');
                this.handleDeleteBook(bookauthor , booktitle);
            });
        });
    },

    handleDeleteBook: function(bookauthor , booktitle) {
        if (confirm('Are you sure you want to delete this book?')) {
            const cardToRemove = document.querySelector(`.delete[data-author="${bookauthor}"][data-title="${booktitle}"]`)?.closest('.card');
            
            if (cardToRemove) {
                cardToRemove.style.transition = 'all 0.3s ease';
                cardToRemove.style.opacity = '0';
                
                setTimeout(() => {
                    if (this.removeBook(booktitle , bookauthor)) {
                        this.PrintListOfManageBooks(this.getBooks());
                    }
                }, 300);
            }
        }
    },

    updateReturnDate: function(bookauthor, booktitle , newReturnDate) {
        const book = this.books.find(book => book.author === bookauthor && book.title === booktitle );
        if (!book) return false;
    
        book.returnDate = newReturnDate;
        this.saveToLocalStorage();
        return true;
    },

    saveToLocalStorage: function() {
        localStorage.setItem('bookStore', JSON.stringify(this.books));
    },

    loadFromLocalStorage: function() {
        try {
            const storedBooks = localStorage.getItem('bookStore');
            if (storedBooks) {
                this.books = JSON.parse(storedBooks);
            }
        } catch (error) {
            console.error("Error loading books from localStorage:", error);
            this.books = [];
        }
    }
};

// -------------------------------> user Store
let userStore = {
    users: [],

    addUser: function(name, email, password, isAdmin) {
        if (this.users.some(user => user.email === email)) {
            alert("User with this email already exists!");
            return false;
        }
        if (this.users.some(user => user.name === name)) {
            alert("Username already taken!");
            return false;
        }

        this.users.push({
            name,
            email,
            password,
            isAdmin,
            borrowedBooks: [],
            readingGoal: 0,
            completedBooks: 0
        });
        this.saveToLocalStorage();
        return true;
    },

    removeUser: function(email) {
        this.users = this.users.filter(user => user.email !== email);
        this.saveToLocalStorage();
    },

    findUserByEmail: function(email) {
        return this.users.find(user => user.email === email);
    },

    Checkuser: function(name, password) {
        return this.users.find(user => user.name === name && user.password === password);
    },

    getCurrentUser: function() {
        const userData = sessionStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    },

    logout: function() {
        sessionStorage.removeItem('currentUser');
    },

    checkUser: function() {
        const password = document.getElementById("password").value;
        const userName = document.getElementById("userName").value;
        const user = this.Checkuser(userName, password);
        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify({
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }));
            alert("Welcome, " + user.name);
            window.location.href = "../index.html";
        } else {
            alert("Invalid credentials. Please try again or Create a new account.");
        }
    },

    setReadingGoal: function(email, goal) {
        const user = this.findUserByEmail(email);
        if (user) {
            user.readingGoal = parseInt(goal) || 0;
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },

    getReadingGoal: function(email) {
        const user = this.findUserByEmail(email);
        return user ? user.readingGoal || 0 : 0;
    },

    addCompletedBook: function(email) {
        const user = this.findUserByEmail(email);
        if (user) {
            user.completedBooks = (user.completedBooks || 0) + 1;
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },

    getCompletedBooks: function(email) {
        const user = this.findUserByEmail(email);
        return user ? user.completedBooks || 0 : 0;
    },

    borrowBook: function(email, booktitle , bookauthor) {

        const user = this.findUserByEmail(email);
        const book = bookStore.books.find(book => book.author === bookauthor && book.title === booktitle);

        const returnDate = bookStore.calculateReturnDate();

        if (!user.borrowedBooks) user.borrowedBooks = [];


        user.borrowedBooks.push({
            title: book.title,
            author: book.author,
            cover: book.cover,
            returnDate: returnDate
        });

        bookStore.updateBookStatus(book.title , book.author, false);
        this.saveToLocalStorage();
        return true;
    },

    returnBook: function(email, bookauthor , booktitle) {
        const user = this.findUserByEmail(email);

        if (!user || !user.borrowedBooks) return false;

        const index = user.borrowedBooks.findIndex(book => book.author === bookauthor && book.title === booktitle);
        
        if (index === -1) return false;

        user.borrowedBooks.splice(index, 1);

        bookStore.updateBookStatus(booktitle , bookauthor, true);
        this.addCompletedBook(email);
        this.saveToLocalStorage();
        return true;
    },

    getBorrowedBooks: function(email) {
        const user = this.findUserByEmail(email);
        return user?.borrowedBooks || [];
    },

    saveToLocalStorage: function() {
        localStorage.setItem('userStore', JSON.stringify(this.users));
    },

    loadFromLocalStorage: function() {
        const storedUsers = localStorage.getItem('userStore');
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        }
    }
};

// -------------------------------> Initialization
bookStore.loadFromLocalStorage();
userStore.loadFromLocalStorage();

// Initialize with sample data if empty
if (bookStore.books.length === 0) {
    // Programming Books
    bookStore.addBook("Semantic Web Programming", "John Hebeler, Matthew Fisher, Ryan Blace, Andrew Parex", 50, "Programming", true, "", "../assets/img/Books/Programming/P (1).jpg");
    bookStore.addBook("Mastery, White Belt", "Anonymous", 70, "Programming", true, "", "../assets/img/Books/Programming/P (2).jpg");
    bookStore.addBook("Programming from the Ground Up", "Jonathan Bartlett", 65, "Programming", true, "", "../assets/img/Books/Programming/P (3).jpg");
    bookStore.addBook("The C++ Programming Language", "Bjarne Stroustrup", 100, "Programming", true, "", "../assets/img/Books/Programming/P (4).jpg");

    // Novel Books
    bookStore.addBook("The Left Hand of God", "Paul Hoffman", 30, "Novel", true, "", "../assets/img/Books/Novel/N (1).jpg");
    bookStore.addBook("The Beast of the Highlands", "L.D. Goffigan", 110, "Novel", true, "", "../assets/img/Books/Novel/N (2).jpg");
    bookStore.addBook("Winter's Arrow", "Kimbra Swain", 90, "Novel", true, "", "../assets/img/Books/Novel/N (3).jpg");
    bookStore.addBook("The Waning", "Kristen Martin", 100, "Novel", true, "", "../assets/img/Books/Novel/N (4).jpg");
    bookStore.addBook("Crime and Punishment", "Fyodor Dostoyevsky", 210, "Novel", false, "", "../assets/img/Books/Novel/N (5).jpg");

    // Psychology Books
    bookStore.addBook("Psychology", "David G. Myers, C. Nathan Dewall", 85, "Psychology", true, "", "../assets/img/Books/Psychology/ps (1).jpg");
    bookStore.addBook("Defy the Stars", "Claudia Gray", 20, "Psychology", true, "", "../assets/img/Books/Psychology/ps (2).jpg");
    bookStore.addBook("Games People Play", "Eric Berne, M.D.", 65, "Psychology", true, "", "../assets/img/Books/Psychology/ps (3).jpg");
    bookStore.addBook("Psychology and You", "Galen E. Cole", 100, "Psychology", true, "", "../assets/img/Books/Psychology/ps (4).jpg");
}

document.addEventListener('DOMContentLoaded', function() {

    // -------------------------- Handle Add Book form if on Add-Book page

    if (document.getElementById('add-book-form')) {
        bookStore.handleAddBookForm('add-book-form');
    }

    // -------------------------- Handle Edit Book form if on Edit-Book page

    if (document.getElementById('edit-book-form')) {
        const urlParams = new URLSearchParams(window.location.search);
        const bookTitle = urlParams.get('title');
        const bookauthor = urlParams.get('author');

        if (bookTitle && bookauthor) {
            bookStore.handleEditBookForm('edit-book-form', bookTitle, bookauthor);
        } else {
            window.location.href = "Manage-Books.html";
        }
    }

    // -------------------------- Handle Borrow Book page

    if (document.getElementById('borrowBtn')) {
        const currentUser = userStore.getCurrentUser();
        
        if (!currentUser) {
            alert('Please login first');
            window.location.href = 'Log-In.html';
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const bookTitle = urlParams.get('title');
        const bookauthor = urlParams.get('author');


        const book = bookStore.books.find(b => b.title === bookTitle && b.author === bookauthor);

        // Populate book details
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('category').value = book.category;
        document.getElementById('price').value = book.price;

        // Handle borrow button
        const borrowBtn = document.getElementById('borrowBtn');

        if (!book.isAvailable) {
            borrowBtn.disabled = true;
            borrowBtn.textContent = 'Not Available';

        } else {
            borrowBtn.addEventListener('click', function() {
                if (userStore.borrowBook(currentUser.email, book.title , bookauthor)) {
                    alert('Book borrowed successfully!');
                    window.location.href = 'Profile.html';
                } else {
                    alert('Failed to borrow book');
                }
            });
        }
    }

    // --------------------------  Handle Profile Page

    if (document.getElementById('profileForm')) {
        const currentUser = userStore.getCurrentUser();
        
        if (!currentUser) {
            alert('Please login first');
            window.location.href = 'Log-In.html';
            return;
        }

        // Form elements
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const maleRadio = document.getElementById('male');
        const femaleRadio = document.getElementById('female');
        const editBtn = document.getElementById('editBtn');
        const saveBtn = document.getElementById('saveBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const readingGoalInput = document.getElementById('readingGoal');
        const completedBooksSpan = document.getElementById('completedBooks');
        const goalNumberSpan = document.getElementById('goalNumber');
        const progressBar = document.getElementById('readingProgress');

        // Load user data
        function loadUserData() {
            const user = userStore.findUserByEmail(currentUser.email);
            if (!user) return;

            nameInput.value = user.name || '';
            emailInput.value = user.email || '';
            phoneInput.value = user.phone || '';
            
            if (user.gender === 'female') {
                femaleRadio.checked = true;
            } else {
                maleRadio.checked = true;
            }

            // Set avatar initials
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            document.getElementById('userAvatar').textContent = initials;

            // Reading goal
            const goal = userStore.getReadingGoal(currentUser.email) || 0;
            const completed = userStore.getCompletedBooks(currentUser.email) || 0;
            
            readingGoalInput.value = goal;
            goalNumberSpan.textContent = goal;
            completedBooksSpan.textContent = completed;

            if (goal > 0) {
                const progress = Math.min(Math.round((completed / goal) * 100), 100);
                progressBar.style.width = `${progress}%`;
                progressBar.textContent = `${progress}%`;
            } else {
                progressBar.style.width = '0%';
                progressBar.textContent = 'Set a goal';
            }
        }

        // Edit button handler
        editBtn.addEventListener('click', function() {
            nameInput.disabled = false;
            maleRadio.disabled = false;
            femaleRadio.disabled = false;
            readingGoalInput.disabled = false;
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
        });

        // Save button handler
        saveBtn.addEventListener('click', function() {
            const user = userStore.findUserByEmail(currentUser.email);
            if (!user) return;

            // Update user data
            user.name = nameInput.value;
            user.gender = femaleRadio.checked ? 'female' : 'male';
            user.phone = phoneInput.value;
            
            // Update reading goal
            userStore.setReadingGoal(currentUser.email, parseInt(readingGoalInput.value));

            // Disable fields after saving
            nameInput.disabled = true;
            maleRadio.disabled = true;
            femaleRadio.disabled = true;
            readingGoalInput.disabled = true;
            
            // Switch buttons
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';

            // Reload data to reflect changes
            loadUserData();
            
            alert('Profile updated successfully!');
        });

        // Cancel button handler
        cancelBtn.addEventListener('click', function() {
            loadUserData();
            nameInput.disabled = true;
            maleRadio.disabled = true;
            femaleRadio.disabled = true;
            readingGoalInput.disabled = true;
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        });

        // Logout handler
        document.getElementById('logout').addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Logout clicked"); // <-- check this
            userStore.logout();
            window.location.href = '../index.html';
        });

        // Initial load
        loadUserData();
    }
    // --------------------------  Handle Book Review page

    if (window.location.pathname.includes("Book-Review.html")) {

    const urlParams = new URLSearchParams(window.location.search);
    const bookTitle = urlParams.get('title');
    const bookAuthor = urlParams.get('author');

    if (!bookTitle || !bookAuthor) {
        console.error("Missing book title or author in URL");
        document.getElementById('bookDetailsContainer').innerHTML = `
            <div class="error-message">
                Invalid book reference. <a href="List-Page.html">Browse books</a>
            </div>
        `;
        return;
    }

    const book = bookStore.books.find(b => 
        b.title === bookTitle && 
        b.author === bookAuthor
    );
    
    if (!book) {
        console.error("Book not found");
        document.getElementById('bookDetailsContainer').innerHTML = `
            <div class="error-message">
                Book not found. <a href="List-Page.html">Browse books</a>
            </div>
        `;
        return;
    }

    // Update the DOM elements - make sure these IDs exist in your HTML
    if (document.getElementById('bookTitle')) {
        document.getElementById('bookTitle').textContent = book.title;
    }
    if (document.getElementById('bookAuthor')) {
        document.getElementById('bookAuthor').textContent = book.author;
    }
    if (document.getElementById('bookCategory')) {
        document.getElementById('bookCategory').textContent = book.category;
    }
    if (document.getElementById('bookPrice')) {
        document.getElementById('bookPrice').textContent = `$${book.price}`;
    }
    if (document.getElementById('bookCover')) {
        document.getElementById('bookCover').src = book.cover || '../assets/img/default-book.jpg';
        document.getElementById('bookCover').alt = book.title;
    }
    if (document.getElementById('bookDescription')) {
        document.getElementById('bookDescription').textContent = book.description || 'No description available';
    }

    // Update availability status
    const statusElement = document.getElementById('bookStatus');
    if (statusElement) {
        if (book.isAvailable) {
            statusElement.textContent = 'Available';
            statusElement.className = 'status-badge available';
        } else {
            statusElement.textContent = `Unavailable until ${book.returnDate}`;
            statusElement.className = 'status-badge unavailable';
        }
    }
    }

    // --------------------------  Initialize book listings (List , Manage , Home)

    try {
        const path = window.location.pathname;

        if (path.includes("Manage-Books.html")) {
            bookStore.PrintListOfManageBooks(bookStore.getBooks());

        }else if (document.getElementById('list-books')) {
            bookStore.PrintListOfBooks(bookStore.getBooks());
        }
    }
    catch (error) {
        console.error("Error loading books:", error);
        const container = document.getElementById("list-books") || document.getElementById("available-books");
        if (container) {
            container.innerHTML = '<div class="error">Failed to load books. Please try again later.</div>';
        }
    }
    // --------------------------  Handle Borrowed Book page

    if (window.location.pathname.includes("Borrowed-Books.html")) {

        const currentUser = userStore.getCurrentUser();
        const borrowedBooksContainer = document.getElementById('borrowedBooksList');
        
        if (!currentUser) {
            borrowedBooksContainer.innerHTML = `
                <div class="no-books-message">
                    <p>Please login to view your borrowed books.</p>
                    <a href="Log-In.html" class="login-btn">Login</a>
                </div>
            `;
            return;
        }
        
        const borrowedBooks = userStore.getBorrowedBooks(currentUser.email);
        
        if (borrowedBooks.length === 0) {

            borrowedBooksContainer.innerHTML = `
                <div class="no-books-message">
                    <p>You haven't borrowed any books yet.</p>
                    <a href="List-Page.html" class="browse-books-btn">Browse Available Books</a>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="borrowing-info">
                <p>You have <span class="borrowed-count">${borrowedBooks.length}</span> 
                book${borrowedBooks.length > 1 ? 's' : ''} currently borrowed</p>
            </div>
        `;
        
        borrowedBooks.forEach(book => {
            const progress = calculateBorrowingProgress(new Date().toISOString().split('T')[0], book.returnDate);
            const timeLeft = getTimeLeft(book.returnDate);
            
            html += `
                <div class="borrowed-book-card" data-book-id="${book.id}">
                    <div class="book-cover">
                        <img src="${book.cover}" alt="${book.title}">
                    </div>
                    <div class="book-details">
                        <h3>${book.title}</h3>
                        <p class="author">${book.author}</p>
                        <div class="borrowing-info">
                            <p><i class="fas fa-clock"></i> Due Date: ${formatDate(book.returnDate)}</p>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${progress}%"></div>
                            </div>
                            <p class="time-left ${timeLeft.includes('Overdue') ? 'overdue' : ''}">
                                ${timeLeft}
                            </p>
                        </div>
                        <div class="book-actions">
                        <button class="return-btn" data-author="${book.author}" data-title="${book.title}">
                          <i class="fas fa-undo"></i> Return Book
                          </button>

                        </div>
                    </div>
                </div>
            `;
        });
        
        borrowedBooksContainer.innerHTML = html;
    

        document.querySelectorAll('.return-btn').forEach(btn => {

            btn.addEventListener('click', function() {

                const bookauthor = this.getAttribute('data-author');
                const bookTitle = this.getAttribute('data-title');

                if (userStore.returnBook(currentUser.email, bookauthor , bookTitle)) {
                    alert('Book returned successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to return book. Please try again.');
                }
            });
        });
    }

});

// Sign-Up Form Handler
document.querySelector('.signUpForm form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.querySelector('input[name="role"]:checked')?.value;
    
    if (!username || !email || !password || !confirmPassword || !role) {
        alert("Please fill all fields!");
        return;
    }
    
    if (password.length < 8) {
        alert("Password must be at least 8 characters long!");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }
    
    const isAdmin = (role === 'admin');
    const success = userStore.addUser(username, email, password, isAdmin);
    
    if (success) {
        alert("Registration successful! Redirecting to login...");
        window.location.href = "Log-In.html";
    }
});

// Log-In Form Handler
document.querySelector('.logInForm form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('userName').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked')?.value;
    
    if (!username || !password || !role) {
        alert("Please fill all fields!");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long!");
        return;
    }
    
    const user = userStore.Checkuser(username, password);
    
    if (user && ((role === 'admin' && user.isAdmin) || (role === 'user' && !user.isAdmin))) {
        sessionStorage.setItem('currentUser', JSON.stringify({
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        }));
        alert("Login successful! Redirecting...");
        window.location.href = "../index.html";
    } else {
        alert("Invalid credentials. Please try again or create a new account.");
    }
});

    // --------------------------  Helper Functions

function displayUserBorrowedBooks() {
    
    const booksContainer = document.getElementById('Books');
    const currentUser = userStore.getCurrentUser();
    
    if (!currentUser) {
        booksContainer.innerHTML = `
            <div class="no-books-message">
                <p>Please login to view your borrowed books.</p>
                <a href="Log-In.html" class="login-btn">Login</a>
            </div>
        `;
        return;
    }
    
    const borrowedBooks = userStore.getBorrowedBooks(currentUser.email);
    
    if (borrowedBooks.length === 0) {
        booksContainer.innerHTML = `
            <div class="no-books-message">
                <h2>Your Borrowed Books</h2>
                <p>You haven't borrowed any books yet.</p>
                <a href="List-Page.html" class="browse-books-btn">Browse Available Books</a>
            </div>
        `;
        return;
    }
    
    let html = `
        <img src="../assets/img/logo.jpg" alt="LibraSphere Logo" class="logoPage">
        <div class="section-header">
            <h1>Your Borrowed Books</h1>
            <div class="borrowing-info">
                <p>You have <span class="borrowed-count">${borrowedBooks.length}</span> 
                book${borrowedBooks.length > 1 ? 's' : ''} currently borrowed</p>
            </div>
        </div>
    `;
    
    const booksByCategory = {};
    borrowedBooks.forEach(book => {
        if (!booksByCategory[book.category]) {
            booksByCategory[book.category] = [];
        }
        booksByCategory[book.category].push(book);
    });
    
    for (const category in booksByCategory) {
        html += `
            <div class="booktype">
                <h2>${category} Books</h2>
                <div class="cards">
        `;
        
        booksByCategory[category].forEach(book => {
            const progress = calculateBorrowingProgress(book.borrowDate, book.returnDate);
            const timeLeft = getTimeLeft(book.returnDate);
            
            html += `
                <div class="card borrowed" data-book-id="${book.id}">
                    <div class="borrowed-badge">Borrowed</div>
                    <img src="${book.cover}" alt="${book.title}">
                    <div class="card-body">
                        <h5>${book.title}</h5>
                        <p class="author">${book.author}</p>
                        <div class="borrowing-details">
                            <p><i class="fas fa-calendar-alt"></i> Borrowed: ${formatDate(book.borrowDate)}</p>
                            <p><i class="fas fa-clock"></i> Due: ${formatDate(book.returnDate)}</p>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${progress}%"></div>
                            </div>
                            <p class="time-left ${timeLeft.includes('Overdue') ? 'overdue' : ''}">
                                ${timeLeft}
                            </p>
                        </div>
                        <div class="card-actions">
                            <button type="button" class="return-btn" data-author="${book.author}">
                                <i class="fas fa-undo"></i> Return
                            </button>
                            <button type="button" class="review-btn" data-title="${book.title}">
                                <i class="fas fa-book-open"></i> Review
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    booksContainer.innerHTML = html;
    
    document.querySelectorAll('.return-btn').forEach(btn => {
        btn.addEventListener('click', handleReturnBook);
    });
    document.querySelectorAll('.review-btn').forEach(btn => {
        btn.addEventListener('click', handleBookReview);
    });
}

function handleReturnBook(event) {
    const bookauthor = event.currentTarget.getAttribute('data-author');
    const booktitle = event.currentTarget.getAttribute('data-title');

    const currentUser = userStore.getCurrentUser();
    
    if (!currentUser) {
        alert('Please login to return books');
        window.location.href = 'Log-In.html';
        return;
    }
    
    if (userStore.returnBook(currentUser.email, bookauthor , booktitle)) {
        alert('Book returned successfully!');
        displayUserBorrowedBooks(); // Refresh the display
        updateReadingProgress(); // Update reading progress if needed
    } else {
        alert('Failed to return book. Please try again.');
    }
}

function handleBookReview(event) {
    const bookauthor = event.currentTarget.getAttribute('data-author');
    const booktitle = event.currentTarget.getAttribute('data-title');

    window.location.href = `Book-Review.html?title=${encodeURIComponent(booktitle)}&author=${encodeURIComponent(bookauthor)}`;
}

function updateReadingProgress() {
    if (document.getElementById('readingProgress')) {
        const currentUser = userStore.getCurrentUser();
        if (currentUser) {
            const completed = userStore.getCompletedBooks(currentUser.email);
            const goal = userStore.getReadingGoal(currentUser.email);
            
            if (goal > 0) {
                const progress = Math.min(Math.round((completed / goal) * 100), 100);
                const progressBar = document.getElementById('readingProgress');
                progressBar.style.width = `${progress}%`;
                progressBar.textContent = `${progress}%`;
            }
        }
    }
}

function calculateProgress(borrowDate, returnDate) {
    if (!borrowDate || !returnDate) return 0;
    
    const borrow = new Date(borrowDate);
    const returnD = new Date(returnDate);
    const today = new Date();
    
    const totalDays = (returnD - borrow) / (1000 * 60 * 60 * 24);
    const daysPassed = (today - borrow) / (1000 * 60 * 60 * 24);
    
    const progress = (daysPassed / totalDays) * 100;
    return Math.min(Math.max(progress, 0), 100);
}

function calculateBorrowingProgress(borrowDate, returnDate) {
    const start = new Date(borrowDate);
    const end = new Date(returnDate);
    const now = new Date();
    
    const total = end - start;
    const passed = now - start;
    
    const progress = (passed / total) * 100;
    return Math.min(Math.max(progress, 0), 100);
}

function getTimeLeft(returnDate) {
    const end = new Date(returnDate);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return 'Overdue! Please return immediately';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} left`;
    }
    if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} left`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

