from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

gym_user = db.Table('gym_user',
    db.Column('gym_id', db.Integer, db.ForeignKey('gyms.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class Gym(db.Model, SerializerMixin):
    __tablename__ = 'gyms'

    serialize_rules =('-workout_classes.gym', '-users.gym', '-reviews.gym',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(13))
    website = db.Column(db.String(200))
    workout_classes = db.relationship('WorkoutClass', backref='gym', lazy=True)
    users = db.relationship('User', secondary=gym_user, backref=db.backref('gyms', lazy='dynamic'))
    reviews = db.relationship('Review', backref='gym', lazy=True)

class User(db.Model, SerializerMixin):
    __tablename__= 'users'

    serialize_rules=('-reviews.user', '-gyms.users')
    #excludes the 'user' attricute from each 'review' object relatied to this user
    #excluseds the 'users' attricute from each 'gym' object related to this user

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)
    password_hash = db.Column(db.String(128))
    reviews = db.relationship('Review', backref='user', lazy='select')

    #Define the many-to-many relationship with Gym
    gyms = db.relationship('Gym', secondary=gym_user, backref=db.backref('users', lazy='dynamic'))

class Review(db.Model, SerializerMixin):
    __tablename__= 'reviews'

    serialize_rules = ('-gym.reviews', '-user.reviews')
    

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable = False)
    rating = db.Column(db.Integer, nullable = False)
    gym_id= db.Column(db.Integer, db.ForeignKey('gyms.id'), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable =False)

class WorkoutClass(db.Model, SerializerMixin):
    __tablename__ ='workout_classes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable = False)
    schedule = db.Column(db.String(200))
    instructor = db.Column(db.String(100))
    gym_id= db.Column(db.Integer, db.ForeignKey('gyms.id'), nullable = False)

    gym = db.relationship('Gym', backref=db.backref('workout_classes', lazy=True))

db.create_all()
    