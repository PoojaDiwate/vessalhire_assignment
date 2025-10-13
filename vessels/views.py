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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vessel_data(request):
    """
    Return list of vessel data (optionally filtered by vessel_name and date range)
    """
    vessel = request.GET.get('vessel')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
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
