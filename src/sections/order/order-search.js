import { Card, TextField, Button, Grid, OutlinedInput, SvgIcon } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { usePathname } from "next/navigation";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";

export const OrderSearch = ({ textSearch, setTextSearch }) => {
  // const [valueTo, setValueTo] = useState(null);
  // const [valueFrom, setValueFrom] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // const handleFromDateChange = (newValue) => {
  //   setValueFrom(newValue);
  //   if (newValue > valueTo) {
  //     setValueTo(newValue); // Update valueTo if the selected date is greater than the current valueTo
  //   }
  // };

  // const handleToDateChange = (newValue) => {
  //   setValueTo(newValue);
  //   if (newValue < valueFrom) {
  //     setValueFrom(newValue); // Update valueFrom if the selected date is smaller than the current valueFrom
  //   }
  // };

  // const formatDate = (date) => {
  //   if (!date) {
  //     return ""; // Return an empty string for null date values
  //   }
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  const item = {
    title: "Add",
    path: "/room-service",
    icon: (
      <SvgIcon fontSize="small">
        <PlusIcon />
      </SvgIcon>
    ),
  };
  const active = item.path ? pathname === item.path : false;

  const orderData = {};

  const createOrder = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }
      // Gửi yêu cầu POST đến server để đặt phòng
      const response = await axios.post("http://localhost:2003/api/order/save", orderData);
      router.push(`/room-service?id=${response.data.id}`);
      console.log("Tạo thành công:", response.data);
      console.log("Id:", response.data.id);
    } catch (error) {
      console.log("Lỗi khi đặt phòng:", error);
    }
  };

  return (
    <Card style={{ height : 160, marginTop: -50 }} sx={{ p: 2 }}>
      <Grid container my={2}>
        <OutlinedInput
          fullWidth
          value={textSearch}
          placeholder="Tìm kiếm theo hóa đơn hoặc khách hàng"
          sx={{ maxWidth: 500 }}
          onChange={(e) => {
            setTextSearch(e.target.value);
          }}
        />
        {/* <Grid item xs={12} ml={2} mr={2} sm={12} xl={2} lg={3}>
          <DatePicker
            label="Từ ngày"
            value={valueFrom}
            onChange={handleFromDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  value: formatDate(valueFrom), // Format the value here
                  readOnly: true, // Prevent manual input
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} xl={2} lg={3}>
          <DatePicker
            label="Đến ngày"
            value={valueTo}
            onChange={handleToDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  value: formatDate(valueTo), // Format the value here
                  readOnly: true, // Prevent manual input
                }}
              />
            )}
          />
        </Grid> */}
        {/* <Grid>
          <Button
            className="btn btn-primary"
            style={{
              height: 55,
              width: 170,
              marginLeft: 630,
              backgroundColor: "darkblue",
              color: "white",
            }}
            onClick={createOrder}
          >
            <SvgIcon fontSize="small">
              <PlusIcon />
            </SvgIcon>{" "}
            Tạo Hóa Đơn
          </Button>
        </Grid> */}
      </Grid>
    </Card>
  );
};
