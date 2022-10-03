// Check for authorization
function beforeLoad(jwt, userId) {
  fetch("https://whelp-backend.herokuapp.com/api/auth/is-user", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: jwt,
      userId: userId,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((ans) => {
      if (ans.isLoggedIn) {
        const link = document.createElement("a");
        link.href = `/index.html`;
        link.click();
      }
    })
    .catch((error) => {
      if (!error.response) {
        console.log("Network Error");
      } else {
        console.log(err);
      }
    });
}
beforeLoad(
  window.localStorage.getItem("jwt"),
  window.localStorage.getItem("user")
);

function set_error(element, msg) {
  element.value = "";
  element.classList.add("error_input");
  element.placeholder = msg;
  setTimeout(() => {
    element.classList.remove("error_input");
    element.placeholder = "";
  }, 5000);
}

function login(e) {
  if (e) e.preventDefault();
  let email = document.querySelector("#login_email");
  let password = document.querySelector("#login_pass");
  let req_email = "";
  let req_pass = "";
  if (!email.value) {
    set_error(email, "Please fill this field");
    return;
  } else {
    req_email = email.value;
  }

  if (!password.value) {
    set_error(password, "Please fill this field");
    return;
  } else {
    req_pass = password.value;
  }

  const btn = document.querySelector(".login_btn");
  btn.disabled = true;

  fetch("https://whelp-backend.herokuapp.com/api/auth/login", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: req_email,
      password: req_pass,
    }),
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      throw res.json();
    })
    .then((parsedData) => {
      window.localStorage.setItem("user", parsedData.user.id);
      window.localStorage.setItem("user_id", parsedData.user.user_id);
      window.localStorage.setItem("jwt", parsedData.token);
    })
    .then(() => {
      btn.disabled = false;
      const link = document.createElement("a");
      link.href = `/index.html`;
      link.click();
    })
    .catch(async (err) => {
      btn.disabled = false;
      const obj = await err;
      if (obj.param === "email") {
        set_error(email, obj.msg);
      } else if (obj.param === "password") {
        set_error(password, obj.msg);
      }
    });
}
