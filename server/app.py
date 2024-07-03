#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import *
from resources import GymResource


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(GymResource, '/Gym')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

