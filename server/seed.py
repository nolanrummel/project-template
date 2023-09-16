#!/usr/bin/env python3

# library imports
from random import random, randint, choice as rc
import re

# eemote library imports
from faker import Faker

# local imports
from app import app
from models import db, User

fake = Faker()

def create_users():
    users = []
    for _ in range(10):
        while True:
            new_name=fake.first_name()
            if len(new_name) >= 2:
                break
        while True:
            new_user_name=fake.user_name()
            if len(new_user_name) >= 3:
                break
        u = User(
            name=new_name,
            user_name=new_user_name,
            _password_hash='$2b$12$KeFZ20GaKQr9TaGvxc8tJ.jjVaMB.zx5OZO8oZt8QJnmvt6AxBa3.'
        )
        users.append(u)
    return users

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print('Starting seed...')
        
        # deletes previous database info
        User.query.delete()

        # creates and adds new users to database
        users = create_users()
        db.session.add_all(users)
        db.session.commit()