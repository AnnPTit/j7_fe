import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import { FaBug, FaRegCalendarCheck, FaRegFileAlt, FaTimesCircle } from "react-icons/fa";
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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { TextareaAutosize } from "@mui/material";
import { format } from "date-fns";

function OrderTimeline() {
  const currentDate = new Date().toLocaleString();
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query;
  const [customer, setCustomer] = useState();
  const [bookRoom, setBookRoom] = useState();
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
        return { color: "secondary", text: "Đã xác nhận" };
      case 3:
        return { color: "success", text: "Completed" };
      case 4:
        return { color: "warning", text: "Pending" };
      case 5:
        return { color: "info", text: "Processing" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  const [hideCancelButton, setHideCancelButton] = useState(false);
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
        // setBookRoom(responseBookRoom.data);
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
                  eventTitle = "Xác nhận hóa đơn";
                  break;
                case 3:
                  eventColor = "#007BFF";
                  // eventIcon = /* Your icon for type 3 */;
                  // eventTitle = /* Your title for type 3 */;
                  break;
                // Add more cases for other types if needed
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

            // // Update the timelineEvents state with the new events
            // timelineEventsData.sort((a, b) => a.type - b.type);
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
          `http://localhost:2003/api/order-detail/loadByOrderId/${id}`
        );
        console.log("OrderDetail", responseOrderDetail.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  // useEffect(() => {
  //   // Định nghĩa hàm fetchData bên trong useEffect
  //   async function fetchData() {
  //     try {
  //       const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
  //       // Kiểm tra xem accessToken có tồn tại không
  //       if (!accessToken) {
  //         alert("Bạn chưa đăng nhập");
  //         return;
  //       }
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
  //       const response = await axios.get(`http://localhost:2003/api/admin/order/detail/${id}`);
  //       console.log("Order", response.data);

  //       if (response.data) {
  //         setOrder(response.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   // Gọi hàm fetchData ngay lập tức
  //   fetchData();
  // }, []);

  const renderIconForEventType = (eventType) => {
    switch (eventType) {
      case 0:
        return <FaTimesCircle style={{ fontSize: "50px", color: "#ff0000" }} />;
      case 1:
        return <FaRegFileAlt style={{ fontSize: "50px", color: "#00CC66" }} />;
      case 2:
        return <FaRegCalendarCheck style={{ fontSize: "50px", color: "#00CC66" }} />;
      case 3:
        // Return the icon for type 3 (if available)
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
        return "Xác nhận hóa đơn";
      case 3:
        return "Your title for type 3";
      // Add more cases for other types if needed
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

  const [note, setNote] = useState(""); // Uncomment this line to manage the note state

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleConfirmOrder = async () => {
    try {
      const updatedOrder = { ...order, status: 2 }; // Update the status to 2 (Đã xác nhận)
      const confirmationEvent = {
        color: "#00CC66",
        icon: FaRegCalendarCheck,
        title: "Xác nhận đơn hàng",
        subtitle: new Date().toLocaleString(),
      };
      // Make an API call to update the order status to "Đã xác nhận" (status: 2) or your desired status
      // You can use the axios.put() method for this
      await axios.post(`http://localhost:2003/api/order-timeline/update-status-2/${id}`, {
        updatedOrder,
        note: note,
      });

      setOrder(updatedOrder); // Update the local state with the new order status
      setTimelineEvents((prevEvents) => [...prevEvents, confirmationEvent]);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const updatedOrder = { ...order, status: 0 }; // Update the status to 2 (Đã xác nhận)
      const confirmationEvent = {
        color: "#ff0000",
        icon: FaTimesCircle,
        title: "Hủy hóa đơn",
        subtitle: new Date().toLocaleString(),
      };
      // Make an API call to update the order status to "Đã xác nhận" (status: 2) or your desired status
      // You can use the axios.put() method for this
      await axios.post(`http://localhost:2003/api/order-timeline/update-status-0/${id}`, {
        updatedOrder,
        note: note,
      });

      setOrder(updatedOrder); // Update the local state with the new order status
      setTimelineEvents((prevEvents) => [...prevEvents, confirmationEvent]);
      handleCloseCancel();
      setHideCancelButton(true);
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

  const [open, setOpen] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPayment, setOpenPayment] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenPayment = () => {
    setOpenPayment(true);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleOpenCancel = () => {
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
  };

  const renderButtonsBasedOnStatus = () => {
    switch (order.status) {
      case 1:
        return (
          <React.Fragment>
            <button
              onClick={handleOpen}
              style={{ height: 50, width: 120 }}
              className="btn btn-primary m-xl-2"
            >
              Xác nhận
            </button>
            {!hideCancelButton && (
              <button
                onClick={handleOpenCancel}
                style={{ height: 50, width: 120 }}
                className="btn btn-danger m-xl-2"
              >
                Hủy đơn
              </button>
            )}
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            {!hideCancelButton && (
              <button
                onClick={handleOpenCancel}
                style={{ height: 50, width: 120 }}
                className="btn btn-danger m-xl-2"
              >
                Hủy đơn
              </button>
            )}
          </React.Fragment>
        );
      // Add more cases for other statuses if needed
      default:
        return null; // Return null to hide all buttons if the status doesn't match any case
    }
  };

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
        <Dialog open={open} onClose={handleClose} maxWidth="md">
          <DialogTitle>Xác nhận hóa đơn</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <TextareaAutosize
                className="form-control"
                placeholder="Ghi chú"
                name="note"
                cols={100}
                style={{ height: 150 }}
                variant="outlined"
                value={note}
                onChange={handleNoteChange}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmOrder}>Xác nhận</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openCancel} onClose={handleCloseCancel} maxWidth="md">
          <DialogTitle>Hủy hóa đơn</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <TextareaAutosize
                className="form-control"
                placeholder="Ghi chú"
                name="note"
                cols={100}
                style={{ height: 150 }}
                variant="outlined"
                value={note}
                onChange={handleNoteChange}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelOrder}>Xác nhận</Button>
          </DialogActions>
        </Dialog>
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {renderButtonsBasedOnStatus()}
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
        <div style={{ display: "flex" }}>
          <h3 style={{ marginRight: 700 }}>THÔNG TIN HÓA ĐƠN</h3>
          <button style={{ width: 130 }} className="btn btn-outline-primary">
            Cập nhật
          </button>
        </div>
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
              {order.typeOfOrder == 1 ? "Online" : "Tại quầy"}
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
        <div style={{ display: "flex" }}>
          <h3 style={{ marginRight: 650 }}>LỊCH SỬ GIAO DỊCH</h3>
          <button
            onClick={handleOpenPayment}
            style={{ width: 207 }}
            className="btn btn-outline-primary"
          >
            Xác nhận thanh toán
          </button>
        </div>
        <Dialog open={openPayment} onClose={handleClosePayment} maxWidth="md">
          <DialogTitle>XÁC NHẬN THANH TOÁN</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <br />
              <TextField label="Số tiền" type="text" fullWidth variant="outlined" />
              <br />
              <br />
              <TextareaAutosize
                className="form-control"
                placeholder="Ghi chú"
                name="note"
                cols={100}
                style={{ height: 150 }}
                variant="outlined"
              />
            </DialogContentText>
            {/* <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        /> */}
          </DialogContent>
          <DialogActions>
            <button className="btn btn-outline-primary">TIỀN MẶT</button>
            <button className="btn btn-outline-danger">CHUYỂN KHOẢN</button>
          </DialogActions>
          <br />

        </Dialog>
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
        <div style={{ display: "flex" }}>
          <h3>THÔNG TIN PHÒNG</h3>
        </div>
        <hr />
        <div style={{ display: "flex", justifyContent: "center" }}>Không có dữ liệu.</div>
      </Card>
    </div>
  );
}

OrderTimeline.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default OrderTimeline;
