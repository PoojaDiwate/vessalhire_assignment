from django.contrib import admin
from .models import VesselData

# Register your models here.

@admin.register(VesselData)
class VesselDataAdmin(admin.ModelAdmin):
    list_display = ('vessel_name', 'date', 'hire_rate', 'market_rate')
    list_filter = ('vessel_name', 'date')
    search_fields = ('vessel_name',)
    date_hierarchy = 'date'
    ordering = ('-date', 'vessel_name')
    
    # Make it easy to add/edit data
    fieldsets = (
        ('Vessel Information', {
            'fields': ('vessel_name', 'date')
        }),
        ('Rate Information', {
            'fields': ('hire_rate', 'market_rate')
        }),
    )
