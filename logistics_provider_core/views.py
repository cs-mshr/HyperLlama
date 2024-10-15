import traceback
from rest_framework import status
from rest_framework.authtoken.admin import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Booking, Vehicle, Location, LogisticAccountUser, Feedback, Driver
from .serializers import (
    CreateBookingRequestSerializer,
    PriceEstimateRequestSerializer,
    UpdateUserProfileRequestSerializer,
    UserProfileResponseSerializer,
    SubmitFeedbackRequestSerializer,
    BookingListRequestSerializer,
    VehicleTypeResponseSerializer,
    LocationResponseSerializer,
    UpdateBookingStatusRequest,
    RegisterDriverRequestSerializer,
    GetDriverDetailsRequestSerializer,
    UpdateDriverProfileRequestSerializer,
    FeedbackSerializer,
)
from .serializers import BookingSerializer
from logistics_provider_core.constants import (
    BookingStatus,
    DRIVER_ACTIVE_BOOKING_STATUS,
)
from django.http import JsonResponse
from .celery_handlers import process_location_update
from .storages.dtos import UpdateUserDetailsReqDTO, UpdateDriverProfileReqDTO
from allauth.account.signals import user_signed_up


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_bookings(request):
    filter_serializer = BookingListRequestSerializer(data=request.query_params)
    filter_serializer.is_valid(raise_exception=True)

    from logistics_provider_core.interactors.get_bookings_list import GetUserBookingList
    from logistics_provider_core.storages.user_action_storage import UserActionStorage

    user_action_storage = UserActionStorage()
    interactor = GetUserBookingList(user_action_storage=user_action_storage)

    try:
        response_data = interactor.get_bookings_lists(
            user_id=request.user.id, filter_request=filter_serializer.validated_data
        )
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    serializer = CreateBookingRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    from logistics_provider_core.interactors.create_booking import CreateBooking
    from logistics_provider_core.storages.user_action_storage import UserActionStorage
    from logistics_provider_core.storages.dtos import CreateBookingDTO

    user_action_storage = UserActionStorage()
    interactor = CreateBooking(user_action_storage=user_action_storage)
    pickup_location = Location(
        latitude=request.data["pickup_location"]["latitude"],
        longitude=request.data["pickup_location"]["longitude"],
    )
    dropoff_location = Location(
        latitude=request.data["dropoff_location"]["latitude"],
        longitude=request.data["dropoff_location"]["longitude"],
    )
    booking_req_dto = CreateBookingDTO(
        user_id=request.user.id,
        vehicle_type=request.data["vehicle_type"],
        pickup_location=pickup_location,
        dropoff_location=dropoff_location,
        scheduled_time=request.data["scheduled_time"],
        status=request.data.get("status", "PENDING"),
        driver_id=request.data.get("driver_id"),
        estimated_price=request.data.get("estimated_price")
    )

    try:
        response_data = interactor.create_booking(booking_req=booking_req_dto)
        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_booking(request, booking_id):
    from logistics_provider_core.interactors.cancel_booking import CancelBooking
    from logistics_provider_core.storages.user_action_storage import UserActionStorage

    user_action_storage = UserActionStorage()
    interactor = CancelBooking(user_action_storage=user_action_storage)

    try:
        response_data = interactor.cancel_booking(
            booking_id=booking_id, user_id=request.user.id
        )
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_driver_location(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    location = Location.objects.filter(driver=booking.driver).latest("timestamp")
    serializer = LocationResponseSerializer(location)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_price_estimate(request):
    serializer = PriceEstimateRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    from logistics_provider_core.storages.dtos import PriceEstimationReqDTO
    from logistics_provider_core.interactors.get_price_estimate import GetPriceEstimate
    from logistics_provider_core.storages.user_action_storage import UserActionStorage

    user_action_storage = UserActionStorage()
    interactor = GetPriceEstimate(user_action_storage=user_action_storage)

    try:
        price_estimate_req_dto = PriceEstimationReqDTO(**serializer.validated_data)
        estimated_price = interactor.get_price_estimate(
            price_estimate_req_dto=price_estimate_req_dto
        )
        return Response({"estimated_price": estimated_price})
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == "GET":
        UserProfileResponseSerializer(request.user)
        try:
            from logistics_provider_core.interactors.get_user_profile import (
                GetUserProfile,
            )
            from logistics_provider_core.storages.user_action_storage import (
                UserActionStorage,
            )

            user_action_storage = UserActionStorage()
            interactor = GetUserProfile(user_action_storage=user_action_storage)
            response_data = interactor.get_user_profile(user_id=request.user.id)
            return Response(response_data)
        except Exception as e:
            response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
            print(response_data["stack_trace"])
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == "PUT":
        serializer = UpdateUserProfileRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            from logistics_provider_core.interactors.update_user_profile import (
                UpdateUserProfile,
            )
            from logistics_provider_core.storages.user_action_storage import (
                UserActionStorage,
            )

            user_action_storage = UserActionStorage()
            interactor = UpdateUserProfile(user_action_storage=user_action_storage)
            update_user_req = UpdateUserDetailsReqDTO(
                email=request.data.get("email"),
                phone_number=request.data.get("phone_number"),
                password=request.data.get("password"),
            )
            response_data = interactor.update_user_profile(
                user_id=request.user.id, update_user_req=update_user_req
            )
            return Response(response_data)
        except Exception as e:
            response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
            print(response_data["stack_trace"])
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_feedback(request, booking_id):
    serializer = SubmitFeedbackRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        logistic_user = LogisticAccountUser.objects.get(user=request.user)
        booking = get_object_or_404(Booking, id=booking_id, user=logistic_user)
        Feedback.objects.create(booking=booking, **serializer.validated_data)
        return Response(
            {"message": "Feedback submitted successfully"},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_vehicle_types(request):
    vehicle_types = [{"type": vt[0]} for vt in Vehicle.VEHICLE_TYPES]
    serializer = VehicleTypeResponseSerializer(vehicle_types, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_available_booking_requests(request):
    bookings = Booking.objects.filter(status=BookingStatus.PENDING.value)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_booking_request_details(request, booking_id):
    booking = Booking.objects.get(id=booking_id)
    serializer = BookingSerializer(booking)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_booking_request(request, booking_id):
    try:
        from logistics_provider_core.interactors.accept_booking_request import (
            AcceptBookingRequest,
        )
        from logistics_provider_core.storages.driver_action_storage import (
            DriverActionStorage,
        )

        driver_action_storage = DriverActionStorage()
        interactor = AcceptBookingRequest(driver_action_storage=driver_action_storage)
        response_data = interactor.accept_booking_request(
            booking_id=booking_id, user_id=request.user.id
        )
        return Response(response_data)
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_booking_status(request, booking_id):
    serializer = UpdateBookingStatusRequest(data=request.data)
    serializer.is_valid(raise_exception=True)
    booking = Booking.objects.get(id=booking_id)
    booking.status = request.data["status"]
    booking.save()
    return Response({"message": "Status updated", "booking_id": booking_id})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_driver(request):
    serializer = RegisterDriverRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        logistics_user_obj = LogisticAccountUser.objects.get(user=request.user)
        vehicle = None
        if request.data.get("vehicle"):
            vehicle = Vehicle.objects.get(id=request.data["vehicle"])
        driver = Driver.objects.create(
            user=logistics_user_obj,
            vehicle=vehicle,
            license_number=request.data["license_number"],
            current_location=request.data["current_location"],
        )
        return Response(
            {"message": "Driver registered successfully", "driver_id": driver.id}
        )
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_journey(request, booking_id):
    # TODO : add location tracking adn stoping api here.
    serializer = UpdateBookingStatusRequest(data=request.data)
    serializer.is_valid(raise_exception=True)
    booking = Booking.objects.get(id=booking_id)
    booking.status = BookingStatus.PICKED_UP.value
    booking.save()
    return Response({"message": "Status updated", "booking_id": booking_id})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_booking(request, booking_id):
    # TODO : add location tracking adn stoping api here.
    serializer = UpdateBookingStatusRequest(data=request.data)
    serializer.is_valid(raise_exception=True)
    booking = Booking.objects.get(id=booking_id)
    booking.status = BookingStatus.DELIVERED.value
    booking.save()
    return Response({"message": "Status updated", "booking_id": booking_id})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_active_booking(request):
    bookings = Booking.objects.filter(
        status__in=DRIVER_ACTIVE_BOOKING_STATUS, driver__user__id=request.user.id
    )
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_driver_profile(request):
    try:

        from logistics_provider_core.interactors.get_driver_details import (
            GetDriverDetails,
        )
        from logistics_provider_core.storages.driver_action_storage import (
            DriverActionStorage,
        )

        driver_action_storage = DriverActionStorage()
        interactor = GetDriverDetails(driver_action_storage=driver_action_storage)
        logistics_user = LogisticAccountUser.objects.get(user=request.user)
        driver_id = Driver.objects.get(user=logistics_user).id
        response_data = interactor.get_driver_profile_details(driver_id=driver_id)
        return Response(response_data)
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_driver_profile(request):
    serializer = UpdateDriverProfileRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        from logistics_provider_core.interactors.update_driver_profile import (
            UpdateDriverProfile,
        )
        from logistics_provider_core.storages.driver_action_storage import (
            DriverActionStorage,
        )

        driver_action_storage = DriverActionStorage()
        interactor = UpdateDriverProfile(driver_action_storage=driver_action_storage)
        update_req_dto = UpdateDriverProfileReqDTO(**serializer.validated_data)
        response_data = interactor.update_driver_profile(
            user_id=request.user.id, update_driver_profile_req=update_req_dto
        )
        return Response(response_data)
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_driver_location(request):
    latitude = request.data["latitude"]
    longitude = request.data["longitude"]

    process_location_update.delay(request.user.id, latitude, longitude)

    return JsonResponse({"status": "Location update received"})


@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    password1 = request.data.get("password1")
    password2 = request.data.get("password2")
    email = request.data.get("email")

    if password1 != password2:
        return Response(
            {"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, password=password1, email=email)
    token, created = Token.objects.get_or_create(user=user)
    user_signed_up.send(sender=User, request=request, user=user)

    return Response({"key": token.key}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_feedback(request, booking_id):
    try:
        feedback = Feedback.objects.filter(booking_id=booking_id)
        serializer = FeedbackSerializer(feedback, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Feedback.DoesNotExist:
        return Response(
            {"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_booking_details(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        response_data = {"error": str(e), "stack_trace": traceback.format_exc()}
        print(response_data["stack_trace"])
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
