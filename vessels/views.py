from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import VesselData
from .serializers import CustomTokenObtainPairSerializer
from datetime import datetime
from django.db.models import Sum

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def vessel_data(request):
    """
    GET: Return list of vessel data (optionally filtered by vessel_name and date range)
    POST: Add new vessel data (admin only)
    """
    if request.method == 'POST':
        # Check if user is admin
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=403)
        
        # Get data from request
        vessel_name = request.data.get('vessel_name')
        date = request.data.get('date')
        hire_rate = request.data.get('hire_rate')
        market_rate = request.data.get('market_rate')
        
        # Validate required fields
        if not all([vessel_name, date, hire_rate, market_rate]):
            return Response({'error': 'All fields are required'}, status=400)
        
        # Create new vessel data (this APPENDS data, doesn't delete existing)
        vessel = VesselData.objects.create(
            vessel_name=vessel_name,
            date=date,
            hire_rate=int(hire_rate),
            market_rate=int(market_rate)
        )
        
        return Response({
            'message': 'Vessel data added successfully',
            'data': {
                'id': vessel.id,
                'vessel_name': vessel.vessel_name,
                'date': vessel.date,
                'hire_rate': vessel.hire_rate,
                'market_rate': vessel.market_rate
            }
        }, status=201)
    
    # GET request
    vessel = request.GET.get('vessel')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    # DEBUG: Check database connection and data
    try:
        total_count = VesselData.objects.count()
        print(f"✅ DATABASE CONNECTED: Total vessel records in DB: {total_count}")
    except Exception as e:
        print(f"❌ DATABASE ERROR: {e}")
        return Response({'error': 'Database connection failed'}, status=500)
    
    qs = VesselData.objects.all()
    if vessel:
        qs = qs.filter(vessel_name=vessel)
    if start_date:
        qs = qs.filter(date__gte=start_date)
    if end_date:
        qs = qs.filter(date__lte=end_date)
    
    data = [
        {
            'vessel_name': v.vessel_name,
            'date': v.date,
            'hire_rate': v.hire_rate,
            'market_rate': v.market_rate
        }
        for v in qs.order_by('date')
    ]
    
    # DEBUG: Show what data is being returned
    print(f"✅ DATA FETCHED: Returning {len(data)} records (Filter: vessel={vessel}, start={start_date}, end={end_date})")
    if len(data) > 0:
        print(f"   Sample record: {data[0]}")
    
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def vessel_aggregate(request):
    # Optional date filtering
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    qs = VesselData.objects.all()
    if start_date:
        qs = qs.filter(date__gte=start_date)
    if end_date:
        qs = qs.filter(date__lte=end_date)
    agg = (
        qs.values('date')
        .order_by('date')
        .annotate(
            total_hire=Sum('hire_rate'),
            total_market=Sum('market_rate'),
        )
    )
    # Return in correct JSON for recharts
    results = [
        {'date': row['date'], 'total_hire': row['total_hire'], 'total_market': row['total_market']}
        for row in agg
    ]
    return Response(results)
