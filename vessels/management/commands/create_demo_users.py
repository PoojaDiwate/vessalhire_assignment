from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create demo users for the application (admin and regular user)'

    def handle(self, *args, **kwargs):
        # Create admin user
        if User.objects.filter(username='admin').exists():
            self.stdout.write(self.style.WARNING('Admin user already exists, skipping...'))
        else:
            admin = User.objects.create_user(
                username='admin',
                password='admin123',
                email='admin@vesselhire.com',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(self.style.SUCCESS('✅ Created admin user: admin / admin123'))

        # Create regular user
        if User.objects.filter(username='user').exists():
            self.stdout.write(self.style.WARNING('Regular user already exists, skipping...'))
        else:
            user = User.objects.create_user(
                username='user',
                password='user123',
                email='user@vesselhire.com',
                is_staff=False,
                is_superuser=False
            )
            self.stdout.write(self.style.SUCCESS('✅ Created regular user: user / user123'))

        self.stdout.write(self.style.SUCCESS('\n🎉 Demo users created successfully!'))
        self.stdout.write(self.style.SUCCESS('\nYou can now login with:'))
        self.stdout.write(self.style.SUCCESS('  Admin:  admin / admin123'))
        self.stdout.write(self.style.SUCCESS('  User:   user / user123'))
