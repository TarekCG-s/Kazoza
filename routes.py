from flask import render_template, url_for, redirect, session, jsonify
from flask_socketio import emit, leave_room, join_room
from app import app, rooms, socketio, users
from forms import LoginForm
from helpers import login_required, update_room_messages

@app.route('/')
@login_required
def chatroom():
    return render_template('chatroom.html', title='Kazoza', rooms=rooms)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        users.append(form.username.data)
        session['username'] = form.username.data
        return redirect(url_for('chatroom'))
    return render_template('login.html', title='login', form=form)


@app.route('/logout')
@login_required
def logout():
    session.pop('username', None)
    return redirect(url_for('chatroom'))


@app.route('/room/<string:room_name>', methods=['GET'])
def get_room_messages(room_name):

    for room in rooms:

        if room['room_name'] == room_name:
            messages = room['messages']
            counter = 0
            response ={}
            for message in messages:
                response[str(counter)] = message
                counter += 1
            response['counter'] = counter
            print(response)
            return response
    return {'counter':0}


@socketio.on('send_message')
def send_message(data):
    new_msg = {'msg':data['msg'], 'username':session['username']}
    update_room_messages(data['room'], new_msg)
    print(rooms)
    emit('send_message', new_msg, broadcast=True, room=data['room'])


@socketio.on('join')
def join(data):
    join_room(data['room'])
    new_msg = {'msg':f"{session['username']} has joined {data['room']}", 'username':'Kazoza'}
    update_room_messages(data['room'], new_msg)
    emit('send_message', new_msg, room=data['room'])


@socketio.on('leave')
def leave(data):
    leave_room(data['room'])
    new_msg = {'msg':f"{session['username']} has left {data['room']}", 'username':'Kazoza'}
    update_room_messages(data['room'], new_msg)
    emit('send_message', new_msg, room=data['room'])


@socketio.on('create_room')
def create_room(data):
    new_room = {'room_name':data['room'], 'messages':[]}
    rooms.append(new_room)
    print(new_room)
    emit('create_room', {'room':data['room']}, broadcast=True)
