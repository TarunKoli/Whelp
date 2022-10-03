// Check for authorization
function beforeLoad(jwt, userId) {
  fetch("https://whelp-backend.herokuapp.com/api/auth/is-user", {
    method: "POST", // or 'PUT'
    mode: "no-cors",
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
        link.href = `/Whelp/index.html`;
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

function register(e) {
  if (e) e.preventDefault();
  let name = document.querySelector("#full_name");
  let email = document.querySelector("#user_email");
  let pass = document.querySelector("#user_pass");
  let phone = document.querySelector("#mobile");
  let req_email = "";

  if (!name.value) set_error(name, "Please fill this field");
  else if (!phone.value) set_error(phone, "Please fill this field");
  else if (!email.value) set_error(email, "Please fill this field");
  else if (!pass.value) set_error(pass, "Please fill this field");

  req_email = email.value;
  name = name.value;
  phone = phone.value;
  pass = pass.value;

  const btn = document.querySelector(".register_btn");
  btn.disabled = true;

  fetch("https://whelp-backend.herokuapp.com/api/auth/register", {
    method: "POST", // or 'PUT'
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: name,
      email: req_email,
      pass: pass,
      phone: phone,
    }),
  })
    .then((res) => {
      if (res.status === 200) {
        btn.disabled = false;
        const link = document.createElement("a");
        link.href = `/Whelp/sign_in.html`;
        link.click();
      }
      throw res.json();
    })
    .catch(async (err) => {
      btn.disabled = false;
      const obj = await err;
      if (obj.param === "email") {
        set_error(email, obj.msg);
      }
    });
}
