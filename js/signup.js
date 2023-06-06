// Handle form submission
var signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from submitting normally

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var username = document.getElementById("username").value;
  
  // Create a new user with email and password
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      // Signup successful
      var user = userCredential.user;
      console.log("User created:", user);

            // Update the user's display name
      user
        .updateProfile({
          displayName: username
        })
        .then(function() {
          // Display name updated successfully
          console.log("User display name updated to: " + username);

          // Redirect the user to the login page or any other desired page
          window.location.href = "/index.html";
        })
        .catch(function(error) {
          // An error occurred while updating the display name
          console.error("Error updating user display name: ", error);
        });

    })
    .catch(function (error) {
      // Signup failed
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Signup error:", errorCode, errorMessage);
    });
});
