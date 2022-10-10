const peoples = document.querySelectorAll(".people");
const chat = document.querySelector(".chatBox");

peoples.forEach((p) => {
  p.addEventListener("click", () => {
    chat.classList.toggle("active");
  });
});

const profile = document.querySelector(".info .left img");
const profile_click2 = document.querySelector(".info .left h3");
const userInfo = document.querySelector(".userInfo");

profile.addEventListener("click", () => {
  userInfo.classList.toggle("active");
});
profile_click2.addEventListener("click", () => {
  userInfo.classList.toggle("active");
});

const close2 = document.querySelector("#close2");
const close1 = document.querySelector("#close");

close1.addEventListener("click", () => {
  chat.classList.toggle("active");
  location.reload();
});

close2.addEventListener("click", () => {
  userInfo.classList.toggle("active");
});
