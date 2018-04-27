function pageLoaded() {
  var username = document.getElementById("usernameInput");
  var password = document.getElementById('passwordInput');
  var logIn = document.getElementById("submitLogin");

  function checkUsername() {
    window.location = "/chat.html";
    // if (username === "test") {
    //   if (password === "test") {
    //
    //   }
    // }
  }

  logIn.addEventListener("click", checkUsername);
}
