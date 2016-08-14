var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('public'));

var users = [];
var messages = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  console.log("Connected");

  socket.on('user changed', function (username) {
    socket.username = username;
    if (users.indexOf(socket.username) == -1)
      users.push(username);
      io.emit('user changed', {users: users});
    });

  socket.on('disconnect', function () {
    console.log("Disconnected");
    users.splice(users.indexOf(socket.username), 1);
    io.emit('user changed', {users: users});

    delete socket.username;
  });

  socket.on('send message', function (obj) {
    socket.broadcast.emit('send message', obj);
  });

});
server.listen(process.env.PORT || 3000);
