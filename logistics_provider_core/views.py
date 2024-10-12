from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Booking, User, Vehicle, Location, LogisticAccountUser, Feedback
from .serializers import (
    CreateBookingRequestSerializer,
    BookingResponseSerializer,
    PriceEstimateRequestSerializer,
    UpdateUserProfileRequestSerializer,
    UserProfileResponseSerializer,
    SubmitFeedbackRequestSerializer,
    BookingListRequestSerializer,
    VehicleTypeResponseSerializer,
    LocationResponseSerializer
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_bookings(request):
    filter_serializer = BookingListRequestSerializer(data=request.query_params)
    filter_serializer.is_valid(raise_exception=True)
    logistics_user_obj = LogisticAccountUser.objects.get(user__id=request.user.id)
    queryset = Booking.objects.filter(user=logistics_user_obj)
    if filter_serializer.validated_data.get('status'):
        queryset = queryset.filter(status=filter_serializer.validated_data['status'])
    if filter_serializer.validated_data.get('from_date'):
        queryset = queryset.filter(scheduled_time__gte=filter_serializer.validated_data['from_date'])
    if filter_serializer.validated_data.get('to_date'):
        queryset = queryset.filter(scheduled_time__lte=filter_serializer.validated_data['to_date'])

    serializer = BookingResponseSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    serializer = CreateBookingRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    booking = Booking.objects.create(**serializer.validated_data, user=request.user)
    response_serializer = BookingResponseSerializer(booking)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    booking.status = 'CANCELLED'
    booking.save()
    return Response({"message": "Booking cancelled successfully"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_driver_location(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    location = Location.objects.filter(driver=booking.driver).latest('timestamp')
    serializer = LocationResponseSerializer(location)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_price_estimate(request):
    serializer = PriceEstimateRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    estimated_price = 50.00
    return Response({"estimated_price": estimated_price})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
        serializer = UserProfileResponseSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UpdateUserProfileRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        for attr, value in serializer.validated_data.items():
            setattr(request.user, attr, value)
        request.user.save()
        return Response(UserProfileResponseSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_feedback(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    serializer = SubmitFeedbackRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    Feedback.objects.create(booking=booking, **serializer.validated_data)
    return Response({"message": "Feedback submitted successfully"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_vehicle_types(request):
    vehicle_types = [{"type": vt[0]} for vt in Vehicle.VEHICLE_TYPES]
    serializer = VehicleTypeResponseSerializer(vehicle_types, many=True)
    return Response(serializer.data)
