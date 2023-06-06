// Initialize Firebase
// Handle form submission
var loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from submitting normally

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // Sign in with email and password using Firebase Authentication
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      // Sign-in successful
      var user = userCredential.user;
      console.log("User signed in:", user);
      // You can redirect the user to another page or perform additional actions here
      window.location.href = "/index.html";
    })
    .catch(function (error) {
      // Sign-in failed
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Sign-in error:", errorCode, errorMessage);
    });
});
