const { io } = require("../server");
const { Users } = require("../classes/users");
const { createMessage } = require("../utilities/utilities");

const users = new Users();

io.on("connection", client => {
  client.on("enterChat", (data, callback) => {
    if (!data.name || !data.room) {
      return callback({
        err: true,
        message: "Name and room are required",
      });
    }
    client.join(data.room);
    users.addPerson(client.id, data.name, data.room);

    client.broadcast
      .to(data.room)
      .emit("listPeople", users.getPeopleByRoom(data.room));

    callback(users.getPeopleByRoom(data.room));
  });

  client.on("createMessage", data => {
    let person = users.getPerson(client.id);
    let message = createMessage(person, data.message);
    client.broadcast.to(person.room).emit("createMessage", message);
  });

  client.on("disconnect", () => {
    let removedPerson = users.removePerson(client.id);

    client.broadcast
      .to(removedPerson.room)
      .emit(
        "createMessage",
        createMessage("Admin", `${removedPerson.name} abandonó la sala`)
      );
    client.broadcast
      .to(removedPerson.room)
      .emit("listPeople", users.getPeopleByRoom(removedPerson.room));
  });

  //Private messages
  client.on("privateMessage", data => {
    let person = users.getPerson(client.id);

    client.broadcast
      .to(data.to)
      .emit("privateMessage", createMessage(person.name, data.message));
  });
});
