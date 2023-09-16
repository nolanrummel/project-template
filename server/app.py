#!/usr/bin/env python3

# library imports
from flask import request, make_response, session
from flask_restful import Resource
import ipdb

# local imports
from config import app, db, api

# model imports
from models import User

@app.route('/')
def index():
    return '<h1>Project Template</h1>'
class Users(Resource):
    # get all users
    def get(self):
        users = User.query.all()
        serialized_users = [user.to_dict(rules=('-_password_hash',)) for user in users]
        return make_response(serialized_users, 200)

    # create new user
    def post(self):
        data = request.get_json()
        try:
            new_user = User(
                name = data['name'],
                user_name = data['userName'],
                password_hash = data['password']
                )
        except Exception as e:
            return make_response({'error': str(e)}, 404)
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 200)
        # return make_response(new_user.to_dict(only = ('id', 'user_name')), 200)
    
api.add_resource(Users, '/users')

class UserById(Resource):
    # get individual user by ID
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'error':'User does not exist'}, 404)
        return make_response(user.to_dict(), 200)
    
    # delete user by ID
    def delete(self, id):
        try:
            user = User.query.filter_by(id = id).first()
        except:
            return make_response({'error': 'User does not exist'}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response({}, 204)
        
    # edit user by ID
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        data = request.get_json()
        if not user :
            return make_response({'error' : 'User does not exist'}, 404)
        try:
            for attr in data:
                setattr(user, attr, data[attr])
        except Exception as e:
            return make_response({'error' : f'invalid request: {str(e)}'}, 404)
        db.session.commit()
        return make_response(user.to_dict(), 202)
        
api.add_resource(UserById, '/users/<int:id>')

class Login(Resource):
    # checks user input info and updates session with user info
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.user_name == data['userName']).first()
        if not user:
            return make_response({'error': 'Username not found'}, 404)
        else:
            if user.authenticate(data['password']):
                session['user_id'] = user.id
                return make_response(user.to_dict(), 200)
            else:
                return make_response({'error': 'Password does not match'}, 404)

api.add_resource(Login, '/login')

class Logout(Resource):
    # removes session user info
    def delete(self):
        session['user_id'] = None
        return make_response({'message':'You have successfully logged out'}, 204)
    
api.add_resource(Logout, '/logout')

class CheckSession(Resource):
    # gets session user info
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return make_response(user.to_dict(), 200)
        
api.add_resource(CheckSession, '/check_session')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

