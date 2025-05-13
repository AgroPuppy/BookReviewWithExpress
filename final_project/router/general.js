const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here

  let getBookListPromise = new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(res.send(JSON.stringify({ books }, null, 4)));
      }, 2000);
    } catch (err) {
      reject(err);
    }
  });

  // Notification for the procedure
  console.log("Getting the list of books...");

  getBookListPromise.then(
    // Logging the file data if the promise is resolved
    (data) =>
      //Call the promise and wait for it to be resolved and then print a message.
      console.log("Retrieved successfully"),
    // Logging an error message if the promise is rejected
    (err) => console.log("Error retrieving data")
  );
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  let getBookDetailsPromise = new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(isbnDetails());
      }, 2000);
    } catch (err) {
      reject(err);
    }
  });

  // function for getting isbn details
  const isbnDetails = () => {
    if (books[isbn]) {
      let book = JSON.stringify(books[isbn], null, 3);
      res.send(book);
    } else {
      res.status(404).json({ message: "ISBN number not found" });
    }
  };
  // Notify of the procedure
  console.log(`Fetching the details of book: ${book}...`);

  getBookDetailsPromise.then(
    // Logging the file data if the promise is resolved
    (data) =>
      //Call the promise and wait for it to be resolved and then print a message.
      console.log("Retrieved successfully"),
    // Logging an error message if the promise is rejected
    (err) => console.log("Error retrieving data")
  );
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let searchedAuthor = req.params.author;
  let booksByAuthor = [];

  let getBookAuthorPromise = new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(getAuthor());
      }, 2000);
    } catch (err) {
      reject(err);
    }
  });

  // function for getting details of the book author
  const getAuthor = () => {
    let allbooks = Object.values(books);

    for (let book in allbooks) {
      if (allbooks[book].author === searchedAuthor) {
        booksByAuthor.push(allbooks[book]);
      }
    }

    if (booksByAuthor.length > 0) {
      res.send(JSON.stringify({ BooksFound: booksByAuthor }, null, 4));
    } else {
      res.status(404).json({
        message: "No authors found by the name of: " + searchedAuthor,
      });
    }
  };
  // Notify of the procedure
  console.log(`Fetching books with author: ${searchedAuthor}...`);

  getBookAuthorPromise.then(
    // Logging the file data if the promise is resolved
    (data) =>
      //Call the promise and wait for it to be resolved and then print a message.
      console.log("Retrieved successfully"),
    // Logging an error message if the promise is rejected
    (err) => console.log("Error retrieving data")
  );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let searchedByTitle = req.params.title;
  let booksByTitle = [];
  let allbooks = Object.values(books);

  let getBookTitlePromise = new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(getTitle());
      }, 2000);
    } catch (err) {
      reject(err);
    }
  });

  // Function for getting the book title
  const getTitle = () => {
    for (let book in allbooks) {
      if (allbooks[book].title === searchedByTitle) {
        booksByTitle.push(allbooks[book]);
      }
    }

    if (booksByTitle.length > 0) {
      res.send(JSON.stringify({ BooksFound: booksByTitle }, null, 4));
    } else {
      res.status(404).json({
        message: "No books found with the title of: " + searchedByTitle,
      });
    }
  };
  // Notification for the procedure
  console.log(`Fetching books with title: ${searchedByTitle}...`);

  getBookTitlePromise.then(
    // Logging the file data if the promise is resolved
    (data) =>
      //Call the promise and wait for it to be resolved and then print a message.
      console.log("Retrieved successfully"),
    // Logging an error message if the promise is rejected
    (err) => console.log("Error retrieving data")
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let review = Object.entries(books[isbn].reviews);

  if (review) {
    res.send(JSON.stringify({ Reviews: review }, null, 4));
  } else {
    res.status(404).json({
      message: "No book reviews found with the isbn of: " + isbn,
    });
  }
});

module.exports.general = public_users;
