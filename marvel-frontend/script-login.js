const loginName = document.querySelector("#loginName");
const loginPassword = document.querySelector("#loginPassword");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const myStorage = window.localStorage;
// const serverURL = 'https://mmd.ucn.dk:8558'; // mmd.ucn.dk host

loginBtn.addEventListener(
  "click",
  (e) => {
    console.log(e);
    //e.preventDefault(); // to avoid page refresh and lose all the data from the input fields!

    // // basic html5 validation for e-mail:: a@a.a
    // check if there is input (both e-mail and password)
    // send "login" request to api

    if (!(loginName.value && loginPassword.value)) {
      alert("Enter e-mail and password!");
    } else {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          alert(`Login successful:`);
        }
        if (this.readyState == 4 && this.status >= 400) {
          alert(`Login unsuccessful, error: ${this.status}`);
          const data = JSON.parse(xhttp.responseText);
          console.log(data);
          // render DOM elements with the info we got back -e.g. 'hello user'
          myStorage.setItem("currentUser", xhttp.responseText);
        }
      };
      xhttp.open("POST", "http://127.0.0.1:8558/api/login");
      xhttp.setRequestHeader("Content-Type", "application/json");

      const payload = {
        userName: loginName.value,
        password: loginPassword.value,
      };

      xhttp.send(JSON.stringify(payload));
    }
  },
  false
);

logoutBtn.addEventListener("click", (e) => {
  console.log(e);
  myStorage.removeItem("currentUser");
  alert("you are now logged out:)");
});
