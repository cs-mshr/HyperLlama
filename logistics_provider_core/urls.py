from django.urls import path
from logistics_provider_core import views

urlpatterns = [
    path('bookings/', views.list_bookings, name='list_bookings'),
    path('bookings/create/', views.create_booking, name='create_booking'),
    path('bookings/<int:booking_id>/cancel/', views.cancel_booking, name='cancel_booking'),
    path('price-estimate/', views.get_price_estimate, name='price_estimate'),
    path('users/profile/', views.user_profile, name='user_profile'),
    path('bookings/<int:booking_id>/feedback/', views.submit_feedback, name='submit_feedback'),
    path('vehicle-types/', views.list_vehicle_types, name='list_vehicle_types'),

    path('dirver/register', views.register_driver, name='register_driver'),
    path('driver/bookings/available/', views.list_available_booking_requests, name='list_available_booking_requests'),
    path('driver/bookings/<int:booking_id>/', views.get_booking_request_details, name='get_booking_request_details'),
    path('driver/bookings/<int:booking_id>/accept/', views.accept_booking_request, name='accept_booking_request'),

    path('driver/bookings/<int:booking_id>/status/', views.update_booking_status, name='update_booking_status'),
    path('driver/bookings/<int:booking_id>/start/', views.start_journey, name='start_journey'),
    path('driver/bookings/<int:booking_id>/complete/', views.complete_booking, name='complete_booking'),

    path('driver/bookings/current/', views.get_current_active_booking, name='get_current_active_booking'),

    path('driver/profile/', views.get_driver_profile, name='get_driver_profile'),
    path('driver/profile/update/', views.update_driver_profile, name='update_driver_profile'),
]

