// ELEMENTS
const title=document.getElementById("title");
const author=document.getElementById("author");
const category=document.getElementById("category");
const cover=document.getElementById("cover");
const addBook=document.getElementById("addBook");
const search=document.getElementById("searchBar");
const bookList=document.getElementById("bookList");
const toggleTheme=document.getElementById("toggleTheme");
const historyBtn=document.getElementById("historyBtn");
const historyModal=document.getElementById("historyModal");
const historyList=document.getElementById("historyList");
const closeHistory=document.getElementById("closeHistory");

// LOCAL STORAGE DATA
let books=JSON.parse(localStorage.getItem("books"))||[];
let history=JSON.parse(localStorage.getItem("history"))||[];

// SAVE FUNCTIONS
function saveAll(){
    localStorage.setItem("books",JSON.stringify(books));
    localStorage.setItem("history",JSON.stringify(history));
}

// DISPLAY BOOKS
function displayBooks(list=books){
    bookList.innerHTML="";
    list.forEach((b,i)=> bookList.innerHTML+=`
        <div class="book-card">
            <img src="${b.cover}">
            <h3>${b.title}</h3>
            <p>${b.author}</p>
            <small>${b.category}</small><br>
            ${b.borrowed? 
            `<button class="return-btn" onclick="returnBook(${i})">Return</button>`:
            `<button class="borrow-btn" onclick="borrowBook(${i})">Borrow</button>`}
            <button class="delete-btn" onclick="deleteBook(${i})">Delete</button>
        </div>
    `);
}
displayBooks();

// Add Book
addBook.onclick=()=>{
    if(title.value && author.value && category.value && cover.value){
        books.push({title:title.value,author:author.value,category:category.value,cover:cover.value,borrowed:false});
        saveAll(); displayBooks();
        title.value=author.value=category.value=cover.value="";
    }
};

// Borrow Book
function borrowBook(i){
    books[i].borrowed=true;
    history.push(`Borrowed: ${books[i].title} by ${books[i].author}`);
    saveAll(); displayBooks();
}

// Return Book
function returnBook(i){
    books[i].borrowed=false;
    history.push(`Returned: ${books[i].title}`);
    saveAll(); displayBooks();
}

// Delete Book
function deleteBook(i){
    if(confirm("Delete this book?")){
        books.splice(i,1);
        saveAll(); displayBooks();
    }
}

// Search Feature
search.onkeyup=()=>{
    const key=search.value.toLowerCase();
    displayBooks(books.filter(b=>
        b.title.toLowerCase().includes(key) ||
        b.author.toLowerCase().includes(key) ||
        b.category.toLowerCase().includes(key)
    ));
};

// Category Filter
document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.onclick=()=>{
        let cat=btn.dataset.category;
        displayBooks(cat=="all"?books:books.filter(b=>b.category==cat));
    };
});

// History Modal
historyBtn.onclick=()=>{
    historyList.innerHTML=history.map(h=>`<li>${h}</li>`).join("");
    historyModal.style.display="flex";
}
closeHistory.onclick=()=> historyModal.style.display="none";

// Theme Toggle
toggleTheme.onclick=()=>{
    document.body.classList.toggle("dark");
}
