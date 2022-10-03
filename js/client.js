const socket = io("https://whelp-backend.herokuapp.com");

const send = document.querySelector(".plane");
const msgInp = document.querySelector("#msgInp");
const chatContainer = document.querySelector(".chats");
const stat = document.querySelector(".status span");
let Users = new Map();
let currentRoom = {
  roomId: "",
  sender: {},
  reciever: {},
  messages: [],
};

// API's

function renderConversations() {
  fetch("https://whelp-backend.herokuapp.com/api/chat/users")
    .then((data) => {
      return data.json();
    })
    .then((parsedData) => {
      parsedData.data.forEach((user) => {
        Users.set(user.email, user);
        createConversations(user);
      });
    });
}

function findRoom(user, msg, tstmp, dot) {
  fetch(`https://whelp-backend.herokuapp.com/api/chat/is-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reciever: user.user_id,
      sender: window.localStorage.getItem("user_id"),
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.found) {
        msg.textContent = data.msg;
        tstmp.textContent = data.tstmp;
        if (data.active) dot.classList.add("single");
      }
    })
    .catch((err) => {});
}

function createChatBox(user) {
  fetch(`https://whelp-backend.herokuapp.com/api/chat/room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reciever: user._id || user.id,
      sender: window.localStorage.getItem("user"),
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      socket.emit("join-room", {
        roomId: data.room.roomId,
        oldRoom: currentRoom,
      });
      updateChatBox(data.room);
    });
}

// Check for authorization
function beforeLoad(jwt, userId) {
  fetch("https://whelp-backend.herokuapp.com/api/auth/is-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: jwt,
      userId: userId,
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((parsedData) => {
      if (!parsedData.isLoggedIn) {
        const link = document.createElement("a");
        link.href = `http://127.0.0.1:5500/Client/sign_in.html`;
        link.click();
      } else {
        socket.emit("new-user-joined", parsedData.user);
        createUI(parsedData.user);
        renderConversations();
      }
    })
    .catch((err) => {
      const link = document.createElement("a");
      link.href = `http://127.0.0.1:5500/Client/sign_in.html`;
      link.click();
    });
}

beforeLoad(
  window.localStorage.getItem("jwt"),
  window.localStorage.getItem("user")
);

function logout() {
  fetch("https://whelp-backend.herokuapp.com/api/auth/logout", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: window.localStorage.getItem("jwt"),
    }),
  }).then((res) => {
    if (res.status === 200) {
      socket.emit("logout");
      window.localStorage.removeItem("jwt");
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("user_id");
      const link = document.createElement("a");
      link.href = `http://127.0.0.1:5500/Client/sign_in.html`;
      link.click();
    }
  });
}

// Sockets
socket.on("user-joined", (user) => {
  if (!Users.has(user.email)) createConversations(user);
});

socket.on("recieve", (msg) => {
  createMsg("rec", msg.text);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

socket.on("left", (user) => {
  Users.delete(user.email);
  Users.set(user.email, user);
});

socket.on("mod-status", ({ id, status }) => {
  stat.style.display = status ? "block" : "none";
});

// utility functions

send.addEventListener("click", () => {
  sendMessage(msgInp.value);
});

const createMsg = (type, msg) => {
  const divi = document.createElement("div");
  const person = document.createElement("div");
  const image = document.createElement("img");
  const msgWrap = document.createElement("div");
  const para = document.createElement("p");

  image.src = "./assets/user.jpg";
  person.classList.add("person");
  let plotMsg = msg.split(" ");

  plotMsg.forEach((message) => {
    let wordBlock = document.createElement("span");
    if (message.length > 40) wordBlock.style.wordBreak = "break-all";
    wordBlock.textContent = message + " ";
    para.appendChild(wordBlock);
  });

  type === "rec"
    ? msgWrap.classList.add("rec_msg")
    : msgWrap.classList.add("sent_msg");

  person.appendChild(image);
  msgWrap.appendChild(para);

  if (type === "rec") {
    divi.appendChild(person);
    divi.appendChild(msgWrap);
    divi.classList.add("rec_wrapper");
  } else {
    divi.appendChild(msgWrap);
    divi.appendChild(person);
    divi.classList.add("sent_wrapper");
  }

  chatContainer.appendChild(divi);
};

const createConversations = (user) => {
  const Members = document.querySelector(".members");
  const chatBox = document.querySelector(".chatBox");
  const divi = document.createElement("div");
  const wrapper = document.createElement("div");
  const dots = document.createElement("div");
  const singleDot = document.createElement("div");
  const pic = document.createElement("div");
  const name = document.createElement("div");
  const time = document.createElement("div");
  const p = document.createElement("p");
  const span = document.createElement("span");
  const image = document.createElement("img");
  const h3 = document.createElement("h3");

  divi.classList.add("people");
  // divi.setAttribute("active", "true");
  wrapper.classList.add("wrap");
  dots.classList.add("dots");
  pic.classList.add("pic");
  name.classList.add("name");
  time.classList.add("time");
  divi.append(wrapper, dots);
  wrapper.append(pic, name);

  image.src = "./assets/user.jpg";
  h3.textContent = user.name;
  pic.appendChild(image);
  name.appendChild(h3);
  name.appendChild(time);
  p.textContent = "Start chat";
  span.textContent = "";
  findRoom(user, p, span, singleDot);

  time.appendChild(p);

  dots.append(singleDot, span);

  Members.appendChild(divi);

  divi.addEventListener("click", () => {
    chatBox.classList.toggle("active");
  });

  divi.addEventListener("click", () => {
    createChatBox(user);
  });
};

const updateChatBox = (room) => {
  if (!currentRoom || currentRoom.roomId !== room.roomId) {
    const logedInUser = window.localStorage.getItem("user");
    chatContainer.innerHTML = "";
    currentRoom = room;

    document.querySelector(".status h3").textContent =
      room.reciever.id === logedInUser ? room.sender.name : room.reciever.name;

    if (room.reciever.id === logedInUser) {
      stat.style.display = room.reciever.status ? "block" : "none";
    } else {
      stat.style.display = room.sender.status ? "block" : "none";
    }

    room.messages.forEach((msg) => {
      if (msg._id === logedInUser) {
        createMsg("sent", msg.text);
      } else {
        createMsg("rec", msg.text);
      }
    });
  }
};

const sendMessage = (msg) => {
  const data = {
    roomId: currentRoom.roomId,
    userId: window.localStorage.getItem("user"),
    msg: msg,
    tstmp:
      new Date().toLocaleDateString() +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes(),
  };
  fetch("https://whelp-backend.herokuapp.com/api/chat/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      socket.emit("send-msg", { roomId: currentRoom.roomId, msg: data.msg });
      createMsg("sent", data.msg.text);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      msgInp.value = "";
    });
};

function createUI(user) {
  let username = document.querySelector(".profile p");
  username.textContent = user.name;
  createChatBox(user);
  let userInfo = document.querySelector(".profileImg");
  const name = document.createElement("h1");
  name.textContent = user.name;
  const type = document.createElement("p");
  type.textContent = "User";
  userInfo.appendChild(name);
  userInfo.appendChild(type);
  let userDetails = document.querySelectorAll(".userDetails");
  let email = document.createElement("p");
  email.textContent = user.email;
  let mobile = document.createElement("p");
  mobile.textContent = "+91" + user.phone;
  let time = document.createElement("p");
  time.textContent = new Date().toDateString();
  userDetails[0].appendChild(email);
  userDetails[1].appendChild(mobile);
  userDetails[2].appendChild(time);
}
