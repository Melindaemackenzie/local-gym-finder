#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, session
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import *
from resources.resources import GymResource, UserResource, WorkoutClassResource, ReviewsResource, Login, Signup, CheckSession


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


api.add_resource(GymResource, '/gym', '/gym/<int:gym_id>')
api.add_resource(UserResource, '/users')
api.add_resource(WorkoutClassResource, '/workout_classes', '/workout_classes/<string:name>')
api.add_resource(ReviewsResource, '/gym/<int:gym_id>/reviews')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/session')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

