var params = new URLSearchParams(window.location.search);

var name = params.get("name");
var room = params.get("room");

//JQuery references
var divUsers = $("#divUsuarios");
var sendForm = $("#sendForm");
var txtMessage = $("#txtMessage");
var divChatbox = $("#divChatbox");

//Functions to render users
function renderUsers(people) {
  var html = "";
  html += "<li>";
  html += '  <a href="javascript:void(0)" class="active">';
  html += "    Chat de <span> " + params.get("room") + "</span>";
  html += "  </a>";
  html += "</li>";

  for (var i = 0; i < people.length; i++) {
    html += "<li>";
    html += '  <a data-id="' + people[i].id + '" href="javascript:void(0)">';
    html +=
      '    <img src="assets/images/users/1.jpg" alt="user-img" class="img-circle" />';
    html +=
      "    <span> " +
      people[i].name +
      '<small class="text-success">online</small></span>';
    html += "  </a>";
    html += "</li>";
  }

  divUsers.html(html);
}

function renderMessages(message, me) {
  console.log("El mensaje", message);
  var html = "";

  var date = new Date(message.date);
  var time = date.getHours() + ":" + date.getMinutes();
  var adminClass = "info";
  if (message.name === "Admin") {
    adminClass = "danger";
  }

  if (me) {
    html += '<li class="reverse">';
    html += '  <div class="chat-content">';
    html += "    <h5>" + message.name.name + "</h5>";
    html +=
      '    <div class="box bg-light-inverse">' + message.message + "</div>";
    html += "  </div>";
    html += '  <div class="chat-img">';
    html += '    <img src="assets/images/users/5.jpg" alt="user" />';
    html += "  </div>";
    html += '  <div class="chat-time">' + time + "</div>";
    html += "</li>;";
  } else {
    html += "<li class='animated fadeIn'>";
    if (message.name !== "Admin") {
      html += '  <div class="chat-img">';
      html += '    <img src="assets/images/users/1.jpg" alt="user" />';
      html += "  </div>";
    }

    html += '  <div class="chat-content">';
    html += "    <h5>" + message.name.name + "</h5>";
    html +=
      '    <div class="box bg-light-' +
      adminClass +
      '">' +
      message.message +
      "</div>";
    html += "  </div>";
    html += '  <div class="chat-time">' + time + "</div>";
    html += "</li>";
  }

  divChatbox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children("li:last-child");

  // heights
  var clientHeight = divChatbox.prop("clientHeight");
  var scrollTop = divChatbox.prop("scrollTop");
  var scrollHeight = divChatbox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
}

//Listeners
divUsers.on("click", "a", function () {
  var id = $(this).data("id");
});

sendForm.on("submit", function (e) {
  e.preventDefault();
  if (txtMessage.val().trim().length === 0) {
    return;
  }

  socket.emit(
    "createMessage",
    {
      name: name,
      message: txtMessage.val(),
    },
    function (message) {
      txtMessage.val("").focus();
      renderMessages(message, true);
      scrollBottom()
    }
  );
});
