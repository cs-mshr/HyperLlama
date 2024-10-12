import traceback

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Booking, Vehicle, Location, LogisticAccountUser, Feedback
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
from .serializers import BookingSerializer, LogisticAccountUserSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_bookings(request):
    filter_serializer = BookingListRequestSerializer(data=request.query_params)
    filter_serializer.is_valid(raise_exception=True)

    from logistics_provider_core.interactors.get_bookings_list import GetUserBookingList
    from logistics_provider_core.storages.user_action_storage import UserActionStorage

    user_action_storage = UserActionStorage()
    interactor = GetUserBookingList(user_action_storage=user_action_storage)

    try:
        response_data = interactor.get_bookings_lists(user_id=request.user.id, filter_request=filter_serializer.validated_data)
        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        response_data = {
            "error": str(e),
            "stack_trace": traceback.format_exc()
        }
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    serializer = CreateBookingRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    from logistics_provider_core.interactors.create_booking import CreateBooking
    from logistics_provider_core.storages.user_action_storage import UserActionStorage
    from logistics_provider_core.storages.dtos import CreateBookingDTO

    user_action_storage = UserActionStorage()
    interactor = CreateBooking(user_action_storage=user_action_storage)
    booking_req_dto = CreateBookingDTO(**serializer.validated_data, user_id=request.user.id)

    try:
        response_data = interactor.create_booking(booking_req=booking_req_dto)
        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        response_data = {
            "error": str(e),
            "stack_trace": traceback.format_exc()
        }
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, booking_id):
    from logistics_provider_core.interactors.cancel_booking import CancelBooking
    from logistics_provider_core.storages.user_action_storage import UserActionStorage

    user_action_storage = UserActionStorage()
    interactor = CancelBooking(user_action_storage=user_action_storage)

    try:
        response_data = interactor.cancel_booking(booking_id=booking_id, user_id=request.user.id)
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        response_data = {
            "error": str(e),
            "stack_trace": traceback.format_exc()
        }
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
@permission_classes([IsAuthenticated])
def list_vehicle_types(request):
    vehicle_types = [{"type": vt[0]} for vt in Vehicle.VEHICLE_TYPES]
    serializer = VehicleTypeResponseSerializer(vehicle_types, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_available_booking_requests(request):
    bookings = Booking.objects.filter(status='PENDING')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_booking_request_details(request, booking_id):
    booking = Booking.objects.get(id=booking_id)
    serializer = BookingSerializer(booking)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_booking_request(request, booking_id):
    return Response({"message": "Booking accepted", "booking_id": booking_id})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_booking_status(request, booking_id):
    return Response({"message": "Status updated", "booking_id": booking_id})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_journey(request, booking_id):
    return Response({"message": "Journey started", "booking_id": booking_id})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_booking(request, booking_id):
    return Response({"message": "Booking completed", "booking_id": booking_id})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_active_booking(request):
    return Response({"message": "Current active booking details"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_driver_profile(request):
    driver = LogisticAccountUser.objects.get(user=request.user)
    serializer = LogisticAccountUserSerializer(driver)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_driver_profile(request):
    driver = LogisticAccountUser.objects.get(user=request.user)
    serializer = LogisticAccountUserSerializer(driver, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
