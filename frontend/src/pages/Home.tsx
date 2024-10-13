import { Axios } from "@/api/axios";
import { Box, Button, Select, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";

import { useState } from "react";

const Home = () => {
  const [booking, setBooking] = useState<any>({
    pickup_location: "",
    dropoff_location: "",
    scheduled_time: "",
    vehicle_type: "",
  });

  const handleSubmit = async () => {
    Axios()
      .post("logistics/bookings/create/", booking)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          notifications.show({
            title: "Booking created",
            message: "Your booking has been created successfully",
            color: "blue",
          });
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          notifications.show({
            title: "Error",
            message: `${
              Object.keys(err?.response?.data as Record<string, string[]>)[0]
            } : ${Object.values(
              err?.response?.data as Record<string, string[]>
            )[0][0]}`,
            color: "red",
          });
        }
      });
  };

  return (
    <Box>
      <Box
        mt="md"
        display="flex"
        style={{
          flexDirection: "column",
          gap: 1,
          justifyContent: "center",
          border: "1px solid #000",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <DateTimePicker
          label="Pick date and time"
          placeholder="Pick date and time"
          valueFormat="YYYY-MM-DDThh:mm:ss"
          onChange={(value) =>
            setBooking({
              ...booking,
              scheduled_time: value,
            })
          }
        />
        <TextInput
          mt="sm"
          placeholder="pickup_location"
          label="Pickup Location"
          onChange={(e) =>
            setBooking({
              ...booking,
              pickup_location: e.target.value,
            })
          }
        />
        <TextInput
          mt="sm"
          placeholder="dropoff_location"
          label="Dropoff Location"
          onChange={(e) =>
            setBooking({
              ...booking,
              dropoff_location: e.target.value,
            })
          }
        />
        <Select
          mt="sm"
          data={[
            { label: "Bike", value: "BIKE" },
            { label: "Car", value: "CAR" },
            { label: "Van", value: "VAN" },
            { label: "Truck", value: "TRUCK" },
          ]}
          label="Vehicle Type"
          placeholder="Select vehicle type"
          onChange={(value) =>
            setBooking({
              ...booking,
              vehicle_type: value,
            })
          }
        />

        <Button mt="sm" onClick={handleSubmit}>
          Book
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
