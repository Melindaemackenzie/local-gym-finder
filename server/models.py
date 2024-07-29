from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from werkzeug.security import generate_password_hash, check_password_hash
from config import db

#association table for gym and user (gym has many users, user has many gyms)
gym_user = db.Table('gym_user',
    db.Column('gym_id', db.Integer, db.ForeignKey('gyms.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class Gym(db.Model, SerializerMixin):
    __tablename__ = 'gyms'

    serialize_rules =('-workout_classes.gym', '-users.gyms', '-reviews.gym', '-users.reviews', '-reviews.user')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(13))
    website = db.Column(db.String(200))
    workout_classes = db.relationship('WorkoutClass', back_populates='gym', lazy=True, cascade="all, delete-orphan")#Delete workout classes when gym is deleted
    users = db.relationship('User', secondary=gym_user, back_populates='gyms', lazy='dynamic')
    reviews = db.relationship('Review', back_populates='gym', lazy=True, cascade="all, delete-orphan")#Delete reviews when gym is deleted

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'phone': self.phone,
            'website': self.website
        }

class User(db.Model, SerializerMixin):
    __tablename__= 'users'

    serialize_rules=('-reviews.user', '-gyms.users', '-reviews.user.password_hash', '-gyms.users.password_hash')
    #excludes the 'user' attricute from each 'review' object relatied to this user
    #excluseds the 'users' attricute from each 'gym' object related to this user

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)
    password_hash = db.Column(db.String(128))
    reviews = db.relationship('Review', back_populates='user', lazy='select')

    #Define the many-to-many relationship with Gym
    gyms = db.relationship('Gym', secondary=gym_user, back_populates='users', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
class Review(db.Model, SerializerMixin):
    __tablename__= 'reviews'

    serialize_rules = ('-gym.reviews', '-user.reviews')
    

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable = False)
    rating = db.Column(db.Integer, nullable = False)
    gym_id= db.Column(db.Integer, db.ForeignKey('gyms.id'), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable =False)

    gym = db.relationship('Gym', back_populates='reviews')
    user = db.relationship('User', back_populates='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'rating': self.rating,
            'gym_id': self.gym_id,
            'user_id': self.user_id
        }

class WorkoutClass(db.Model, SerializerMixin):
    __tablename__ ='workout_classes'

    serialize_rules = ('-gym',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable = False)
    schedule = db.Column(db.String(200))
    type = db.Column(db.String(50))
    rating = db.Column(db.Integer)
    gym_id= db.Column(db.Integer, db.ForeignKey('gyms.id'), nullable = False)
    
    gym = db.relationship('Gym', back_populates='workout_classes')

    def to_dict(self):
        return {
            'id':self.id,
            'name':self.name,
            'schedule': self.schedule,
            'type': self.type,
            'rating': self.rating,
            'gym_id': self.gym_id,
            'gym_name': self.gym.name
            }

    #@property
    #def serialize(self):
        #return{
            #'id': self.id,
            #'name': self.name,
            #'schedule': self.schedule,
            #'type': self.type,
            #'rating': self.rating,
            #'gym': self.gym.name if self.gym else None
        #}
    #@property
    #def gym_name(self):
        #return self.gym.name if self.gym else None

    #def to_dict(self):
        #return {
            #'id': self.id,
            #'content': self.content,
            #'rating': self.rating,
            #'gym_name': self.gym_name
        #}


    #add validations 
    #look up by name not ID
