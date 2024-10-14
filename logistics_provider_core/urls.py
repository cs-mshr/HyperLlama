from django.urls import path
from logistics_provider_core import views
from logistics_provider_core import admin_views


urlpatterns = [
    path('bookings/', views.list_bookings, name='list_bookings'),
    path('bookings/create/', views.create_booking, name='create_booking'),
    path('bookings/<int:booking_id>/cancel/', views.cancel_booking, name='cancel_booking'),
    path('bookings/<int:booking_id>/', views.get_booking_details, name='cancel_booking'),
    path('price-estimate/', views.get_price_estimate, name='price_estimate'),
    path('users/profile/', views.user_profile, name='user_profile'),
    path('bookings/<int:booking_id>/feedback/', views.submit_feedback, name='submit_feedback'),
    path('bookings/<int:booking_id>/feedback/get', views.get_feedback, name='get_feedback'),
    path('vehicle-types/', views.list_vehicle_types, name='list_vehicle_types'),
    path('register/', views.register_user, name='register_user'),



    path('driver/register', views.register_driver, name='register_driver'),
    path('driver/bookings/available/', views.list_available_booking_requests, name='list_available_booking_requests'),
    path('driver/bookings/<int:booking_id>/', views.get_booking_request_details, name='get_booking_request_details'),
    path('driver/bookings/<int:booking_id>/accept/', views.accept_booking_request, name='accept_booking_request'),

    path('driver/bookings/<int:booking_id>/status/', views.update_booking_status, name='update_booking_status'),
    path('driver/bookings/<int:booking_id>/start/', views.start_journey, name='start_journey'),
    path('driver/bookings/<int:booking_id>/complete/', views.complete_booking, name='complete_booking'),

    path('driver/bookings/current/', views.get_current_active_booking, name='get_current_active_booking'),

    path('driver/profile/', views.get_driver_profile, name='get_driver_profile'),
    path('driver/profile/update/', views.update_driver_profile, name='update_driver_profile'),
    path('driver/location/update/', views.update_driver_location, name='update_driver_location'),



    path('admin/vehicles/', admin_views.vehicle_list, name='vehicle-list'),
    path('admin/vehicles/<int:vehicle_id>/', admin_views.vehicle_detail, name='vehicle-detail'),
    path('admin/vehicles/create', admin_views.create_vehicle, name='vehicle-create'),
    path('admin/drivers/', admin_views.driver_list, name='driver-list'),
    path('admin/drivers/<int:driver_id>/', admin_views.driver_detail, name='driver-detail'),
    path('admin/drivers/<int:driver_id>/performance/', admin_views.driver_performance, name='driver-performance'),
    path('admin/drivers/<int:driver_id>/location/', admin_views.driver_location, name='driver-location'),
    path('admin/drivers/<int:driver_id>/trips/', admin_views.driver_trips, name='driver-trips'),
    path('admin/drivers/active/', admin_views.active_drivers, name='active-drivers'),
    path('admin/bookings/', admin_views.booking_list, name='booking-list'),
    path('admin/bookings/stats/', admin_views.booking_stats, name='booking-stats'),
    path('admin/trips/stats/', admin_views.trip_stats, name='trip-stats'),
    path('admin/analytics/revenue/', admin_views.revenue_analytics, name='revenue-analytics'),
    path('admin/analytics/custom/', admin_views.custom_analytics, name='custom-analytics'),
    path('admin/dashboard/overview/', admin_views.dashboard_overview, name='dashboard-overview'),
    path('admin/dashboard/charts/', admin_views.dashboard_charts, name='dashboard-charts'),
]

