from flask import Flask
from flask_socketio import SocketIO
from flask_session import Session


app = Flask(__name__)
app.config['SECRET_KEY'] = 'Hello, World!'
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
socketio = SocketIO(app)

users = []
rooms = [{'room_name':'movies', 'messages':[]}
        , {'room_name':'science', 'messages':[]}
        , {'room_name':'politics', 'messages':[]}]


from routes import *

if __name__ == '__main__':
    socketio.run(app, debug=True)
