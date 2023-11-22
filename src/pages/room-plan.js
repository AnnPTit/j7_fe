import Head from "next/head";
import {
  Box,
  Container,
  Card,
  Grid,
  CardMedia,
  CardContent,
  Stack,
  Typography,
  SvgIcon,
} from "@mui/material";
import React from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { SeverityPill } from "src/components/severity-pill";
import { format } from "date-fns";
import { FaHotel, FaSignOutAlt } from "react-icons/fa";

function RoomPlan() {
  const [room, setRoom] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return { color: "warning", text: "Phòng đang sửa" };
      case 1:
        return { color: "success", text: "Phòng trống" };
      case 2:
        return { color: "error", text: "Đang có khách" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
         console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.get("http://localhost:2003/api/admin/room/room-plan");
        console.log("Data: ", response.data);
        setRoom(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <Container>
      <Head>
        <title>Sơ đồ phòng | Armani Hotel</title>
      </Head>
      {room.map((room, floorIndex) => (
        <Box key={floorIndex}>
          <Typography variant="h5" gutterBottom>
            Tầng {floorIndex + 1}
          </Typography>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              {room.map((room) => {
                const status = getStatusColor(room.status);
                const statusText = status.text;
                return (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={room.id}>
                    <Card>
                      <CardContent>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="h6" component="div">
                            <SeverityPill variant="contained" color={status.color}>
                              {statusText}
                            </SeverityPill>
                            <br />
                            <br />
                          </Typography>
                          <Typography variant="h6" component="div">
                            {room.roomName}
                            <br />
                            <br />
                            {room.typeRoom.typeRoomName}
                          </Typography>
                        </div>
                        <br />
                        {room && room.photoList && room.photoList.length > 0 ? (
                          <CardMedia
                            component="img"
                            alt="Main Room Image"
                            image={typeof room.photoList[0] === "string" ? room.photoList[0] : ""}
                            style={{
                              height: 200,
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                        ) : (
                          <Typography>No Image Available</Typography>
                        )}
                        <hr />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          {room.status === 2 ? (
                            <>
                              {room.orderDetailList.map((orderDetail, index) =>
                                orderDetail.status === 1 || orderDetail.status === 2 ? (
                                  <React.Fragment key={index}>
                                    <Typography>
                                      <SvgIcon fontSize="small">
                                        <FaHotel />
                                      </SvgIcon>{" "}
                                      {format(
                                        new Date(orderDetail.checkInDatetime),
                                        "dd/MM/yyyy HH:mm"
                                      )}
                                      <Typography
                                        variant="h6"
                                        style={{ color: "red", marginTop: 10 }}
                                      >
                                        {formatPrice(orderDetail.roomPrice)}
                                      </Typography>
                                    </Typography>
                                  </React.Fragment>
                                ) : null
                              )}
                            </>
                          ) : null}
                          {room.status === 2 ? (
                            <>
                              {room.orderDetailList.map((orderDetail, index) =>
                                orderDetail.status === 2 ? (
                                  <Typography key={index}>
                                    <SvgIcon fontSize="small">
                                      <FaSignOutAlt />
                                    </SvgIcon>{" "}
                                    {format(
                                      new Date(orderDetail.checkOutDatetime),
                                      "dd/MM/yyyy HH:mm"
                                    )}
                                    <Typography variant="h6" style={{ marginTop: 10 }}>
                                      {orderDetail.order.customer.fullname}
                                    </Typography>
                                  </Typography>
                                ) : null
                              )}
                            </>
                          ) : null}
                        </div>
                        {/* <div style={{ display: "flex", justifyContent: "center" }}></div> */}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
          <hr />
        </Box>
      ))}
    </Container>
  );
}

RoomPlan.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default RoomPlan;
