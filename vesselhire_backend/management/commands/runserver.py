import os
import subprocess
import sys
import threading
import time
from django.core.management.commands.runserver import Command as RunserverCommand

class Command(RunserverCommand):
    help = 'Runs both Django and React development servers'

    def add_arguments(self, parser):
        super().add_arguments(parser)

    def handle(self, *args, **options):
        # Start React dev server in a separate thread
        def start_react():
            self.stdout.write(self.style.SUCCESS('Starting React development server...'))
            try:
                # Change to project root and start npm
                subprocess.run(
                    ['npm', 'run', 'dev'],
                    shell=True,
                    cwd=os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
                )
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to start React server: {e}'))

        # Start React server in background thread
        react_thread = threading.Thread(target=start_react, daemon=True)
        react_thread.start()
        
        # Give React server time to start
        self.stdout.write(self.style.SUCCESS('Waiting for React server to start...'))
        time.sleep(3)
        
        # Start Django server (this will block)
        self.stdout.write(self.style.SUCCESS('Starting Django development server...'))
        super().handle(*args, **options)

