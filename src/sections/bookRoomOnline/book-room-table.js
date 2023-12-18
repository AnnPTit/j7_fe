import PropTypes from "prop-types";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
  Button,
  Select,
  Checkbox,
  TextField,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import { SeverityPill } from "src/components/severity-pill";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Drawer } from "antd";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { parse, format, subYears, differenceInYears, differenceInHours, isToday } from "date-fns";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "bootstrap/dist/css/bootstrap.min.css";

const numeral = require("numeral");

export const BookRoomTable = (props) => {
  const { items = [], selected = [] } = props;
  const router = useRouter();
  const [order, setOrder] = useState({});
  const [orderDetail, setOrderDetail] = useState([]);
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState(true);
  const [citizenId, setCitizenId] = useState("");
  const [nation, setNation] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState(0);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [refuseReason, setRefuseReason] = React.useState("");
  const [isNewCustom, SetIsNewCustom] = React.useState(true);
  const [surcharge, setSurcharge] = useState(0);

  const [open, setOpen] = useState(false);
  const showDrawer = async (orderId) => {
    setOpen(true);
    try {
    } catch (error) {
      console.log(error);
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const responseOrder = await axios.get(
        `http://localhost:2003/api/order/detail-info/${orderId}`
      );
      setOrder(responseOrder.data);
      setGender(responseOrder.data.customer.gender);
      const formattedDate = formatDate(responseOrder.data.customer.birthday);
      setBirthday(formattedDate);
      setCitizenId(responseOrder.data.customer.citizenId);
      if (responseOrder.data.customer.citizenId) {
        SetIsNewCustom(false);
      }
      setName(responseOrder.data.customer.fullname);
      setEmail(responseOrder.data.customer.email);
      setPhone(responseOrder.data.customer.phoneNumber);
      setNation(responseOrder.data.customer.nationality);
      setAddress(responseOrder.data.customer.address);
      setOrderId(responseOrder.data.id);
      setCustomerId(responseOrder.data.customer.id);
      setOrderStatus(responseOrder.data.status);
      console.log(responseOrder.data);

      const responseOrderDetail = await axios.get(
        `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${orderId}`
      );
      console.log("OrderDetail: ", responseOrderDetail.data);
      setOrderDetail(responseOrderDetail.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(orderStatus);
  const onClose = () => {
    setOpen(false);
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A"; // Return a default value when price is not a valid number
    }

    return price.toLocaleString({ style: "currency", currency: "VND" }).replace(/\D00(?=\D*$)/, "");
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      // Handle the case when phoneNumber is null or undefined
      console.error("phoneNumber is null or undefined");
      return ""; // or return null or whatever makes sense in your case
    }

    const digits = phoneNumber.replace(/\D/g, "");
    const formattedNumber = digits.replace(/(\d{4})(\d{3})(\d{3})/, "$1-$2-$3");
    return formattedNumber;
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleOpenDetail = () => {
    setOpenDetail(true);
  };

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 0:
        return { color: "error", text: "Đã hủy" };
      case 1:
        return { color: "warning", text: "Chờ xác nhận" };
      case 2:
        return { color: "primary", text: "Đã nhận phòng" };
      case 3:
        return { color: "success", text: "Đã trả phòng" };
      case 4:
        return { color: "secondary", text: "Đã xác nhận" };
      case 5:
        return { color: "info", text: "Thanh toán tiền cọc" };
      case 6:
        return { color: "error", text: "Từ chối" };
      case 7:
        return { color: "error", text: "Hết hạn" };
      case 8:
        return { color: "error", text: "Hết hạn thanh toán tiền cọc" };
      case 9:
        return { color: "error", text: "Hêt hạn checkin" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  // Hủy hóa đơn
  const handleCancelOrder = async (id) => {
    try {
      console.log(id);
      setLoading(true);
      const response = await axios.post(
        `http://localhost:2003/api/home/order/cancel/${orderId}/6?refuseReason=${refuseReason}`
      );
      if (response.data.status === 1) {
        toast.success(response.data.message);
      }
      if (response.data.status === 0) {
        toast.error(response.data.message);
      }
      setLoading(false);
      window.location.href = `/book-room-online`;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBirthDayChange = (date) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    setBirthday(formattedDate);
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Đảm bảo hiển thị số 0 trước các ngày và tháng < 10
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  const handleSubmit = async () => {
    // tạo payload để gửi xuống
    console.log(gender);
    if (citizenId === null) {
      toast.error("Căn cước công dân không được để trống !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (birthday === null) {
      toast.error("Ngày sinh không được để trống !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    } else {
      const currentDate = new Date();
      const birthday2 = parse(birthday, "dd/MM/yyyy", new Date());
      const age = differenceInYears(currentDate, birthday2);
      if (age < 18) {
        toast.error("Bạn chưa đủ 18 tuổi !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
    }
    if (gender === null) {
      // toast.error("Giới tính không được để trống !", {
      //   position: toast.POSITION.TOP_RIGHT,
      // });
      // return;
      setGender(true);
    }
    if (address === null) {
      toast.error("Địa chỉ không được để trống !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (nation === null) {
      toast.error("Quốc tịch không được để trống !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const payload = {
      citizenId,
      birthday,
      gender,
      address,
      nation,
      orderId: orderId,
      customerId: customerId,
      isNewCustomer: isNewCustom,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await axios.post(`http://localhost:2003/api/order/confirm-order`, payload);
      if (response.data.message !== null) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.success("Xác nhận thành công !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        window.location.href = "/book-room-online";
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra !");
    }
  };

  const refuseOrder = async () => {};

  const handleRedirect = async () => {
    const { bookingDateStart } = order;
    console.log("Check-in: ", bookingDateStart);
    const currentDate = new Date();
    const checkinDateTime = new Date(bookingDateStart);
    console.log("Check-in Datetime: ", checkinDateTime);

    const shouldApplySurcharge =
      currentDate < checkinDateTime &&
      (differenceInHours(checkinDateTime, currentDate) <= 38 ||
        (isToday(checkinDateTime) && currentDate.getHours() < checkinDateTime.getHours()));

    const inTime =
      currentDate >= checkinDateTime && currentDate.getHours() >= checkinDateTime.getHours();

    if (shouldApplySurcharge) {
      const payload = {
        orderId: orderId,
        surcharge: surcharge,
      };

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.put(
          `http://localhost:2003/api/order/update-surcharge`,
          payload
        );
        router.push(`/booking?id=${orderId}`);
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra !");
      }
    } else if (inTime) {
      const payload = {
        orderId: orderId,
        surcharge: surcharge,
      };

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.put(
          `http://localhost:2003/api/order/update-surcharge`,
          payload
        );
        router.push(`/booking?id=${orderId}`);
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra !");
      }
    } else {
      toast.warning(
        "Vui lòng chờ đến đúng ngày check-in. Hoặc bạn có thể check-in sớm hơn 1 ngày nhưng sẽ tính thêm phụ thu!",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
      return;
    }
  };

  const handleRedirectDetail = async () => {
    router.push(`/booking?id=${orderId}`);
  };

  useEffect(() => {
    const calculateSurcharge = () => {
      const { bookingDateStart } = order;
      console.log("Check-in: ", bookingDateStart);
      const currentDate = new Date();
      const checkinDateTime = new Date(bookingDateStart);
      console.log("Check-in Datetime: ", checkinDateTime);

      const shouldApplySurcharge =
        currentDate < checkinDateTime &&
        (differenceInHours(checkinDateTime, currentDate) <= 24 ||
          (isToday(checkinDateTime) && currentDate.getHours() < checkinDateTime.getHours()));

      console.log("ABC: ", shouldApplySurcharge);

      if (shouldApplySurcharge) {
        const hoursDifference = differenceInHours(checkinDateTime, currentDate);
        const surchargeAmount = (hoursDifference + 1) * 10000;
        return surchargeAmount;
      }

      return 0;
    };

    setSurcharge(calculateSurcharge());
  }, [order, setSurcharge]);

  const renderButtonsBasedOnStatus = () => {
    switch (order.status) {
      case 1:
        return (
          <React.Fragment>
            <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="lg">
              <DialogContent>
                <TextField
                  style={{ marginTop: 10 }}
                  label="Lý do từ chối "
                  fullWidth
                  variant="outlined"
                  value={refuseReason}
                  onChange={(e) => setRefuseReason(e.target.value)}
                />
                <Button
                  style={{ marginTop: 40 }}
                  variant="outlined"
                  color="error"
                  // onClick={() => handleCancelOrder(orderId)}
                  onClick={() => {
                    handleCloseDetail();
                    Swal.fire({
                      title: "Bạn có chắc chắn muốn hủy ? ",
                      text: "",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "Hủy",
                      confirmButtonText: "Đúng, hủy!",
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        const isSubmitSuccess = await handleCancelOrder(orderId);
                        if (isSubmitSuccess) {
                          Swal.fire("Đã hủy phòng !", "success");
                          toast.success("Đã hủy phòng !");
                        }
                      }
                    });
                  }}
                >
                  Hủy xác nhận
                </Button>
                {loading && (
                  <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <TextField
                style={{ marginRight: 20 }}
                value={numeral(order.deposit).format("0,0 ") + "  đ"}
                label="Tiền cọc"
              />
              <Button
                style={{ marginRight: 20 }}
                variant="outlined"
                color="error"
                onClick={handleOpenDetail}
              >
                Hủy xác nhận
              </Button>
              <Button
                variant="outlined"
                //  onClick={handleSubmit}
                onClick={() => {
                  Swal.fire({
                    title: "Bạn có chắc chắn xác nhận ? ",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Hủy",
                    confirmButtonText: "Xác nhận",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      const isSubmitSuccess = await handleSubmit();
                      if (isSubmitSuccess) {
                        Swal.fire("Xác nhận thành công !", "success");
                        toast.success("Xác nhận thành công !");
                      }
                    }
                  });
                }}
              >
                Xác nhận
              </Button>
            </div>
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <TextField
                style={{ marginRight: 20 }}
                value={numeral(order.deposit).format("0,0 ") + "  đ"}
                label="Tiền cọc"
              />
              <Button variant="outlined" onClick={handleRedirectDetail}>
                Chi tiết
              </Button>
            </div>
          </React.Fragment>
        );
      case 3:
        return (
          <React.Fragment>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <TextField
                style={{ marginRight: 20 }}
                value={numeral(order.deposit).format("0,0 ") + "  đ"}
                label="Tiền cọc"
              />
              <Button variant="outlined" onClick={handleRedirectDetail}>
                Chi tiết
              </Button>
            </div>
          </React.Fragment>
        );
      case 4:
        return (
          <React.Fragment>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <TextField
                style={{ marginRight: 20 }}
                value={numeral(order.deposit).format("0,0 ") + "  đ"}
                label="Tiền cọc"
              />
              <Button variant="outlined" onClick={handleRedirectDetail}>
                Chi tiết
              </Button>
            </div>
          </React.Fragment>
        );
      case 5:
        return (
          <React.Fragment>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <TextField
                style={{ marginRight: 20 }}
                value={numeral(surcharge).format("0,0 ") + "  đ"}
                label="* Phụ thu : 10.000đ /h"
              />
              <TextField
                style={{ marginRight: 20 }}
                value={numeral(order.deposit).format("0,0 ") + "  đ"}
                label="Tiền cọc"
              />
              <Button variant="outlined" onClick={handleRedirect}>
                Tiến hành nhận phòng
              </Button>
            </div>
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  const isNewOrder = (order) => {
    const isNewStatus = order.status === 1;
    return isNewStatus;
  };

  return (
    <Card sx={{ marginTop: 5, marginBottom: 3 }}>
      <ToastContainer></ToastContainer>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">STT</TableCell>
                <TableCell>Mã hóa đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order, index) => {
                const created = moment(order.createAt).format("DD/MM/YYYY");
                const statusData = getStatusButtonColor(order.status);
                const statusText = statusData.text;
                const hrefUpdate = `/booking?id=${order.id}`;

                return (
                  <TableRow hover key={order.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.orderCode}
                      {isNewOrder(order) && (
                        <span
                          style={{
                            marginLeft: "10px",
                            background: "red",
                            color: "#fff",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          Mới
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{order.customer.fullname}</TableCell>
                    <TableCell>{formatPhoneNumber(order.customer.phoneNumber)}</TableCell>
                    <TableCell>{order.customer.email}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={statusData.color}>
                        {statusText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => showDrawer(order.id)}>
                        <InformationCircleIcon />
                      </Button>
                      <Drawer
                        style={{ marginTop: 65 }}
                        width="55%"
                        title="Thông tin đặt phòng"
                        placement="right"
                        onClose={onClose}
                        open={open}
                      >
                        <Scrollbar>
                          <div>
                            <span
                              style={{
                                marginRight: 50,
                              }}
                            >
                              <TextField
                                id="outlined-read-only-input"
                                label="Tên khách hàng"
                                value={name}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </span>
                            <span
                              style={{
                                marginRight: 50,
                              }}
                            >
                              <TextField
                                id="outlined-read-only-input"
                                label="CCCD"
                                value={citizenId}
                                onChange={(e) => setCitizenId(e.target.value)}
                              />
                            </span>
                            <TextField
                              id="outlined-read-only-input"
                              label="Quốc tịch"
                              value={nation}
                              onChange={(e) => setNation(e.target.value)}
                            />
                            <br />
                            <br />
                            <span
                              style={{
                                marginRight: 50,
                              }}
                            >
                              <TextField
                                id="outlined-read-only-input"
                                label="Số điện thoại"
                                value={phone}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </span>
                            <DatePicker
                              disableFuture
                              maxDate={subYears(new Date(), 18)}
                              openTo="year"
                              label="Ngày sinh"
                              value={birthday || ""}
                              onChange={handleBirthDayChange}
                              renderInput={(params) => (
                                <TextField
                                  style={{ width: 350, marginRight: 20 }}
                                  {...params}
                                  inputProps={{
                                    value: birthday || "",
                                    readOnly: true,
                                  }}
                                />
                              )}
                            />
                            <br />
                            <br />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <span
                                style={{
                                  marginRight: 50,
                                }}
                              >
                                <TextField
                                  id="outlined-read-only-input"
                                  label="Email"
                                  value={email}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              </span>

                              <span
                                style={{
                                  marginRight: 72,
                                }}
                              >
                                <FormControl
                                  style={{
                                    width: 200,
                                    display: "flex",
                                    justifyContent: "left",
                                  }}
                                >
                                  <FormLabel
                                    style={{ display: "flex", justifyContent: "left" }}
                                    id="demo-row-radio-buttons-group-label"
                                  >
                                    Giới tính
                                  </FormLabel>
                                  <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={gender === true ? true : false}
                                    onChange={(e) =>
                                      setGender(e.target.value === "true" ? true : false)
                                    }
                                  >
                                    <FormControlLabel
                                      value={"true"}
                                      control={<Radio />}
                                      label="Nam"
                                    />
                                    <FormControlLabel
                                      value={"false"}
                                      control={<Radio />}
                                      label="Nữ"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </span>
                              <span style={{}}>
                                <TextField
                                  id="outlined-read-only-input"
                                  label="Địa chỉ"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                />
                              </span>
                            </div>

                            <hr />
                            <Box>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    {/* <TableCell></TableCell> */}
                                    <TableCell></TableCell>
                                    <TableCell>Phòng</TableCell>
                                    <TableCell>Loại phòng</TableCell>
                                    <TableCell>Ngày check-in</TableCell>
                                    <TableCell>Ngày check-out</TableCell>
                                    <TableCell>Sức chứa</TableCell>
                                    <TableCell>Số khách</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {orderDetail.map((od, index) => {
                                    return (
                                      <TableRow key={index}>
                                        {/* <TableCell>
                                          <Checkbox />
                                        </TableCell> */}
                                        <TableCell>
                                          {od && od.roomImages && od.roomImages[0] && (
                                            <img
                                              style={{ objectFit: "cover", width: 150 }}
                                              src={od.roomImages[0]}
                                              // alt={`Room ${index + 1} Image 1`}
                                            />
                                          )}
                                        </TableCell>
                                        <TableCell>{od.room.roomName}</TableCell>
                                        <TableCell>{od.room.typeRoom.typeRoomName}</TableCell>
                                        <TableCell>
                                          {od &&
                                            od.checkIn &&
                                            format(new Date(od.checkIn), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell>
                                          {od &&
                                            od.checkOut &&
                                            format(new Date(od.checkOut), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell>{od.room.typeRoom.capacity}</TableCell>
                                        <TableCell>{od.customerQuantity}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </Box>
                            <br />
                            {renderButtonsBasedOnStatus()}
                            <br />
                            <br />
                            <br />
                            {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <TextField
                                style={{ marginRight: 20 }}
                                value={numeral(order.deposit).format("0,0 ") + "  đ"}
                                label="Tiền cọc"
                              />
                              {orderStatus === 5 ? (
                                <Button variant="outlined" onClick={handleRedirect}>
                                  Tiến hành nhận phòng
                                </Button>
                              ) : (
                                <p>Loading...</p>
                              )}
                              {orderStatus === 1 ? (
                                <Button variant="outlined" onClick={handleRedirect}>
                                  Xác nhận
                                </Button>
                              ) : (
                                <p>Loading...</p>
                              )}
                            </div> */}
                          </div>
                        </Scrollbar>
                      </Drawer>
                      {/* {order.status === 1 ? (
                        <>
                          <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </Link>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="btn btn-danger m-xl-2"
                          >
                            <SvgIcon fontSize="small">
                              <TrashIcon />
                            </SvgIcon>
                          </button>
                        </>
                      ) : null}
                      {order.status === 2 ? (
                        <>
                          <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </Link>
                        </>
                      ) : null}
                      {order.status === 3 ? (
                        <>
                          <Link className="btn btn-warning m-xl-2" href={hrefUpdate}>
                            <SvgIcon fontSize="small">
                              <EyeIcon />
                            </SvgIcon>
                          </Link>
                        </>
                      ) : null}
                      {order.status === 0 ? <></> : null} */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

BookRoomTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
