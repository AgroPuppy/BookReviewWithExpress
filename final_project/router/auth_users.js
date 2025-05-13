const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  // Extract email parameter and find users with matching email
  const isbn = req.params.isbn;
  let currentUser = req.session.authorization.username;
  let content = req.body["content"];
  let rating = req.body["rating"];
  let addOrUpdateMessage =
    books[isbn].reviews[currentUser] === undefined
      ? "Added new review"
      : "Updated review";

  review = { content: content, rating: rating };
  books[isbn].reviews[currentUser] = review;

  res.send(addOrUpdateMessage + " successfully");
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here

  // Extract email parameter and find users with matching email
  const isbn = req.params.isbn;
  let currentUser = req.session.authorization.username;

  if (books[isbn].reviews[currentUser] !== undefined) {
    delete books[isbn].reviews[currentUser];
    res.send(`Your review for  ${books[isbn].title} has been removed`);
  } else {
    res.send(
      `You have not yet made a review for ${books[isbn].title}, or it has been removed`
    );
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
