import { Axios } from "@/api/axios";
import {
  AppShell,
  Burger,
  Button,
  Group,
  Modal,
  Rating,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBus,
  IconCar,
  IconMotorbike,
  IconTruck,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const vehicleIcons = {
  BIKE: <IconMotorbike />,
  CAR: <IconCar />,
  VAN: <IconBus />,
  TRUCK: <IconTruck />,
};
// {
//     "user_data": {
//         "id": 7,
//         "phone_number": "",
//         "name": "sss",
//         "is_admin": false
//     },
//     "bookings": [
//         {
//             "booking_id": 1,
//             "user_id": 7,
//             "driver_id": null,
//             "vehicle_type": "BIKE",
//             "pickup_location": "sdkj",
//             "dropoff_location": "klfdha",
//             "status": "PENDING",
//             "created_at": "2024-10-13T19:16:44.288897Z",
//             "updated_at": "2024-10-13T19:16:44.288921Z",
//             "scheduled_time": "2024-10-13T19:16:44.288930Z",
//             "estimated_price": 100.0,
//             "actual_price": null
//         },
//         {
//             "booking_id": 2,
//             "user_id": 7,
//             "driver_id": null,
//             "vehicle_type": "BIKE",
//             "pickup_location": "sdkj",
//             "dropoff_location": "klfdha",
//             "status": "PENDING",
//             "created_at": "2024-10-13T19:16:45.284710Z",
//             "updated_at": "2024-10-13T19:16:45.284736Z",
//             "scheduled_time": "2024-10-13T19:16:45.284748Z",
//             "estimated_price": 100.0,
//             "actual_price": null
//         },
//         {
//             "booking_id": 3,
//             "user_id": 7,
//             "driver_id": null,
//             "vehicle_type": "BIKE",
//             "pickup_location": "sdkj",
//             "dropoff_location": "klfdha",
//             "status": "PENDING",
//             "created_at": "2024-10-13T19:16:49.700869Z",
//             "updated_at": "2024-10-13T19:16:49.700881Z",
//             "scheduled_time": "2024-10-13T19:16:49.700886Z",
//             "estimated_price": 100.0,
//             "actual_price": null
//         },
//         {
//             "booking_id": 4,
//             "user_id": 7,
//             "driver_id": null,
//             "vehicle_type": "BIKE",
//             "pickup_location": "sdkj",
//             "dropoff_location": "klfdha",
//             "status": "PENDING",
//             "created_at": "2024-10-13T19:18:11.486307Z",
//             "updated_at": "2024-10-13T19:18:11.486323Z",
//             "scheduled_time": "2024-10-13T19:18:11.486329Z",
//             "estimated_price": 100.0,
//             "actual_price": null
//         },
//         {
//             "booking_id": 5,
//             "user_id": 7,
//             "driver_id": null,
//             "vehicle_type": "TRUCK",
//             "pickup_location": "sdkj",
//             "dropoff_location": "klfdha",
//             "status": "PENDING",
//             "created_at": "2024-10-13T19:41:48.949350Z",
//             "updated_at": "2024-10-13T19:41:48.949366Z",
//             "scheduled_time": "2024-10-13T19:41:48.949372Z",
//             "estimated_price": 100.0,
//             "actual_price": null
//         },
//         {
//             "booking_id": 6,
//             "user_id": 7,
//             "driver_id": null,
//             "vehicle_type": "TRUCK",
//             "pickup_location": "sdkj",
//             "dropoff_location": "klfdha",
//             "status": "PENDING",
//             "created_at": "2024-10-13T19:41:52.979105Z",
//             "updated_at": "2024-10-13T19:41:52.979136Z",
//             "scheduled_time": "2024-10-13T19:41:52.979199Z",
//             "estimated_price": 100.0,
//             "actual_price": null
//         },
//         {
//             "booking_id": 7,
//             "user_id": 7,
//             "driver_id": null,
//             "vehicle_type": "VAN",
//             "pickup_location": "sdkj",
//             "dropoff_location": "klfdha",
//             "status": "PENDING",
//             "created_at": "2024-10-13T19:42:11.294679Z",
//             "updated_at": "2024-10-13T19:42:11.294695Z",
//             "scheduled_time": "2024-10-13T19:42:11.294702Z",
//             "estimated_price": 100.0,
//             "actual_price": null
//         },
//         {
//             "booking_id": 8,
//             "user_id": 7,
//             "driver_id": null,
//             "vehicle_type": "CAR",
//             "pickup_location": "sdkj",
//             "dropoff_location": "klfdha",
//             "status": "PENDING",
//             "created_at": "2024-10-13T19:42:31.467845Z",
//             "updated_at": "2024-10-13T19:42:31.467878Z",
//             "scheduled_time": "2024-10-13T19:42:31.467894Z",
//             "estimated_price": 100.0,
//             "actual_price": null
//         }
//     ]
// }
function MainLayout() {
  const [opened, { toggle }] = useDisclosure();
  const [bookings, setBookings] = useState([]);
  const [userDetails, setUserDetails] = useState<{ name: string }>({
    name: "",
  });
  const [booking, setBooking] = useState({});
  const [openedModal, { toggle: toggleModal }] = useDisclosure(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await Axios().get("logistics/users/profile/");
      console.log(res.data);
      setBookings(res.data.bookings);
      setUserDetails(res.data.user_data);
    };

    fetchData();
  }, []);

  return (
    <>
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 200, md: 300, lg: 400 },
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl">Gullu Gullu</Text>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Text size="xl">
            👋 Hi {userDetails.name}, here are your bookings!
          </Text>
          {bookings.map((booking: any, index: any) => (
            <Group key={index} mt="sm" align="center">
              <Button
                onClick={() => {
                  setBooking(booking);
                  toggleModal();
                }}
                leftSection={
                  vehicleIcons[
                    booking.vehicle_type as keyof typeof vehicleIcons
                  ]
                }
                variant="outline"
                color="blue"
                size="sm"
              >
                <Text>
                  || {booking.pickup_location} {"--->"}{" "}
                  {booking.dropoff_location} || {booking.status} || ₹{" "}
                  {booking.estimated_price}
                </Text>
              </Button>
            </Group>
          ))}
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
      <BookingModal
        opened={openedModal}
        close={toggleModal}
        booking={booking}
      />
    </>
  );
}

