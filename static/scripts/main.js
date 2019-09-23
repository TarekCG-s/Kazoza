let room;
document.addEventListener('DOMContentLoaded', () => {

  const socketio = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socketio.on('connect', ()=>{
    room = 'science'
    join_room(room)

    document.querySelector('#msg-form').onsubmit = () => {
    const msg = document.querySelector('#msg').value;
    if(msg === ''){
      return false;
    }
    else{
      socketio.emit('send_message', {'msg':msg, 'room':room});
      document.querySelector('#msg').value = ''
    }
    return false;
    };


    document.querySelector('#chat-room').onsubmit = () => {
    const room_name = document.querySelector('#new-room-name').value.toLowerCase();
    if(room_name === ''){
      return false;
    }
    else{
      socketio.emit('create_room', {'room':room_name});
      document.querySelector('#new-room-name').value = ''
    }
    return false;
    };


    document.querySelectorAll('.list-item').forEach(item => {
      item.onclick = () => {
        let new_room = item.dataset.room.toLowerCase();
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
    new_message(data['username'], data['msg'], '12 April');

  });

  socketio.on('create_room', data => {
    if(data['success']){
      add_room(data['room']);
    }
    else {
      alert("There is already a room with that name");
    }

  });


  function leave_room(room){
    socketio.emit('leave', {'room':room});
    document.querySelector('#messages-list').innerHTML = '';
  }

  function join_room(room){
    document.querySelector('#conversation-title').innerHTML = room;
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/room/' + room);
    xhr.onload = () => {
      const response = JSON.parse(xhr.response);
      for (var i = 0; i < response.counter; i++) {
        new_message(response[i]['username'], response[i]['msg'], '12 April');
        // const li = document.createElement('li');
        // li.innerHTML = `${response[i]['username']} : ${response[i]['msg']}`;
        // document.querySelector('#messages-list').append(li);
      }
      socketio.emit('join', {'room':room});
    }
    xhr.send();
  }

  function add_room(room_name){
    let ul = document.querySelector('#rooms-list');
    let li = document.createElement('li');
    let div = document.createElement('div');
    div.className = 'list-item';
    div.dataset.room = room_name.toLowerCase();
    let h5 = document.createElement('h5');
    h5.innerHTML = room_name;
    div.append(h5);
    div.onclick = () => {
      let new_room = room_name;
      if (new_room === room){
        alert("You're Already in this room")
      }
      else {
        leave_room(room);
        join_room(new_room);
        room = new_room;
      }
    }
    li.append(div);
    ul.append(li);
  }

});
