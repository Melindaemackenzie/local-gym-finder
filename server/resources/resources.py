from flask_restful import Resource
from config import api,db, app
from models import *
from flask import request, jsonify, Blueprint, session, request, make_response
from flask_cors import CORS, cross_origin
import traceback
import re
from sqlalchemy.sql import text



class GymResource(Resource):

    def get(self, gym_id=None):
        if gym_id:
            gym= Gym.query.get(gym_id)
            if gym is None:
                return {'error': 'Gym not found'}, 404
            return self.serialize_gym(gym), 200
        gyms = Gym.query.all()
        return [self.serialize_gym(gym) for gym in gyms], 200

    def serialize_gym(self, gym):
        return {
            'id': gym.id,
            'name': gym.name,
            'address': gym.address,
            'phone': gym.phone,
            'website': gym.website,
            'users': [user.username for user in gym.users]
        }

    def post(self):
        data = request.get_json()
        address = data.get('address')
        phone = data.get('phone')
        user_id = data.get('userId')

        if not re.match(r'^[\d\w\s]+, [\w\s]+, [A-Z]{2} \d{5}$', address):
            return {'error': 'Address must be in the format: Street Address, City, State ZIP'}, 400

        if not re.match(r'^\d{3}-\d{3}-\d{4}$', phone):
            return {'error': 'Phone number must be in the format: xxx-xxx-xxxx'}, 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        try:
            new_gym = Gym(
                name=data['name'],
                address=data.get('address'),
                phone=data.get('phone'),
                website=data.get('website')
            )
            db.session.add(new_gym)
            db.session.commit()
            print(new_gym)

            user.gyms.append(new_gym)
            db.session.commit()
            return {'message': 'Gym created', 'gym': new_gym.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

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
        return {'message': 'Gym updated', 'gym': gym.to_dict()}
    
    @cross_origin()
    def delete(self, gym_id):
        
        try:
            gym = Gym.query.get(gym_id)
            if not gym:
                return jsonify({'error': 'Gym not found'}), 404
            
            Review.query.filter_by(gym_id=gym.id).delete()

            db.session.delete(gym)
            db.session.commit()
            return jsonify({'message': 'Gym deleted', 'gym': gym.to_dict()}), 200
        except Exception as e:
            print(f"Error deleting gym: {e}")  # Log the error
            db.session.rollback()  # Rollback in case of error
            return jsonify({'error': 'Internal Server Error'}), 500
        
    
    
    
class UserResource(Resource):

    def get(self):
        users = User.query.all()
        return [user.to_dict() for user in users], 200
    
    def post(self):
        data = request.get_json()
        #Check for required fields
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return {'error': 'Missing required fields'}, 400
        
        #Check for unique username and email
        if User.query.filter_by(username=data['username']).first():
            return {'error': 'Username already exists'}, 400
        if User.query.filter_by(email=data['email']).first():
            return {'error': 'Email already exists'}, 400
            
        new_user = User(
            username=data['username'],
            email = data['email'],
            password_hash=data['password']
        )

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(), 201
    
    
class WorkoutClassResource(Resource):
    def get(self, workout_class_id=None):
            if workout_class_id:
                workout_class = WorkoutClass.query.get(workout_class_id)
                if not workout_class:
                    return {'error': 'Workout class not found'}, 404
                return workout_class.to_dict(), 200
            else:
                name = request.args.get('name')
                type_filter = request.args.get('type')
            if name:
                workout_class = WorkoutClass.query.filter_by(name=name).first()
                if not workout_class:
                    return {'error': 'Workout class not found'}, 404
                return workout_class.to_dict(), 200
            if type_filter:
                workout_classes = WorkoutClass.query.filter_by(type=type_filter).all()
            else:
                workout_classes = WorkoutClass.query.all()
            return [workout_class.to_dict() for workout_class in workout_classes], 200
            
        
    def post(self):
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400

        required_fields = ['name', 'schedule', 'type', 'rating', 'gym_name']
        if not all(field in data for field in required_fields):
            return {'error': 'Missing required fields'}, 400

        name = data.get('name')
        schedule = data.get('schedule')
        type = data.get('type')
        rating = data.get('rating')
        gym_name = data.get('gym_name')
        

        if not name or not schedule or not type or not rating or not gym_name :
            return {'error': 'Name, schedule, type, rating, gym name are required'}, 400

        try:
            gym = Gym.query.filter_by(name=gym_name).first()
            if not gym:
                return {'error': 'Gym not found'}, 404

            new_workout_class = WorkoutClass(
                name=name,
                schedule=schedule,
                type=type,
                rating=rating,
                gym_id=gym.id,
                
            )
            db.session.add(new_workout_class)
            db.session.commit()

            return {'message': 'Workout class added successfully', 'workout_class': new_workout_class.to_dict()}, 201
        except Exception as e:
            print(f"Error adding workout class: {e}")
            traceback.print_exc()
            db.session.rollback()
            return {'error': 'Internal Server Error'}, 500
        

    def put(self, id):
        data = request.get_json()

        workout_class_name = data.get('name')
        if not workout_class_name:
            return{'error': 'Workout class name is required'}, 400
        
        workout_class = WorkoutClass.query.fiter_by(name=workout_class_name).first()
        if not workout_class:
            return {'error': 'Workout class not found'}, 404
        
        if 'schedule' in data:
            workout_class.schedule = data['schedule']
        if 'instructor' in data:
            workout_class.instructor = data ['instructor']
        if 'type' in data:
            workout_class.type = data['type']
        if 'rating' in data:
            workout_class.rating = data['rating']
        if 'gym_name' in data:
            gym = Gym.query.filter_by(name=data['gym_name']).first()
            if not gym:
                return {'error': 'Gym not found'}, 404
            workout_class.gym_id = gym.id

        db.session.commit()
        return workout_class.to_dict(), 200
    
    def delete(self, workout_class_id):
        workout_class = WorkoutClass.query.get(workout_class_id)
        if not workout_class:
            return {'error': 'Workout class not found'}, 404

        db.session.delete(workout_class)
        db.session.commit()
        return {'message': 'Workout class deleted'}, 200

#class GetHardestWorkoutClass(Resource):
    #def get(self):
        # Query for the workout class with the highest rating
        #highest_rated_workout_class = WorkoutClass.query.order_by(WorkoutClass.rating.desc()).first()
        
        #if highest_rated_workout_class is None:
            #return {'message': 'No workout classes found'}, 404
        
        # Serialize the result
        #serialized = highest_rated_workout_class.to_dict()
        
        #return serialized, 200
    
    
class ReviewsResource(Resource):
   
    def get(self, gym_id=None):
        if gym_id:
            reviews = Review.query.filter_by(gym_id=gym_id).all()
            serialized_reviews = [review.to_dict() for review in reviews]
            return jsonify(serialized_reviews)
        else:
            return jsonify({'error': 'Gym ID is required'}), 400
        
    def post(self, gym_id=None):
        if not gym_id:
            return jsonify({'error': 'Gym ID is required'}), 400

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        content = data.get('content')
        rating = data.get('rating')
        user_id = data.get('user_id')

        if not content or not rating or not user_id:
            return jsonify({'error': 'Content, rating, and user ID are required'}), 400

        try:
            gym = Gym.query.get(gym_id)
            if not gym:
                return jsonify({'error': 'Gym not found'}), 404

            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404

            new_review = Review(gym_id=gym_id, content=content, rating=rating, user_id=user_id)
            db.session.add(new_review)
            db.session.commit()
            

            review_dict = new_review.to_dict()
            
            return jsonify({'message': 'Review added successfully', 'review': review_dict}), 201
        except Exception as e:
            print(f"Error adding review: {e}")
            traceback.print_exc()  # Print the full traceback
            db.session.rollback()
            return jsonify({'error': 'Internal Server Error'}), 500

    
    def delete(self, review_id):
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({'message': 'Review deleted successfully'}), 200
        
class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return {'error': 'Missing required fields'}, 400

        if User.query.filter_by(username=username).first():
            return {'error': 'Username already exists'}, 400

        if User.query.filter_by(email=email).first():
            return {'error': 'Email already exists'}, 400

        new_user = User(username=username, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User created successfully'}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'error': 'Missing username or password'}, 400

        user = User.query.filter_by(username=username).first()

        if not user or not user.check_password(password):
            return {'error': 'Invalid username or password'}, 401

        session['user_id'] = user.id
        print('Session after login:', session)

        return {'message': 'Logged in successfully'}, 200
    
class Logout(Resource):
    @cross_origin(supports_credentials=True) 
    def post(self):
        if 'user_id' in session:
            session.pop('user_id')
            session.clear()
            print('Session after logout:', session)
            return {'message': 'Logged out successfully'}, 200
        else:
            return {'error': 'User not logged in'}, 400


class CheckSession(Resource):
    def get(self):
        if 'user_id' in session:
            user_id = session['user_id']
            response = make_response(jsonify({'isLoggedIn': True, 'user_id': user_id}), 200)
        else:
            response = make_response(jsonify({'isLoggedIn': False}), 401)
        return response
    
class UserGymsResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        return {
            'gyms': [gym.to_dict() for gym in user.gyms]
        }, 200
        

    @cross_origin()
    
    
    def post(self):
            data = request.get_json()
            gym_id = data.get('gym_id')
            note = data.get('note')

            if not gym_id or not note:
                return {'error': 'Missing gym_id or note'}, 400

            user_id = session.get('user_id')
            if not user_id:
                return {'error': 'User not logged in'}, 401

            # Check if gym_user association exists
            gym_user = db.session.execute(
                text('SELECT * FROM gym_user WHERE gym_id = :gym_id AND user_id = :user_id'),
                {'gym_id': gym_id, 'user_id': user_id}
            ).fetchone()

            if not gym_user:
                return {'error': 'Gym-user association not found'}, 404

            # Add or update note
            existing_note = GymUserNote.query.filter_by(user_id=user_id, gym_id=gym_id).first()
            if existing_note:
                existing_note.note = note
            else:
                new_note = GymUserNote(user_id=user_id, gym_id=gym_id, note=note)
                db.session.add(new_note)

            db.session.commit()

            return {'message': 'Note added/updated successfully'}, 200
    
    


    #class PostsWithHighReviews(Resource):
        #def get(self):
            #Posts = post.query.join(Review).filter(review.rating == 5).all()

            #if posts :
                #serialized_posts = [post.to_dict() for post in posts]
                    #return jsonify(serialized_posts)
            
            #else:
                #return {'message': 'No Posts found with rating of 5'}, 404