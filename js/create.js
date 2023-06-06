let loggedinuser = null;
let userid = null;

// Check if user is logged in
firebase.auth().onAuthStateChanged(function (user) {
  var isLoggedIn = !!user; // Convert user object to boolean value
  var navbar = document.getElementById("navbar");
  var logout = document.getElementById("logout-button");
  var usernameLabel = document.getElementById("username-label");

  if (isLoggedIn) {
    // User is logged in, show all navigation links
    logout.style.display = "inline";
    console.log("logged in");

    // Get the currently logged-in user
    var user = firebase.auth().currentUser;

    // Check if the user is logged in
    if (user) {
      // User is logged in
      var username = user.displayName;
      const Uid = user.uid;

      // Use the username as needed
      console.log("Logged-in username: " + username);

      // Display the username in the navbar
      usernameLabel.textContent = "Welcome, " + username;
      usernameLabel.style.display = "inline";
      navbar.classList.remove("hidden-links");
      loggedinuser = username;
      userid = Uid;
    } else {
      // User is not logged in
      console.log("No user is currently logged in");
    }
  } else {
    window.location.href = "/login.html";
    // User is not logged in, hide the "Home" and "Create Post" links
    logout.style.display = "none";
    usernameLabel.style.display = "none";
    navbar.classList.add("hidden-links");
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

// Get a reference to the Firebase Realtime Database
var database = firebase.database();

// Get the form element
var form = document.getElementById("createPostForm");

// Add a submit event listener to the form
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get the form values
  var title = document.getElementById("postTitle").value;
  var content = document.getElementById("postContent").value;

  // Create a new post object
  var postData = {
    title: title,
    author: loggedinuser,
    content: content,
    userid: userid
  };

  // Generate a new key for the post
  var newPostKey = database.ref().child("posts").push().key;

  // Create the updates object to save the post
  var updates = {};
  updates["/posts/" + newPostKey] = postData;

  // Save the post data to the database
  return database
    .ref()
    .update(updates)
    .then(function () {
      // Post data saved successfully
      console.log("Post data saved to Firebase Realtime Database");
      // Reset the form fields if needed
      form.reset();
    })
    .catch(function (error) {
      // An error occurred while saving the post data
      console.error("Error saving post data:", error);
    });
});
