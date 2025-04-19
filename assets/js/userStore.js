// -------------------------------> user Store
export let userStore = {
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
            window.location.href = "index.html";
            // window.location.href = user.isAdmin ? "Manage-Books.html" : "Home.html";
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