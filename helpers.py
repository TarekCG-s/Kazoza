from functools import wraps
from flask import session, redirect, url_for, flash
from app import app, rooms, users

def login_required(func):
    @wraps(func)
    def check_authentication(*args, **kargs):
        if session.get('username') is None:
            flash(f'You need to log in first', 'warning')
            return redirect(url_for('login'))
        else:
            if session['username'] not in users:
                users.append(session['username'])
        return func(*args, **kargs)
    return check_authentication

def update_room_messages(update_room , msg):
    for room in rooms:
        if room['room_name'] == update_room:
            room['messages'].append(msg)
            if len(room['messages']) > 100:
                room['messages'] = room['messages'][1:]
