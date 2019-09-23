from flask_wtf import FlaskForm
from wtforms.validators import DataRequired, Length
from wtforms import StringField, SubmitField, ValidationError
from app import users

class LoginForm(FlaskForm):
    username = StringField('User name', validators=[DataRequired(), Length(min=4, max=24)])
    submit = SubmitField('Login')

    def validate_username(self, username):
        if username.data in users:
            raise ValidationError("This name is taken. Please choose another name")
