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
]
