from django.core.management.base import BaseCommand
from vessels.models import VesselData
from datetime import date, timedelta
import random

class Command(BaseCommand):
    help = 'Seed the vessel_data table with 3 vessels and 30 days of data each.'

    def handle(self, *args, **kwargs):
        VesselData.objects.all().delete()  # Clear previous data

        vessel_names = ['Evergreen', 'Poseidon', 'ExcelMarine']
        today = date.today()

        for vessel in vessel_names:
            for i in range(30):
                entry_date = today - timedelta(days=29 - i)
                hire_rate = random.randint(15000, 25000)
                market_rate = random.randint(14000, 26000)

                VesselData.objects.create(
                    vessel_name=vessel,
                    date=entry_date,
                    hire_rate=hire_rate,
                    market_rate=market_rate
                )
        self.stdout.write(self.style.SUCCESS('Seeded vessel_data with demo data for 3 vessels!'))

