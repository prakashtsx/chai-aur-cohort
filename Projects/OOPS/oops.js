class Library {
    constructor() {
        this.books = []; // all books record is here
    }
    addBook(book) {
        this.books.push(book);
    }
}

let jodhpurLibrary = new Library();
jodhpurLibrary.addBook("Do epic shift")