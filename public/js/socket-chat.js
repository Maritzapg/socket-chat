var socket = io();

var params = new URLSearchParams(window.location.search);
console.log(params);
if (!params.has("name") || !params.has("room")) {
  window.location = "index.html";
  throw new Error("Name and room are required");
}

var user = {
  name: params.get("name"),
  room: params.get("room"),
};

socket.on("connect", function () {
  console.log("Conectado al servidor");
  socket.emit("enterChat", user, function (res) {
    //console.log("User connected", res);
    renderUsers(res);
  });
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

// Enviar información
// socket.emit(
//   "createMessage",
//   {
//     usuario: "Maritza",
//     mensaje: "Hola Mundo",
//   },
//   function (resp) {
//     console.log("respuesta server: ", resp);
//   }
// );

// Escuchar información
socket.on("createMessage", function (message) {
  //console.log("Servidor:", mensaje);
  renderMessages(message, false);
  scrollBottom();
});

//Listening user changes
//When one user enter o exits the chat
socket.on("listPeople", function (people) {
  //console.log(people);
  renderUsers(people);
});

//Private messages
socket.on("privateMessage", function (message) {
  console.log("Private message", message);
});
