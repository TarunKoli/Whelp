# **Whelp**

#### Whelp is a chatting App made in Javascript(Node.js) using RESTful Web Service, mongoose and socket programming that allows realtime communication between server and client. The app has friendly user interface built using html, css & vanilla JS.

## Features

- Authentication & registration of user.
- Realtime communication between users and also between client & server.
- Realtime activity status updation of users.
- Uses MongoDB, mongoose for storing and querying data.
- Sharing media such as images & emojis.
- Uses RESTful web service for backend server.

## How It Works ?

Once a user is loggedin an active connection opened between the client and the server so client can send and receive data. This allows real-time communication using TCP sockets. This is made possible by WebSockets(Socket.io).

The client starts by connecting to the server through a socket. Once connection is successful, client and server can emit and listen to events in realtime.

## SignUp/Login pages

- In order to use Whelp user must register on application.
- Login to get access to available chats.

<div style="display:flex;">
<img src="./assets/description/login.png" alt="login_page" width="200" style="margin-right:1rem">
<img src="./assets/description/register.png" alt="Register_page" width="200">
</div>
<img src="./assets/description/login_register.png" alt="login_page" style="margin-top:1rem">

## Chat Page

- Chat with different users.
- Realtime communication & user friendly animations.
- Messages are private between you and other user.
- No leakage of messages to different rooms.
- Auto scroll intelligence on current inbox everytime a new message is recieved in that inbox.

<div style="display:flex;">
<img src="./assets/description/chats_mob.png" alt="chats_page" width="200" style="margin-right:1rem">
<img src="./assets/description/chats_box_mob.png" alt="chats_page" width="200" style="margin-right:1rem">
<img src="./assets/description/profile_mob.png" alt="chats_page" width="200">
</div>
<img src="./assets/description/Chats.png" alt="chats_page" style="margin-top:1rem">
