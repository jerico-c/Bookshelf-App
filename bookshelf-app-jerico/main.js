document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "BOOKSHELF_APP";
    let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const bookForm = document.getElementById("bookForm");
    const searchBookForm = document.getElementById("searchBook");
    const searchBookTitle = document.getElementById("searchBookTitle");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    const searchMessage = document.createElement("p");
    searchMessage.style.color = "red";
    searchMessage.style.fontWeight = "bold";
    searchMessage.style.display = "none";
    searchBookForm.appendChild(searchMessage);
    let editingBookId = null;

    function saveBooks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }

    function renderBooks(filter = "") {
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";
        searchMessage.style.display = "none";
        
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(filter.toLowerCase()));
        
        if (filteredBooks.length === 0 && filter !== "") {
            searchMessage.textContent = "Buku tidak ditemukan.";
            searchMessage.style.display = "block";
        }
        
        filteredBooks.forEach((book) => {
            const bookElement = document.createElement("div");
            bookElement.setAttribute("data-bookid", book.id);
            bookElement.setAttribute("data-testid", "bookItem");
            bookElement.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
                    <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                    <button data-testid="bookItemEditButton">Edit Buku</button>
                </div>
            `;

            bookElement.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", () => {
                book.isComplete = !book.isComplete;
                saveBooks();
                renderBooks(searchBookTitle.value);
            });

            bookElement.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", () => {
                books = books.filter((b) => b.id !== book.id);
                saveBooks();
                renderBooks(searchBookTitle.value);
            });

            bookElement.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", () => {
                editBook(book);
            });

            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    }

    function editBook(book) {
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;
        editingBookId = book.id;
        document.getElementById("bookFormSubmit").innerText = "Simpan Perubahan";
        document.getElementById("bookForm").scrollIntoView({ behavior: "smooth" });
    }

    function addBookHandler(event) {
        event.preventDefault();
        const title = document.getElementById("bookFormTitle").value;
        const author = document.getElementById("bookFormAuthor").value;
        const year = parseInt(document.getElementById("bookFormYear").value);
        const isComplete = document.getElementById("bookFormIsComplete").checked;

        if (editingBookId !== null) {
            books = books.map(book => book.id === editingBookId ? { ...book, title, author, year, isComplete } : book);
            editingBookId = null;
        } else {
            const newBook = {
                id: Number(new Date()),
                title,
                author,
                year,
                isComplete,
            };
            books.push(newBook);
        }
        
        saveBooks();
        renderBooks(searchBookTitle.value);
        bookForm.reset();
        document.getElementById("bookFormSubmit").innerText = "Masukkan Buku ke Rak";
    }

    bookForm.addEventListener("submit", addBookHandler);

    searchBookForm.addEventListener("submit", (event) => {
        event.preventDefault();
        renderBooks(searchBookTitle.value);
    });

    renderBooks();
});
