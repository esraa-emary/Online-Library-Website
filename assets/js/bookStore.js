// -------------------------------> Book Store

export let bookStore = {
    books: [],

//-------------------------------------------Function Add Book

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

//-------------------------------------------Function Handle Add Book Form

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

//-------------------------------------------Function Calculate Return Date

    calculateReturnDate: function() {
        const today = new Date();
        today.setDate(today.getDate() + 20);
        return today.toISOString().split('T')[0];
    },

    
//-------------------------------------------Function Edit Book

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

//-------------------------------------------Function Handle Edit Book Form

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


//-------------------------------------------Function Update Book Status

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


//-------------------------------------------Function Remove Book 

    removeBook: function(title , author) {
        const initialLength = this.books.length;
        this.books = this.books.filter(book => book.title !== title && book.author !== author);
        if (this.books.length < initialLength) {
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },
//-------------------------------------------Function Get Book 

    getBooks: function() {
        return this.books;
    },
     
//-------------------------------------------Function Print Books For List Page

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
                           <button class="Book-Review-btn"> <i class="fas fa-book-open"></i> Book Review</button></a>
                           
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

        // Clear previous results
        container.innerHTML = '';

        if (!searchValue) {
            container.innerHTML = `
                <div class="no-results">
                    <p>Please enter a search term to find books</p>
                    <a href="List-Page.html" class="browse-btn">Browse All Books</a>
                </div>
            `;
            console.log("Test case: No search term");
            return;
        } else {
            console.log(`Test case: Search term = "${searchValue}"`);
            // Continue with rest of your function...
        }

        // // Filter books
        // const filteredBooks = books.filter(book =>
        //     book.title.toLowerCase().includes(searchValue) ||
        //     book.author.toLowerCase().includes(searchValue) ||
        //     book.category.toLowerCase().includes(searchValue)
        // );

        // if (filteredBooks.length === 0) {
        //     container.innerHTML = `
        //         <div class="no-results">
        //             <p>No results found for "<strong>${searchValue}</strong>"</p>
        //             <a href="List-Page.html" class="browse-btn">Browse All Books</a>
        //         </div>
        //     `;
        //     return;
        // }

        // // Create search header
        // const header = document.createElement('div');
        // header.className = 'search-header';
        // header.innerHTML = `
        //     <h1>Search Results for "${searchValue}"</h1>
        //     <p>${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''} found</p>
        // `;
        // container.appendChild(header);

        // // Group by category
        // const grouped = {};
        // filteredBooks.forEach(book => {
        //     if (!grouped[book.category]) {
        //         grouped[book.category] = [];
        //     }
        //     grouped[book.category].push(book);
        // });

        // // Create book sections
        // for (const category in grouped) {
        //     const section = document.createElement("div");
        //     section.className = "booktype";
            
        //     const h2 = document.createElement("h2");
        //     h2.textContent = `${category} Books`;
        //     section.appendChild(h2);
            
        //     const cardsContainer = document.createElement("div");
        //     cardsContainer.className = "cards";
        //     section.appendChild(cardsContainer);

        //     grouped[category].forEach(book => {
        //         const card = document.createElement("div");
        //         card.className = "card";
        //         card.innerHTML = `
        //             <img src="${book.cover}" alt="${book.title}" onerror="this.src='../assets/img/default-book.jpg'">
        //             <div class="card-body">
        //                 <h5 class="title">${book.title}</h5>
        //                 <p class="author">${book.author}</p>
        //                 <p class="price">${book.price}$</p>
        //                 <span class="availability ${book.isAvailable ? 'available' : 'unavailable'}">
        //                     ${book.isAvailable ? 'Available' : 'Unavailable until ' + book.returnDate}
        //                 </span>
        //                 <div class="card-actions">
        //                     <a href="Book-Review.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}">
        //                         <button class="Book-Review-btn"><i class="fas fa-book-open"></i> Book Review</button>
        //                     </a>
        //                     <a href="Borrow-Page.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}">
        //                         <button class="borrow-btn" ${!book.isAvailable ? 'disabled' : ''}>
        //                             <i class="fas fa-hand-holding"></i> Borrow
        //                         </button>
        //                     </a>
        //                 </div>
        //             </div>
        //         `;
        //         cardsContainer.appendChild(card);
        //     });

            // container.appendChild(section);
        // }
    },
    
 //-------------------------------------------Function Print Books For Manage Page

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

//-------------------------------------------Function Delete Book 

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

//-------------------------------------------Function Update Return Date 

    updateReturnDate: function(bookauthor, booktitle , newReturnDate) {
        const book = this.books.find(book => book.author === bookauthor && book.title === booktitle );
        if (!book) return false;
    
        book.returnDate = newReturnDate;
        this.saveToLocalStorage();
        return true;
    },


//-------------------------------------------Functions Local Storage (Save , Load)

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