function BookingModal({
  opened,
  close,
  booking,
}: {
  opened: boolean;
  close: () => void;
  booking: any;
}) {
  const [feedback, setFeedback] = useState<{ rating: number; comment: string }>(
    {
      rating: 1,
      comment: "",
    }
  );
  const [resFeedback, setResFeedback] = useState<any>(null);
  useEffect(() => {
    fetchData();
  }, [booking,opened]);

  const fetchData = async () => {
    if (booking.booking_id) {
      const res = await Axios().get(
        `logistics/bookings/${booking.booking_id}/feedback/get`
      );
      setResFeedback(res.data);
    }
  };
  const handleFeedback = async () => {
    await Axios().post(
      `logistics/bookings/${booking.booking_id}/feedback/`,

      feedback
    );
    fetchData();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        setFeedback({
          rating: 1,
          comment: "",
        });
        setResFeedback(null);
      }}
      title="Booking details"
      centered
    >
      <Text>Booking Modal Content</Text>
      <Text
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        Vehicle Type:
        {vehicleIcons[booking.vehicle_type as keyof typeof vehicleIcons]}({" "}
        {booking.vehicle_type} )
      </Text>
      <Text>Pickup Location: {booking.pickup_location}</Text>
      <Text>Dropoff Location: {booking.dropoff_location}</Text>
      <Text>Status: {booking.status}</Text>
      <Text>Estimated Price: ₹ {booking.estimated_price}</Text>
      {resFeedback && resFeedback.length ? (
        <>
          <Text>comment: - {resFeedback[0]?.comment}</Text>
          <Rating value={resFeedback[0]?.rating} readOnly />
        </>
      ) : (
        <>
          <TextInput
            mt="sm"
            value={feedback?.comment}
            onChange={(e) =>
              setFeedback({
                ...feedback,
                comment: e.target.value,
              })
            }
            placeholder="Feedback"
            label="Feedback"
          />
          <Rating
            value={feedback?.rating}
            onChange={(e) => {
              setFeedback({
                ...feedback,
                rating: e,
              });
            }}
          />
          <Button onClick={handleFeedback} mt="sm">
            Submit Feedback
          </Button>
        </>
      )}
    </Modal>
  );
}

export default MainLayout;
