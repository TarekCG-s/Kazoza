function new_message(sender_info, content_info, date_info) {
  let ul = document.querySelector('#messages-list');
  let li = document.createElement('li');
  let message = document.createElement('span');
  message.innerHTML = content_info;

  let date = document.createElement('span');
  let sender = document.createElement('span');
  sender.innerHTML = sender_info + ' : ';
  sender.style.fontWeight = 'bold'
  date.innerHTML = date_info;
  date.style.fontSize = '12px';
  let full_message = document.createElement('div');
  full_message.className = 'full-message';
  full_message.append(sender);
  full_message.append(message);
  full_message.append(document.createElement('br'));
  full_message.append(date);
  li.append(full_message);
  ul.append(li);
  var element = document.querySelector(".chat-messages");
  element.scrollTop = element.scrollHeight;
}

// function add_room(room_name){
//   let ul = document.querySelector('#rooms-list');
//   let li = document.createElement('li');
//   let div = document.createElement('div');
//   div.className = 'list-item';
//   div.dataset.room = room_name.toLowerCase();
//   let h5 = document.createElement('h5');
//   h5.innerHTML = room_name;
//   div.append(h5);
//   div.onclick = () => {
//     div.className += ' active';
//   }
//   li.append(div);
//   ul.append(li);
// }
