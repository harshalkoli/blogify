let loggedinuser = null;
let userid = null;
// Check if user is logged in
firebase.auth().onAuthStateChanged(function (user) {
  var isLoggedIn = !!user; // Convert user object to boolean value
  var navbar = document.getElementById("navbar");
  var createPostLink = navbar.querySelector('a[href="create.html"]');
  var logout = document.getElementById("logout-button");
  const signuplink = navbar.querySelector('a[href="signup.html"]');
  const loginlink = navbar.querySelector('a[href="login.html"]');
  var usernameLabel = document.getElementById("username-label");

  if (isLoggedIn) {
    // User is logged in, show all navigation links
    createPostLink.style.display = "inline";
    logout.style.display = "inline";
    signuplink.style.display = "none";
    loginlink.style.display = "none";
    console.log("logged in");
    navbar.classList.remove("hidden-links");

    // Get the currently logged-in user
    var user = firebase.auth().currentUser;

    // Check if the user is logged in
    if (user) {
      // User is logged in
      var username = user.displayName;
      let Uid = user.uid;

      loggedinuser = username;
      userid = Uid;

      // Use the username as needed
      console.log("Logged-in username: " + username);

      // Display the username in the navbar
      usernameLabel.textContent = "Welcome, " + username;
    } else {
      // User is not logged in
      console.log("No user is currently logged in");
    }
  } else {
    // User is not logged in, hide the "Home" and "Create Post" links
    createPostLink.style.display = "none";
    logout.style.display = "none";
    usernameLabel.style.display = "none";
    navbar.classList.add("hidden-links");
    signuplink.style.display = "inline";
    loginlink.style.display = "inline";
    loggedinuser = null;
    userid = null;
  }
});

// Log out the user when the button is clicked
var logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", function () {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful
      console.log("User logged out");
      // Perform any additional actions after logout here
    })
    .catch(function (error) {
      // An error occurred
      console.error("Sign-out error:", error);
    });
});

// Get a reference to the Firebase database
var database = firebase.database();

var contentSection = document.getElementById("content");
contentSection.innerHTML = "";

// Retrieve the data from the database
database.ref("posts").on("value", function (snapshot) {
  contentSection.innerHTML = ""; // Clear the content section

  snapshot.forEach(function (childSnapshot) {
    var post = childSnapshot.val();
    var postTitle = post.title;
    var postAuthor = post.author;
    var postContent = post.content;
    var postLikes = post.likes || 0;
    var postComments = post.comments || [];
    var likedUsers = post.likedUsers || {};

    // Create the HTML elements to display the post
    var postElement = document.createElement("div");
    postElement.className = "post";
    postElement.classList.add("post");

    var titleElement = document.createElement("h2");
    titleElement.textContent = postTitle;
    titleElement.classList.add("post-title");

    var authorElement = document.createElement("p");
    authorElement.textContent = "By " + postAuthor;
    authorElement.classList.add("post-author");

    var contentElement = document.createElement("p");
    contentElement.textContent = postContent;
    contentElement.classList.add("post-content");

    // Create the like button and count display
    var likeButton = document.createElement("button");
    // likeButton.textContent = "Like";
    likeButton.classList.add("like-button");

    var likeCount = document.createElement("span");
    likeCount.textContent = postLikes + " Likes";
    likeCount.classList.add("like-count");

    // Attach event listener to the like button
    likeButton.addEventListener("click", function () {
      // Check if the current user is logged in
      if (!userid) {
        // Redirect to the login page
        window.location.href = "login.html"; // Replace "login.html" with the actual login page URL
        return; // Exit the function to prevent further execution
      }
      // Check if the current user has already liked the post
      if (!likedUsers[userid]) {
        // Increment the like count and update the database
        var newLikes = postLikes + 1;
        childSnapshot.ref.child("likes").set(newLikes);

        // Store the user identifier in the likedUsers object
        likedUsers[userid] = true;
        childSnapshot.ref.child("likedUsers").set(likedUsers);
      }
    });

    // Create the comment section
    var commentSection = document.createElement("div");
    commentSection.className = "comment-section";

    // Convert postComments to an array and iterate over it
    Object.values(postComments).forEach(function (comment) {
      var commentElement = document.createElement("div");
      commentElement.className = "comment";
      commentElement.textContent =
        comment.commentAuthor + ": " + comment.commentContent;
      commentSection.appendChild(commentElement);
    });

    // Create the form to enter a new comment
    var commentForm = document.createElement("form");
    commentForm.className = "comment-form"; // Add the class name to the form element
    commentForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var commentInput = event.target.elements.commentInput;
      var commentContent = commentInput.value.trim();
      if (!userid) {
        // Redirect to the login page
        window.location.href = "login.html"; // Replace "login.html" with the actual login page URL
        return; // Exit the function to prevent further execution
      }
      if (commentContent) {
        var newComment = {
          commentId: Date.now().toString(),
          commentAuthor: loggedinuser,
          commentContent: commentContent,
        };
        childSnapshot.ref.child("comments").push(newComment);
        commentInput.value = "";
      }
    });

    var commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.name = "commentInput";
    commentInput.placeholder = "Enter your comment...";
    commentForm.appendChild(commentInput);

    var commentButton = document.createElement("button");
    commentButton.type = "submit";
    commentButton.textContent = "Add Comment";
    commentForm.appendChild(commentButton);

    // Append the post elements to the content section
    postElement.appendChild(titleElement);
    postElement.appendChild(authorElement);
    postElement.appendChild(contentElement);
    postElement.appendChild(likeButton);
    postElement.appendChild(likeCount);
    postElement.appendChild(commentSection);
    postElement.appendChild(commentForm);
    contentSection.appendChild(postElement);
  });
});
