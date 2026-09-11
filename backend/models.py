from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class Car(db.Model, SerializerMixin):
    __tablename__ = 'cars'
    
    serialize_only = ('id', 'title', 'price', 'description', 'contact', 'image_url', 'created_at')
    serialize_rules = ()
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Car {self.title}>'

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'
    
    serialize_only = ('id', 'name', 'email', 'message', 'created_at', 'is_read')
    serialize_rules = ()
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Message from {self.name}>'

class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    
    serialize_only = ('id', 'username', 'created_at')
    serialize_rules = ('-password_hash',)
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<Admin {self.username}>'

class AboutContent(db.Model, SerializerMixin):
    __tablename__ = 'about_content'
    
    serialize_only = ('id', 'title', 'content', 'mission_statement', 'contact_email', 'contact_phone', 'updated_at')
    serialize_rules = ()
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), default='About Kelly Motors')
    content = db.Column(db.Text, nullable=False)
    mission_statement = db.Column(db.Text)
    contact_email = db.Column(db.String(100))
    contact_phone = db.Column(db.String(20))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<AboutContent {self.title}>'

class Testimonial(db.Model, SerializerMixin):
    __tablename__ = 'testimonials'
    
    serialize_only = ('id', 'customer_name', 'content', 'rating', 'created_at', 'is_approved')
    serialize_rules = ()
    
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, default=5)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Testimonial by {self.customer_name}>'