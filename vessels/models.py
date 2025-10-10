from django.db import models

# Create your models here.

class VesselData(models.Model):
    vessel_name = models.CharField(max_length=100)
    date = models.DateField()
    hire_rate = models.IntegerField()
    market_rate = models.IntegerField()

    def __str__(self):
        return f"{self.vessel_name} - {self.date}"