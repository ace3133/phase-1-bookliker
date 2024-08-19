document.addEventListener("DOMContentLoaded", function () {
    fetchBooks()

});
const ulList = document.getElementById("list");
const bookInfo = document.getElementById("show-panel");

function fetchBooks() {
    fetch("http://localhost:3000/books")
        .then(res => res.json())
        .then(books => {
            Object.values(books).forEach((book) => {
                makeBookList(book)
            })
        })
}
function makeBookList(book) {
    const li = document.createElement("li");
    ulList.appendChild(li);
    li.innerHTML = book.title;
    li.addEventListener("click", () => {
        bookInfo.innerHTML = `<img src =${book.img_url}  height = "250" width = "150" > <h2>${book.title}</h2>   <h2>${book.subtitle}</h2>   <h3>${book.author}</h3>  <p>${book.description}</p> <ul id="ul"></ul> <button>LIKE</button>`
        let userUl = bookInfo.querySelector("#ul")
        book.users.forEach((user) => {
            let userli = document.createElement("li");
            userUl.appendChild(userli);
            userli.textContent = user.username
        })
        let likeBtn = bookInfo.querySelectorAll("button");
        likeBtn.forEach((btn) => {
            createButton(btn, book)
        })

    }
    )
}

function createButton(btn, book) {
    btn.addEventListener("click", () => {
        const currentUser = { "id": 1, "username": "pouros" };

        if (btn.innerHTML === "LIKE") {
            btn.innerHTML = "UNLIKE";

            const updatedUsers = [...book.users, currentUser];
            fetch(`http://localhost:3000/books/${book.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ users: updatedUsers })
            })
                .then(res => res.json())
                .then(data=>{
                    book.users = updatedUsers;
                    let userUl = bookInfo.querySelector('#ul')
                    let userli = document.createElement("li")
                  userUl.appendChild(userli)
                  userli.textContent = currentUser.username
                })

        } else if (btn.innerHTML === "UNLIKE") {
            btn.innerHTML = "LIKE";

            const updatedUsers = book.users.filter(user => user.id !== currentUser.id);

            fetch(`http://localhost:3000/books/${book.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ users: updatedUsers })
            })
                .then(res => res.json())
                .then(data => {
                    // Update the book's users array
                    book.users = updatedUsers;

                    // Remove the current user from the user list in the DOM
                    let userUl = bookInfo.querySelector("#ul");
                    let userLiToRemove = Array.from(userUl.children).find(li => li.textContent === currentUser.username);
                    if (userLiToRemove) {
                        userUl.removeChild(userLiToRemove);
                    }
                })
                .catch(error => console.error("Error:", error));
        }
    });
}
