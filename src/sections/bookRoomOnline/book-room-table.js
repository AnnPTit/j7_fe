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
import { parse, format, subYears, differenceInYears } from "date-fns";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
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
        alert("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const responseOrder = await axios.get(
        `http://localhost:2003/api/order/detail-info/${orderId}`
      );
      setOrder(responseOrder.data);
      console.log("222222222", responseOrder.data);
      setGender(responseOrder.data.customer.gender);
      const formattedDate = formatDate(responseOrder.data.customer.birthday);
      setBirthday(formattedDate);
      setCitizenId(responseOrder.data.customer.citizenId);
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
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  // Hủy hóa đơn
  const handleCancelOrder = async (id) => {
    try {
      // Make an API call to update the order status to "Đã xác nhận" (status: 2)
      await axios.put(`http://localhost:2003/api/order/delete/${id}`);
      setOrder({ ...order, status: 0 });
      toast.success("Hủy thành công!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      // router.push(`/orders?id=${id}`);
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
      toast.error("Giới tính không được để trống !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
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
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
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

  const handleRedirect = () => {
    router.push(`/room-service?id=${orderId}`);
  };

  const renderButtonsBasedOnStatus = () => {
    switch (order.status) {
      case 1:
        return (
          <React.Fragment>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <TextField
                style={{ marginRight: 20 }}
                value={numeral(order.deposit).format("0,0 ") + "  đ"}
                label="Tiền cọc"
              />
              <Button style={{ marginRight: 20 }} variant="outlined" color="error">
                Hủy xác nhận
              </Button>
              <Button variant="outlined" onClick={handleSubmit}>
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
              <Button variant="outlined" onClick={handleRedirect}>
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
              <Button variant="outlined" onClick={handleRedirect}>
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
              <Button variant="outlined" onClick={handleRedirect}>
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
                const hrefUpdate = `/room-service?id=${order.id}`;

                return (
                  <TableRow hover key={order.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.customer.fullname}</TableCell>
                    <TableCell>{order.customer.phoneNumber}</TableCell>
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
