from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from models import db, Car, Message, Admin, AboutContent, Testimonial
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)

CORS(
    app,
    resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=False,
)

jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        return '', 200


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Kelly Motors API is running'})

@app.route('/api/cars', methods=['GET'])
def get_cars():
    """Get all cars for sale"""
    try:
        cars = Car.query.order_by(Car.created_at.desc()).all()
        return jsonify([car.to_dict() for car in cars])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cars/<int:car_id>', methods=['GET'])
def get_car(car_id):
    try:
        car = Car.query.get_or_404(car_id)
        return jsonify(car.to_dict())
    except Exception as e:
        return jsonify({'error': 'Car not found'}), 404

@app.route('/api/about', methods=['GET'])
def get_about():
    try:
        about = AboutContent.query.first()
        if not about:
            return jsonify({'error': 'About content not found'}), 404
        return jsonify(about.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    """Get approved testimonials"""
    try:
        testimonials = Testimonial.query.filter_by(is_approved=True).order_by(Testimonial.created_at.desc()).all()
        return jsonify([t.to_dict() for t in testimonials])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/messages', methods=['POST'])
def submit_message():
    """Submit contact form message"""
    try:
        data = request.json
        
        if not all(k in data for k in ['name', 'email', 'message']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        message = Message(
            name=data['name'],
            email=data['email'],
            message=data['message'],
            is_read=False
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({'message': 'Message sent successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

#  ADMIN ROUTES

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.json
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password required'}), 400
        
        admin = Admin.query.filter_by(username=data['username']).first()
        
        if not admin or not admin.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=str(admin.id))
        return jsonify({
            'token': access_token,
            'admin': admin.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Car Management
@app.route('/api/admin/cars', methods=['POST'])
@jwt_required()
def add_car():
    """Add new car listing"""
    try:
        data = request.json
        
        required_fields = ['title', 'price', 'description', 'contact']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        car = Car(
            title=data['title'],
            price=float(data['price']),
            description=data['description'],
            contact=data['contact'],
            image_url=data.get('image_url', '')
        )
        
        db.session.add(car)
        db.session.commit()
        
        return jsonify(car.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/cars/<int:car_id>', methods=['PUT'])
@jwt_required()
def update_car(car_id):
    """Update car listing"""
    try:
        car = Car.query.get_or_404(car_id)
        data = request.json
        
        if 'title' in data:
            car.title = data['title']
        if 'price' in data:
            car.price = float(data['price'])
        if 'description' in data:
            car.description = data['description']
        if 'contact' in data:
            car.contact = data['contact']
        if 'image_url' in data:
            car.image_url = data['image_url']
        
        db.session.commit()
        return jsonify(car.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/cars/<int:car_id>', methods=['DELETE'])
@jwt_required()
def delete_car(car_id):
    """Delete car listing"""
    try:
        car = Car.query.get_or_404(car_id)
        db.session.delete(car)
        db.session.commit()
        return jsonify({'message': 'Car deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Messages
@app.route('/api/admin/messages', methods=['GET'])
@jwt_required()
def get_messages():
    """Get all user messages"""
    try:
        messages = Message.query.order_by(Message.created_at.desc()).all()
        return jsonify([msg.to_dict() for msg in messages])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/messages/<int:msg_id>/read', methods=['PATCH'])
@jwt_required()
def mark_message_read(msg_id):
    """Mark message as read"""
    try:
        message = Message.query.get_or_404(msg_id)
        message.is_read = True
        db.session.commit()
        return jsonify(message.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/messages/<int:msg_id>', methods=['DELETE'])
@jwt_required()
def delete_message(msg_id):
    """Delete message"""
    try:
        message = Message.query.get_or_404(msg_id)
        db.session.delete(message)
        db.session.commit()
        return jsonify({'message': 'Message deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# About Content
@app.route('/api/admin/about', methods=['PUT'])
@jwt_required()
def update_about():
    """Update about page content"""
    try:
        about = AboutContent.query.first()
        if not about:
            return jsonify({'error': 'About content not found'}), 404
        
        data = request.json
        if 'title' in data:
            about.title = data['title']
        if 'content' in data:
            about.content = data['content']
        if 'mission_statement' in data:
            about.mission_statement = data['mission_statement']
        if 'contact_email' in data:
            about.contact_email = data['contact_email']
        if 'contact_phone' in data:
            about.contact_phone = data['contact_phone']
        
        db.session.commit()
        return jsonify(about.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Testimonials
@app.route('/api/admin/testimonials', methods=['POST'])
@jwt_required()
def add_testimonial():
    """Add new testimonial"""
    try:
        data = request.json
        
        testimonial = Testimonial(
            customer_name=data['customer_name'],
            content=data['content'],
            rating=data.get('rating', 5),
            is_approved=data.get('is_approved', False)
        )
        
        db.session.add(testimonial)
        db.session.commit()
        return jsonify(testimonial.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/testimonials/<int:testimonial_id>/approve', methods=['PATCH'])
@jwt_required()
def approve_testimonial(testimonial_id):
    """Approve testimonial for public display"""
    try:
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        testimonial.is_approved = True
        db.session.commit()
        return jsonify(testimonial.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/testimonials/<int:testimonial_id>', methods=['DELETE'])
@jwt_required()
def delete_testimonial(testimonial_id):
    """Delete testimonial"""
    try:
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        db.session.delete(testimonial)
        db.session.commit()
        return jsonify({'message': 'Testimonial deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Dashboard Statistics
@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get dashboard statistics"""
    try:
        total_cars = Car.query.count()
        total_messages = Message.query.count()
        unread_messages = Message.query.filter_by(is_read=False).count()
        total_testimonials = Testimonial.query.count()
        pending_testimonials = Testimonial.query.filter_by(is_approved=False).count()
        
        recent_messages = Message.query.order_by(Message.created_at.desc()).limit(5).all()
        recent_cars = Car.query.order_by(Car.created_at.desc()).limit(5).all()
        
        return jsonify({
            'total_cars': total_cars,
            'total_messages': total_messages,
            'unread_messages': unread_messages,
            'total_testimonials': total_testimonials,
            'pending_testimonials': pending_testimonials,
            'recent_messages': [msg.to_dict() for msg in recent_messages],
            'recent_cars': [car.to_dict() for car in recent_cars]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)