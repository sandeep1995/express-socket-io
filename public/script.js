var socket = null;

var $username = $('#username-box');
var $login = $('#login');
var $container = $('#container');
var userList = $('#user');
$('#form-username').submit(function(event) {
  event.preventDefault();

  if ($username.val() == '')
    return;

  socket = io.connect('http://localhost:3000');

  socket.emit('user changed', $username.val());
  $username.val('');
  $login.slideUp('fast');
  $container.slideDown('fast');
  var list = '';

  socket.on('user changed', function (data) {
    if (data.users.length > 0) {
      for (var  i = 0; i < data.users.length; i++){
        list+= '<li class="list-group-item">'+data.users[i]+'</li>';
      }
    }
    if (list == '')
      list+= '<li>You are alone here</li>';

    userList.html(list);
    list = '';
  });
});
