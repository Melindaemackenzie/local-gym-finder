#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Gym, User, WorkoutClass, Review 

from models import Gym, User, Review, WorkoutClass
from faker import Faker

fake = Faker()

def clear_data():
    with app.app_context():
        db.drop_all()
        db.create_all()
        print('All tables dropped and recreated.')

def seed_data():
    # Create some gyms
    gyms = [
        Gym(name='Fitness Center A', address='123 Main St', phone='123-456-7890', website='http://fitnesscenterA.com'),
        Gym(name='Power Gym', address='456 Elm St', phone='987-654-3210', website='http://powergym.com'),
        Gym(name='Health Club', address='789 Oak St', phone='555-555-5555', website='http://healthclub.com')
    ]
    
    # Add gyms to session
    db.session.add_all(gyms)
    db.session.commit()
    
    # Create some users
    users = [
        User(username='john_doe', email='john@example.com', password_hash='password' ),
        User(username='jane_smith', email='jane@example.com', password_hash='password'),
        User(username='sam_jones', email='sam@example.com', password_hash='password' )
        
    ]
    
    # Add users to session
    
    db.session.add_all(users)
    db.session.commit()

    #associate users with gyms
    users[0].gyms.extend([gyms[0], gyms[2]])
    users[1].gyms.extend([gyms[2], gyms[1]])
    users[2].gyms.append(gyms[2])
        
    db.session.commit()
    
    # Create some reviews
    reviews = [
        Review(content='Great gym with excellent equipment!', rating=5, gym_id=1, user_id=1),
        Review(content='Nice place but could use more machines.', rating=3, gym_id=2, user_id=2),
        Review(content='Friendly staff and clean facilities.', rating=4, gym_id=3, user_id=3)
    ]
    
    # Add reviews to session
    db.session.add_all(reviews)
    db.session.commit()
    
    # Create some workout classes
    workout_classes = [
        WorkoutClass(name='Yoga Basics', type='Yoga', schedule= 'Mon, Wed, Fri 6:00A', rating=4, gym_id=1),
        WorkoutClass(name='Advanced Pilates', type='Pilates', rating=5, gym_id=2),
        WorkoutClass(name='Cardio Blast', type='Cardio', rating=3, gym_id=3)
    ]
    
    # Add workout classes to session
    db.session.add_all(workout_classes)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        clear_data()
        seed_data()
        print('Database seeded successfully!')
        
