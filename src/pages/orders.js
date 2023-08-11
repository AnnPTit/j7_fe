import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import { FaBug, FaRegCalendarCheck, FaRegFileAlt, FaTimesCircle, FaHome } from "react-icons/fa";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import React, { Component } from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
  TextField,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { format } from "date-fns";

function OrderTimeline() {
  const currentDate = new Date().toLocaleString();
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query;
  const [customer, setCustomer] = useState();
  const [room, setRoom] = useState();
  const [account, setAccount] = useState();
  const [order, setOrder] = useState({
    id: "",
    typeOfOrder: "",
    orderCode: "",
    status: "",
    customer: {},
    bookRoom: {},
  });
  // const [orderTimeline, setOrderTimeline] = useState({
  //   id: "",
  //   type: "",
  //   note: "",
  //   createAt: "",
  //   order: {},
  //   account: {},
  // });

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 0:
        return { color: "danger", text: "Đã hủy" };
      case 1:
        return { color: "primary", text: "Chờ xác nhận" };
      case 2:
        return { color: "secondary", text: "Đã nhận phòng" };
      case 3:
        return { color: "success", text: "Khách hàng trả phòng" };
      case 4:
        return { color: "warning", text: "Pending" };
      case 5:
        return { color: "info", text: "Processing" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  const formatRoomPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const statusData = getStatusButtonColor(order.status);
  const statusText = statusData.text;

  const [timelineEvents, setTimelineEvents] = useState([
    {
      color: "#00CC66",
      icon: FaRegFileAlt,
      title: "Tạo hóa đơn",
      subtitle: currentDate,
    },
  ]);

  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const responseCustomer = await axios.get("http://localhost:2003/api/customers/getList");
        // const responseBookRoom = await axios.get("http://localhost:2003/api/book-room/getList");
        const responseRoom = await axios.get("http://localhost:2003/api/admin/room/getList");
        const responseAccount = await axios.get("http://localhost:2003/api/admin/account/getAll");
        setAccount(responseAccount.data);
        setCustomer(responseCustomer.data);
        setRoom(responseRoom.data);
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get(`http://localhost:2003/api/admin/order/detail/${id}`);
        const responseOrderTimeline = await axios.get(
          `http://localhost:2003/api/order-timeline/loadByOrderId/${id}`
        );

        console.log("Order", response.data);
        console.log("OrderTimeline", responseOrderTimeline.data);

        if (response.data) {
          setOrder(response.data);
          // Create a new timeline event for "Tạo hóa đơn"
          if (responseOrderTimeline.data && responseOrderTimeline.data.length > 0) {
            // Map through the order timeline data and create corresponding timeline events
            const timelineEventsData = responseOrderTimeline.data.map((event) => {
              let eventColor, eventIcon, eventTitle;
              switch (event.type) {
                case 0:
                  eventColor = "#ff0000";
                  eventIcon = FaTimesCircle;
                  eventTitle = "Hủy hóa đơn";
                  break;
                case 1:
                  eventColor = "#00CC66";
                  eventIcon = FaRegFileAlt;
                  eventTitle = "Tạo hóa đơn";
                  break;
                case 2:
                  eventColor = "#00CC66";
                  eventIcon = FaRegCalendarCheck;
                  eventTitle = "Khách hàng đã nhận phòng";
                  break;
                case 3:
                  eventColor = "#00CC66";
                  eventIcon = FaHome;
                  eventTitle = "Khách hàng trả phòng";
                  break;
                default:
                  eventColor = "default";
                  eventIcon = FaBug;
                  eventTitle = "Unknown Type";
                  break;
              }
              const formattedDate = format(new Date(event.createAt), "dd-MM-yyyy hh:mm:ss");
              return {
                color: eventColor,
                icon: eventIcon,
                title: eventTitle,
                subtitle: formattedDate,
                type: event.type,
              };
            });
            // Update the timelineEvents state with the new events
            setTimelineEvents(timelineEventsData);
          } else {
            // If there are no order timeline events, set a default event
            setTimelineEvents([
              {
                color: "default",
                icon: FaBug,
                title: "Unknown Type",
                subtitle: "Unknown Date",
              },
            ]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const responseOrderDetail = await axios.get(
          `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${id}`
        );
        console.log("OrderDetail", responseOrderDetail.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  const renderIconForEventType = (eventType) => {
    switch (eventType) {
      case 0:
        return <FaTimesCircle style={{ fontSize: "50px", color: "#ff0000" }} />;
      case 1:
        return <FaRegFileAlt style={{ fontSize: "50px", color: "#00CC66" }} />;
      case 2:
        return <FaRegCalendarCheck style={{ fontSize: "50px", color: "#00CC66" }} />;
      case 3:
        return <FaHome style={{ fontSize: "50px", color: "#00CC66" }} />;
        break;
      // Add more cases for other types if needed
      default:
        return <FaBug style={{ fontSize: "50px", color: "default" }} />;
    }
  };

  const renderTitleForEventType = (eventType) => {
    switch (eventType) {
      case 0:
        return "Hủy hóa đơn";
      case 1:
        return "Tạo hóa đơn";
      case 2:
        return "Khách hàng đã nhận phòng";
      case 3:
        return "Khách hàng trả phòng";
      default:
        return "Unknown Type";
    }
  };

  const [selectedOrderTimelines, setSelectedOrderTimelines] = useState([]);

  const handleShowOrderTimeline = async () => {
    // Fetch order timeline data for the selected order (using the 'id' from router.query)
    try {
      const responseOrderTimeline = await axios.get(
        `http://localhost:2003/api/order-timeline/loadByOrderId/${id}`
      );

      console.log("OrderTimeline", responseOrderTimeline.data);

      if (responseOrderTimeline.data && responseOrderTimeline.data.length > 0) {
        // Set the orderTimeline data and show the list
        setSelectedOrderTimelines(responseOrderTimeline.data);
        setOpenDetail(true);
      } else {
        // If there are no order timeline events, set the state to hide the list
        setSelectedOrderTimelines([]);
        setOpenDetail(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Save timelineEvents to local storage whenever it changes
    localStorage.setItem("timelineEvents", JSON.stringify(timelineEvents));
  }, [timelineEvents]);

  useEffect(() => {
    // Load timelineEvents from local storage on initial render
    const savedTimelineEvents = JSON.parse(localStorage.getItem("timelineEvents"));
    if (savedTimelineEvents && savedTimelineEvents.length > 0) {
      setTimelineEvents(savedTimelineEvents);
    }
  }, []);

  const [openDetail, setOpenDetail] = React.useState(false);

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const [orderDetailData, setOrderDetailData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.get(
          `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${id}`
        );
        // console.log("photoList", response.data.room?.photoList?.url);
        console.log("OrderDetail: ", response.data);
        setOrderDetailData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  return (
    <div
      style={{
        justifyContent: "center",
        marginTop: 30,
        width: "100%", // Center the timeline container horizontally
      }}
    >
      <Card
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: 1150,
          marginLeft: 140, // Add the box shadow
        }}
      >
        <Timeline minEvents={5} placeholder>
          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={index}
              color={event.color}
              icon={event.icon}
              title={event.title}
              subtitle={event.subtitle}
            />
          ))}
        </Timeline>
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleShowOrderTimeline}
              style={{ height: 50, width: 130 }}
              className="btn btn-dark m-xl-2"
            >
              Chi tiết
            </button>
          </div>

          <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md">
            <DialogContent>
              <DialogContentText>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Người xác nhận</TableCell>
                      <TableCell>Ghi chú</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrderTimelines.map((event, index) => (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Box component="span">{renderIconForEventType(event.type)}</Box>
                        </TableCell>
                        <TableCell>{renderTitleForEventType(event.type)}</TableCell>
                        <TableCell>
                          {format(new Date(event.createAt), "dd-MM-yyyy hh:mm:ss")}
                        </TableCell>
                        <TableCell>{event.account.fullname}</TableCell>
                        <TableCell>{event.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
      <Card
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: 30,
          width: 1150,
          marginLeft: 140, // Add the box shadow
        }}
      >
        <h3 style={{ marginRight: 700 }}>THÔNG TIN HÓA ĐƠN</h3>
        <hr />
        <div style={{ display: "flex" }}>
          <div style={{ marginLeft: 30, fontFamily: "inherit", fontSize: "17px" }}>
            <label id="label">Trạng thái</label>
            <span
              className="badge badge-pill badge-warning"
              style={{ backgroundColor: "black", marginLeft: 150 }}
            >
              {statusText}
            </span>
            <br />
            <br />
            <label>Loại</label>
            <label style={{ marginLeft: 193 }}>
              {order.typeOfOrder == 0 ? "Online" : "Tại quầy"}
            </label>
            <br />
            <br />
            <label>Mã hóa đơn</label>
            <label style={{ marginLeft: 135 }}>{order.orderCode}</label>
            <br />
            <br />
          </div>
          <div style={{ marginLeft: 150, fontFamily: "inherit", fontSize: "17px" }}>
            <label>Họ và tên</label>
            <label style={{ marginLeft: 150 }}>{order.customer.fullname}</label>
            <br />
            <br />
            <label>Số điện thoại</label>
            <label style={{ marginLeft: 120 }}>{order.customer.phoneNumber}</label>
            <br />
            <br />
            <label>Email</label>
            <label style={{ marginLeft: 180 }}>{order.customer.email}</label>
            <br />
            <br />
          </div>
        </div>
      </Card>
      <Card
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: 30,
          width: 1150,
          marginLeft: 140, // Add the box shadow
        }}
      >
        <h3 style={{ marginRight: 650 }}>LỊCH SỬ GIAO DỊCH</h3>
        <hr />
        <div style={{ display: "flex", justifyContent: "center" }}>Không có dữ liệu.</div>
      </Card>
      <Card
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: 30,
          width: 1150,
          marginLeft: 140, // Add the box shadow
        }}
      >
        <div>
          {orderDetailData.map((orderDetail, index) => (
            <Card key={index}>
              <div style={{ display: "flex" }}>
                <h3>THÔNG TIN PHÒNG</h3>
              </div>
              <hr />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  {/* Render the main room image */}
                  {orderDetail.room &&
                  orderDetail.room.photoList &&
                  orderDetail.room.photoList.length > 0 ? (
                    <CardMedia
                      component="img"
                      alt="Main Room Image"
                      image={
                        typeof orderDetail.room.photoList[0].url === "string"
                          ? orderDetail.room.photoList[0].url
                          : ""
                      }
                      // Assuming the first image is the main room image
                      style={{ height: 200, objectFit: "cover", width: "100%" }}
                    />
                  ) : (
                    <Typography>No Image Available</Typography>
                  )}
                </Grid>
                <div style={{ margin: 30 }}>
                  <h4>{orderDetail.room.roomName}</h4>
                  <br />
                  <span>Loại phòng: {orderDetail.room.typeRoom.typeRoomName}</span>
                  <br />
                  <br />
                  <span>{orderDetail.room.floor.floorName}</span>
                  <br />
                  <br />
                  <span style={{ color: "red" }}>{formatRoomPrice(orderDetail.roomPrice)}</span>
                </div>
              </Grid>
              <hr />
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

OrderTimeline.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default OrderTimeline;
