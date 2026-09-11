from app import app
from models import db, Admin, AboutContent, Car


def seed():
    with app.app_context():
        db.create_all()

        if Admin.query.first():
            print("✓ Database already seeded — nothing to do.")
            return

        # Default admin account
        default_admin = Admin(username='admin')
        default_admin.set_password('kelly123')
        db.session.add(default_admin)

        # Default About page content
        about_content = AboutContent(
            title='About Kelly Motors',
            content='Kelly Motors is a trusted name in the second-hand car market. We connect honest sellers with serious buyers, ensuring transparent transactions for everyone.',
            mission_statement='To provide a reliable platform for buying and selling quality pre-owned vehicles with complete transparency.',
            contact_email='info@kellymotors.com',
            contact_phone='+1 (555) 123-4567'
        )
        db.session.add(about_content)

        # Sample cars
        sample_cars = [
            Car(
                title='2022 Toyota Camry SE',
                price=28500,
                description='Low mileage, excellent condition, full service history. Features: leather seats, sunroof, backup camera, navigation system.',
                contact='john@example.com | (555) 123-4567',
                image_url='https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
            ),
            Car(
                title='2021 Honda CR-V EX',
                price=32000,
                description='One owner, no accidents, well maintained. Includes winter tires, roof rack, and extended warranty.',
                contact='sarah@example.com | (555) 234-5678',
                image_url='https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500'
            ),
            Car(
                title='2020 BMW 3 Series',
                price=38500,
                description='Luxury package, premium sound system, adaptive cruise control. Still under manufacturer warranty.',
                contact='mike@example.com | (555) 345-6789',
                image_url='https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500'
            )
        ]
        for car in sample_cars:
            db.session.add(car)

        db.session.commit()
        print("✓ Database seeded successfully!")
        print("✓ Default admin: username='admin', password='kelly123'")


if __name__ == '__main__':
    seed()