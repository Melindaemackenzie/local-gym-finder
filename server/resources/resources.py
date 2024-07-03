from flask_restful import Resource
from app import api, db
from models import *
from flask import request, jsonify

class GymResource(Resource):

    def get(self, gym_id=None):
        gyms = Gym.query.all()
        return [gym.to_dict() for gym in gyms]
    
    def post(self):
        data = request.get_json()
        new_gym = Gym(
            name=data['name'],
            address = data.get('address'),
            phone=data.get('phone'),
            website=data.get('website')
        )

        db.session.add(new_gym)
        db.session.commit()
        return {'message': 'Gym created', 'gym': new_gym.to_dict()}, 201
    
    def put(self, gym_id):
        gym = Gym.query.get(gym_id)

        if not gym:
            return jsonify({'error': 'Gym not found'}), 404
        
        data = request.get_json()
        gym.name = data['name']
        gym.address = data.get('address')
        gym.phone = data.get('phone')
        gym.website = data.get('website')
        db.session.commit()
        return{ 'messsage': 'Gym updated', 'gym': gym.to_dict()}
    
    def delete(self, gym_id):
        gym = Gym.query.get(gym_id)
        db.session.delete(gym)
        db.session.commit()
        return {'message': 'Gym deleted', 'gym': gym.to_dict()}, 204