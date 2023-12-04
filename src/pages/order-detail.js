import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import {
  FaBug,
  FaRegFileAlt,
  FaTimesCircle,
  FaHome,
  FaSignInAlt,
  FaCheck,
  FaWallet,
  FaShareSquare,
} from "react-icons/fa";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardMedia,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { format } from "date-fns";
import { SeverityPill } from "src/components/severity-pill";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "./update/pdf-document";
import Head from "next/head";

// Thêm state để theo dõi khi nút "In hóa đơn" được nhấp

function OrderTimeline() {
  const currentDate = new Date().toLocaleString();
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query;
  const [customer, setCustomer] = useState();
  const [room, setRoom] = useState();
  const [account, setAccount] = useState();
  const [service, setService] = useState();
  const [order, setOrder] = useState({
    id: "",
    typeOfOrder: "",
    orderCode: "",
    status: "",
    customer: {},
    bookRoom: {},
  });
  const [orderDetail, setOrderDetail] = useState({
    id: "",
  });
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [serviceUsed, setServiceUsed] = useState([]);
  const [selectedOrderTimelines, setSelectedOrderTimelines] = useState([]);
  const [loading, setLoading] = useState(false);

  let totalServiceCost = 0;
  let totalComboCost = 0;
  const [openDetail, setOpenDetail] = React.useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handlePrintInvoice = (id) => {
    setLoading(true);
    axios
      .get(`http://localhost:2003/api/order/recommended/${id}`, { responseType: "arraybuffer" })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/msword" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.docx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Lỗi khi tải tệp .docx", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getPaymentMethodColor = (method) => {
    if (method === true) {
      return { color: "primary", text: "Tiền mặt" };
    } else if (method === false) {
      return { color: "warning", text: "Chuyển khoản" };
    } else {
      return { color: "default", text: "Unknown" };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 0:
        return { color: "error", text: "Thất bại" };
      case 1:
        return { color: "success", text: "Thành công" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

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
         console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const responseCustomer = await axios.get("http://localhost:2003/api/admin/customer/getAll");
        const responseService = await axios.get("http://localhost:2003/api/admin/service/getAll");
        const responseRoom = await axios.get("http://localhost:2003/api/admin/room/getList");
        const responseAccount = await axios.get("http://localhost:2003/api/admin/account/getAll");
        setCustomer(responseCustomer.data);
        setService(responseService.data);
        setRoom(responseRoom.data);
        setAccount(responseAccount.data);
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
         console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get(`http://localhost:2003/api/order/detail/${id}`);
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
                  eventIcon = FaHome;
                  eventTitle = "Khách hàng nhận phòng";
                  break;
                case 3:
                  eventColor = "#00CC66";
                  eventIcon = FaShareSquare;
                  eventTitle = "Khách hàng trả phòng";
                  break;
                case 4:
                  eventColor = "#6959CD";
                  eventIcon = FaCheck;
                  eventTitle = "Xác nhận thông tin khách";
                  break;
                case 5:
                  eventColor = "#00CCCC";
                  eventIcon = FaWallet;
                  eventTitle = "Khách hàng thanh toán tiền cọc";
                  break;
                case 7:
                  eventColor = "#FFD700";
                  eventIcon = FaSignInAlt;
                  eventTitle = "Trả phòng đi trước";
                  break;
                default:
                  eventColor = "default";
                  eventIcon = FaBug;
                  eventTitle = "Unknown Type";
                  break;
              }
              const formattedDate = format(new Date(event.createAt), "dd/MM/yyyy HH:mm:ss");
              return {
                color: eventColor,
                icon: eventIcon,
                title: eventTitle,
                subtitle: formattedDate,
                type: event.type,
              };
            });
            setTimelineEvents(timelineEventsData);
          } else {
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

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
  //       // Kiểm tra xem accessToken có tồn tại không
  //       if (!accessToken) {
  //        console.log("Bạn chưa đăng nhập");
  //         return;
  //       }
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
  //       const responseOrderDetail = await axios.get(
  //         `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${id}`
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchData();
  // }, [id]);

  const renderIconForEventType = (eventType) => {
    switch (eventType) {
      case 0:
        return <FaTimesCircle style={{ fontSize: "50px", color: "#ff0000" }} />;
      case 1:
        return <FaRegFileAlt style={{ fontSize: "50px", color: "#00CC66" }} />;
      case 2:
        return <FaHome style={{ fontSize: "50px", color: "#00CC66" }} />;
      case 3:
        return <FaShareSquare style={{ fontSize: "50px", color: "#00CC66" }} />;
      case 4:
        return <FaCheck style={{ fontSize: "50px", color: "#6959CD" }} />;
      case 5:
        return <FaWallet style={{ fontSize: "50px", color: "#00CCCC" }} />;
      case 7:
        return <FaSignInAlt style={{ fontSize: "50px", color: "#FFD700" }} />;
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
      case 4:
        return "Xác nhận thông tin khách hàng";
      case 5:
        return "Khách hàng thanh toán tiền cọc";
      case 7:
        return "Trả phòng đi trước";
      default:
        return "Unknown Type";
    }
  };

  const handleShowOrderTimeline = async () => {
    // Fetch order timeline data for the selected order (using the 'id' from router.query)
    try {
      const responseOrderTimeline = await axios.get(
        `http://localhost:2003/api/order-timeline/loadByOrderId/${id}`
      );

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

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
         console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.get(
          `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${id}`
        );
        console.log("OrderDetail: ", response.data);
        setOrderDetailData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
         console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.get(`http://localhost:2003/api/payment-method/load/${id}`);
        console.log("PaymentMethod: ", response.data);
        setPaymentMethod(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchServiceUsed() {
      try {
        if (orderDetail && orderDetail.id) {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
           console.log("Bạn chưa đăng nhập");
            return;
          }

          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          const response = await axios.get(
            `http://localhost:2003/api/service-used/load/${orderDetail.id}`
          );
          console.log("ServiceUsed: ", response.data);
          setServiceUsed(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchServiceUsed();
  }, [orderDetail]);

  const hrefReturnRoom = `/booking?id=${id}`;

  return (
    <div
      style={{
        justifyContent: "center",
        marginTop: 30,
        width: "100%",
      }}
    >
      <Head>
        <title>Timeline | Armani Hotel</title>
      </Head>
      <Box
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: 1150,
          marginLeft: 140,
        }}
      >
        <Timeline minEvents={timelineEvents.length} placeholder>
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
          {loading && (
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {order.status === 2 && (
              <Link href={hrefReturnRoom}>
                <Button style={{ height: 50, width: 130 }} variant="outlined" color="error">
                  Trả phòng
                </Button>
              </Link>
            )}
            {order.status === 3 && (
              <Button
                variant="outlined"
                onClick={() => handlePrintInvoice(order.id)}
                style={{ height: 50, width: 130 }}
                color="warning"
              >
                In hóa đơn
              </Button>
            )}
            {isPrinting && (
              <PDFDownloadLink
                document={<PDFDocument order={order} orderDetailData={orderDetailData} />}
                fileName="invoice.pdf"
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Loading document..." : "Download now!"
                }
              </PDFDownloadLink>
            )}
            <Button
              variant="outlined"
              onClick={handleShowOrderTimeline}
              style={{ height: 50, width: 130, marginLeft: 20 }}
              color="info"
            >
              Chi tiết
            </Button>
          </div>
        </div>
        <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md">
          <DialogContent>
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
                      <Box>{renderIconForEventType(event.type)}</Box>
                    </TableCell>
                    <TableCell>{renderTitleForEventType(event.type)}</TableCell>
                    <TableCell>{format(new Date(event.createAt), "dd-MM-yyyy hh:mm:ss")}</TableCell>
                    <TableCell>{event.account.fullname}</TableCell>
                    <TableCell>{event.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </Box>
      <Box
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
            <label>Loại hóa đơn</label>
            <SeverityPill style={{ marginLeft: 125 }}>
              {order.typeOfOrder == 0 ? "Online" : "Tại quầy"}
            </SeverityPill>
            <br />
            <br />
            <label>Mã hóa đơn</label>
            <label style={{ marginLeft: 135 }}>{order.orderCode}</label>
            <br />
            <br />
            <label>Tổng tiền + (VAT)</label>
            <span style={{ marginLeft: 93, color: "red" }}>
              {order.totalMoney ? formatPrice(order.totalMoney) : "0 VND"}
            </span>
            <br />
            <br />
            <label>Tiền cọc</label>
            <span style={{ marginLeft: 160, color: "red" }}>
              {order.deposit ? formatPrice(order.deposit) : "0 VND"}
            </span>
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
      </Box>
      <Box
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: 30,
          width: 1150,
          marginLeft: 140, // Add the box shadow
        }}
      >
        <h3 style={{ marginRight: 650 }}>LỊCH SỬ THANH TOÁN</h3>
        <hr />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Số tiền</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Hình thức</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell>Người xác nhận</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentMethod.map((paymentMethod) => {
              const methodPayment = getPaymentMethodColor(paymentMethod.method);
              const methodPaymentText = methodPayment.text;
              const statusPayment = getPaymentStatusColor(paymentMethod.status);
              const statusPaymentText = statusPayment.text;

              return (
                <TableRow hover key={paymentMethod.id}>
                  <TableCell>
                      <SeverityPill color="error">{formatPrice(paymentMethod.totalMoney)}</SeverityPill>
                    </TableCell>
                  <TableCell>
                    {format(new Date(paymentMethod.createAt), "dd/MM/yyyy - HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <SeverityPill variant="contained" color={methodPayment.color}>
                      {methodPaymentText}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>
                    <SeverityPill variant="contained" color={statusPayment.color}>
                      {statusPaymentText}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>{paymentMethod.note}</TableCell>
                  <TableCell>{paymentMethod.order.account.fullname}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Box
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
          <div style={{ display: "flex" }}>
            <h3>THÔNG TIN PHÒNG</h3>
          </div>
          <hr />

          {orderDetailData.map((orderDetail, index) => (
            <Box key={index}>
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
                  <span style={{ color: "red" }}>{formatPrice(orderDetail.roomPrice)}</span>
                  <br />
                  <br />
                </div>
                <div style={{ margin: 30, marginLeft: 60 }}>
                  <h4>Dịch vụ</h4>
                  <br />
                  <ul>
                    {orderDetail.serviceUsedList.map((serviceUsed, serviceIndex) => {
                      totalServiceCost += serviceUsed.service.price * serviceUsed.quantity;
                      return (
                        <li key={serviceIndex}>
                          {serviceUsed.service.serviceName} x{serviceUsed.quantity} -{" "}
                          <span style={{ color: "red" }}>
                            {formatPrice(serviceUsed.service.price * serviceUsed.quantity)}
                          </span>
                          <br />
                          <br />
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {orderDetail.comboUsedList.map((comboUsed, comboIndex) => {
                      totalComboCost += comboUsed.combo.price * comboUsed.quantity;
                      return (
                        <li key={comboIndex}>
                          {comboUsed.combo.comboName} x{comboUsed.quantity} -{" "}
                          <span style={{ color: "red" }}>
                            {formatPrice(comboUsed.combo.price * comboUsed.quantity)}
                          </span>
                          <br />
                          <br />
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div style={{ margin: 30, marginLeft: 60 }}>
                  <h4>Khách hàng</h4>
                  <br />
                  <ul>
                    {orderDetail.informationCustomerList.map(
                      (infomationCustomer, infomationCustomerIndex) => {
                        return (
                          <li key={infomationCustomerIndex}>
                            {infomationCustomer.fullname}
                            <br />
                            <br />
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
                <div style={{ marginLeft: 850 }}>
                  <h6>Check in: {format(new Date(orderDetail.checkIn), "dd/MM/yyyy - HH:mm")}</h6>
                  <br />
                  <h6>Check out: {format(new Date(orderDetail.checkOut), "dd/MM/yyyy - HH:mm")}</h6>
                </div>
              </Grid>
              <hr />
            </Box>
          ))}
        </div>
      </Box>
    </div>
  );
}

OrderTimeline.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default OrderTimeline;