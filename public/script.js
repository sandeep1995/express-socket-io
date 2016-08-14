var socket = null;
var currentUser = null;

var $username = $('#username-box');
var $login = $('#login');
var $container = $('#container');
var userList = $('#user');
var $message = $('#message');
var $messages = $('#messages');

$('#form-username').submit(function(event) {
  event.preventDefault();

  if ($username.val() == '')
    return;

  socket = io();

  socket.emit('user changed', $username.val());
  currentUser = $username.val();
  $username.val('');
  $login.slideUp('fast');
  $container.slideDown('fast');
  $message.focus();

  socket.on('user changed', function (data) {
    var list = '';

    data.users = data.users.filter(function(index) {
      return index != currentUser;
    });

    if (data.users.length > 0) {
      for (var  i = 0; i < data.users.length; i++){
        list+= '<li class="list-group-item list-group-item-success">'+data.users[i]+'</li>';
      }
    }
    if (list == '')
      list+= '<li class="list-group-item list-group-item-danger">You are alone here</li>';

    userList.html(list);
    list = '';
  });

  socket.on('send message', function (data) {
    $messages.append('<li class="list-group-item"><b>'+data.from+': </b>'+data.message+'</li>');
  });


});


$('#inputbox').submit(function(event) {
  event.preventDefault();
  $messages.append('<li class="list-group-item"><b>'+currentUser+': </b>'+$message.val()+'</li>');
  var sendObj = {
    from: currentUser,
    message: $message.val()
  };
  console.log(sendObj);
  socket.emit('send message', sendObj);
  $message.val('');

});
