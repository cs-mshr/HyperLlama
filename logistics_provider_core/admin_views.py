from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Avg, Count, Sum, F
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone

from .decorators import user_passes_test_with_message
from .models import Vehicle, Driver, Booking, Trip, DriverPerformance, Analytics, LogisticAccountUser, Location
from logistics_provider_core.utils.common_utils import model_to_dict

def is_admin(user):
    logistic_account_user = LogisticAccountUser(user=user)
    return logistic_account_user.is_admin


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def vehicle_list(request):
    vehicles = Vehicle.objects.all()
    data = [model_to_dict(vehicle) for vehicle in vehicles]
    return JsonResponse(data, safe=False)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET", "PUT", "DELETE"])
def vehicle_detail(request, vehicle_id):
    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
    except Vehicle.DoesNotExist:
        return JsonResponse({"error": "Vehicle not found"}, status=404)

    if request.method == "GET":
        data = model_to_dict(vehicle)
        return JsonResponse(data)
    elif request.method == "PUT":
        return JsonResponse({"message":"Not Implemented"})
    elif request.method == "DELETE":
        vehicle.delete()
        return JsonResponse({"message": "Vehicle deleted successfully"})


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def driver_list(request):
    drivers = Driver.objects.all()
    data = [model_to_dict(driver) for driver in drivers]
    return JsonResponse(data, safe=False)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def driver_detail(request, driver_id):
    try:
        driver = Driver.objects.get(id=driver_id)
    except Driver.DoesNotExist:
        return JsonResponse({"error": "Driver not found"}, status=404)

    data = model_to_dict(driver)
    return JsonResponse(data)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def driver_performance(request, driver_id):
    try:
        performance = DriverPerformance.objects.get(driver_id=driver_id)
    except DriverPerformance.DoesNotExist:
        return JsonResponse({"error": "Driver performance not found"}, status=404)

    data = model_to_dict(performance)
    return JsonResponse(data)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def driver_location(request, driver_id):
    try:
        driver = Driver.objects.get(id=driver_id)
        location = driver.locations.latest('timestamp')
    except (Driver.DoesNotExist, Location.DoesNotExist):
        return JsonResponse({"error": "Driver location not found"}, status=404)

    data = {
        'latitude': location.latitude,
        'longitude': location.longitude,
        'timestamp': location.timestamp.isoformat()
    }
    return JsonResponse(data)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def driver_trips(request, driver_id):
    trips = Trip.objects.filter(booking__driver_id=driver_id)
    data = [model_to_dict(trip) for trip in trips]
    return JsonResponse(data, safe=False)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def active_drivers(request):
    drivers = Driver.objects.filter(assignments__status='EN_ROUTE')
    data = [model_to_dict(driver) for driver in drivers]
    return JsonResponse(data, safe=False)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def booking_list(request):
    bookings = Booking.objects.all()
    data = [model_to_dict(booking) for booking in bookings]
    return JsonResponse(data, safe=False)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def booking_stats(request):
    total_bookings = Booking.objects.count()
    avg_price = Booking.objects.filter(actual_price__isnull=False).aggregate(Avg('actual_price'))['actual_price__avg']
    data = {
        'total_bookings': total_bookings,
        'average_price': float(avg_price) if avg_price else None
    }
    return JsonResponse(data)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def trip_stats(request):
    total_trips = Trip.objects.count()
    avg_duration = Trip.objects.filter(end_time__isnull=False).aggregate(
        avg_duration=Avg(F('end_time') - F('start_time'))
    )['avg_duration']
    avg_distance = Trip.objects.aggregate(Avg('distance'))['distance__avg']
    data = {
        'total_trips': total_trips,
        'average_duration': str(avg_duration) if avg_duration else None,
        'average_distance': float(avg_distance) if avg_distance else None
    }
    return JsonResponse(data)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def revenue_analytics(request):
    period = request.GET.get('period', 'daily')
    if period == 'daily':
        revenue_data = Analytics.objects.values('date').annotate(
            revenue=Sum('total_revenue')
        ).order_by('-date')[:30]
    elif period == 'monthly':
        revenue_data = Analytics.objects.annotate(
            month=TruncMonth('date')
        ).values('month').annotate(
            revenue=Sum('total_revenue')
        ).order_by('-month')[:12]
    else:
        return JsonResponse({'error': 'Invalid period'}, status=400)

    data = list(revenue_data)
    return JsonResponse(data, safe=False)


@user_passes_test_with_message(is_admin)
@require_http_methods(["POST"])
def custom_analytics(request):
    return JsonResponse({'message': 'Custom analytics not implemented yet'})


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def dashboard_overview(request):
    today = timezone.now().date()
    data = {
        'active_drivers': Driver.objects.filter(assignments__status='EN_ROUTE').count(),
        'total_bookings_today': Booking.objects.filter(created_at__date=today).count(),
        'revenue_today':
            Booking.objects.filter(created_at__date=today, actual_price__isnull=False).aggregate(Sum('actual_price'))[
                'actual_price__sum'] or 0
    }
    return JsonResponse(data)


@user_passes_test_with_message(is_admin)
@require_http_methods(["GET"])
def dashboard_charts(request):
    chart_type = request.GET.get('type', 'bookings')
    if chart_type == 'bookings':
        data = list(Booking.objects.annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('-date')[:30])
    elif chart_type == 'revenue':
        data = list(Booking.objects.filter(actual_price__isnull=False).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            total=Sum('actual_price')
        ).order_by('-date')[:30])
    elif chart_type == 'popular-routes':
        data = list(Booking.objects.values('pickup_location', 'dropoff_location').annotate(
            count=Count('id')
        ).order_by('-count')[:10])
    else:
        return JsonResponse({'error': 'Invalid chart type'}, status=400)

    return JsonResponse(data, safe=False)
