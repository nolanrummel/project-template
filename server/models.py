# library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

# local imports
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable = False)
    user_name = db.Column(db.String, nullable = False)
    _password_hash = db.Column(db.String, nullable = False)

    @validates('name')
    def validate_name(self, key, new_name):
        if type(new_name) is str and len(new_name) >= 2:
            return new_name
        else:
            raise ValueError('Name must be at least 2 characters')

    @validates('user_name')
    def validate_user_name(self, key, new_username):
        if type(new_username) is str and len(new_username) >= 3:
            return new_username
        else:
            raise ValueError('Username must be at least 3 characters')

    @property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, new_password):
        if type(new_password) is str and len(new_password) >= 6:
            enc_new_password = new_password.encode('utf-8')
            encrypted_hash = bcrypt.generate_password_hash(enc_new_password)
            hash_password_str = encrypted_hash.decode('utf-8')
            self._password_hash = hash_password_str
        else:
            raise ValueError('Password must at least 6 characters')

    def authenticate(self, password):
        enc_password = password.encode('utf-8')
        return bcrypt.check_password_hash(self._password_hash, enc_password)