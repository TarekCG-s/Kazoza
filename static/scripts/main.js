let room;
document.addEventListener('DOMContentLoaded', () => {

  const socketio = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socketio.on('connect', ()=>{
    room = 'science'
    join_room(room)

    document.querySelector('#message-form').onsubmit = () => {
    const msg = document.querySelector('#msg').value;
    socketio.emit('send_message', {'msg':msg, 'room':room});
    return false;
    };


    document.querySelector('#room-form').onsubmit = () => {
    const room_name = document.querySelector('#new-room').value.toLowerCase();
    socketio.emit('create_room', {'room':room_name});
    return false;
    };


    document.querySelectorAll('.room').forEach(item => {
      item.onclick = () => {
        let new_room = item.innerHTML.toLowerCase();
        if (new_room === room){
          alert("You're Already in this room")
        }
        else {
          leave_room(room);
          join_room(new_room);
          room = new_room;
        }
      }
    })
  });

  socketio.on('send_message', data => {
    const new_msg = document.createElement('li');
    new_msg.innerHTML = `${data['username']} : ${data['msg']}` ;
    document.querySelector('#messages').append(new_msg);
  });

  socketio.on('create_room', data => {
    const new_room = document.createElement('li');
    const h1 = document.createElement('H1');
    h1.innerHTML = data['room'];
    h1.className = "room"
    h1.onclick = () => {
      let new_room = data['room'];
      if (new_room === room){
        alert("You're Already in this room")
      }
      else {
        leave_room(room);
        join_room(new_room);
        room = new_room;
      }
    }

    new_room.append(h1);
    document.querySelector('#rooms').append(new_room);
  });


  function leave_room(room){
    socketio.emit('leave', {'room':room});
    document.querySelector('#messages').innerHTML = '';
  }

  function join_room(room){

    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/room/' + room);
    xhr.onload = () => {
      const response = JSON.parse(xhr.response);
      for (var i = 0; i < response.counter; i++) {
        const li = document.createElement('li');
        li.innerHTML = `${response[i]['username']} : ${response[i]['msg']}`;
        document.querySelector('#messages').append(li);
      }
      socketio.emit('join', {'room':room});
    }
    xhr.send();

  }







});
