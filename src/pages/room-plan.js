import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
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
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Backdrop,
  CircularProgress,
  Paper,
} from "@mui/material";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SeverityPill } from "src/components/severity-pill";
import { parse, format, subYears, addDays, addHours, setHours, setMinutes } from "date-fns";
import { FaHotel, FaSignOutAlt } from "react-icons/fa";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoomPlanSearch } from "src/sections/roomPlan/room-plan-search";
import RoomPlanFilter from "src/sections/roomPlan/room-plan-filter";

function RoomPlan() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const [room, setRoom] = useState([]);
  const [idRoom, setIdRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(0); // Add this state
  const [numberOfHours, setNumberOfHours] = useState(0); // Add this state
  const [valueFrom, setValueFrom] = useState(new Date());
  const [valueTo, setValueTo] = useState(addDays(new Date(), 1));
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  // const defaultCheckInTime = setMinutes(setHours(new Date(), 14), 0);
  const [valueTimeFrom, setValueTimeFrom] = useState(new Date());
  const [valueTimeTo, setValueTimeTo] = useState(setMinutes(setHours(new Date(), 12), 0));
  const [typeRental, setTypeRental] = useState(1);
  const [roomPricePerDay, setRoomPricePerDay] = useState(0); // Thêm state để lưu giá theo ngày của phòng
  const [roomPricePerHours, setRoomPricePerHours] = useState(0); // Thêm state để lưu giá theo ngày của phòng
  const [floor, setFloor] = useState([]);
  const [typeRoom, setTypeRoom] = useState([]);
  const [statusChoose, setStatusChoose] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [floorChose, setFloorChose] = useState("");
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [order, setOrder] = useState();

  // Dialog
  const [openDateDialog, setOpenDateDialog] = React.useState(false);
  // Loading
  const [openLoading, setOpenLoading] = React.useState(false);

  // Xử lí check-in/check-out
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, roomId, roomName) => {
    setAnchorEl(event.currentTarget);
    setIdRoom(roomId);
    setRoomName(roomName);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIdRoom("");
    setRoomName("");
  };

  // Xử lí ngày đặt phòng
  const [dataForm, setDataForm] = React.useState({
    dateFrom: new Date(),
    dateTo: new Date(),
  });

  const maxDate = addDays(valueFrom, 30); // Tính ngày tối đa là 30 ngày sau ngày bắt đầu

  const handleOpenDateDialog = () => {
    setOpenDateDialog(true);
    setAnchorEl(null);
  };

  const handleCloseDateDialog = () => {
    setValueFrom(new Date());
    setValueTo(null);
    setValueTimeFrom(new Date());
    // setValueTimeTo(null);
    setTypeRental(1);
    setNumberOfDays(0);
    setNumberOfPeople(0);
    setOpenDateDialog(false);
    setIdRoom("");
    setRoomName("");
  };

  const handleFromDateChange = (newValue) => {
    setValueFrom(newValue);
    if (newValue > valueTo) {
      setValueTo(newValue);
    } else {
    }

    const timeDiff = Math.abs(valueTo - newValue);
    const numberOfDays = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setNumberOfDays(numberOfDays);
  };

  const handleToDateChange = (newValue) => {
    // console.log(newValue + "C");
    // console.log(valueFrom + "C");
    const tomorrow = addDays(new Date(), 1);
    if (newValue === valueFrom) {
      setValueTo(tomorrow);
    } else if (newValue > valueFrom) {
      setValueTo(newValue);
    } else if (newValue <= valueFrom && typeRental === 1) {
      // Nếu ngày mới nhỏ hơn ngày hiện tại, sử dụng ngày hiện tại
      setValueTo(tomorrow);
      toast.warning("Ngày checkout không thể nhỏ hơn ngày hiện tại!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    const timeDiff = Math.abs(newValue - valueFrom);
    const numberOfDays = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setNumberOfDays(numberOfDays);
  };

  const handleValueTimeFromChange = (newValue) => {
    setValueTimeFrom(newValue);
    if (newValue > valueTimeTo) {
      setValueTimeTo(newValue);
    }

    const timeDiff = Math.abs(valueTimeTo - newValue);
    const numberOfHours = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60));
    setNumberOfHours(numberOfHours);
  };

  const handleValueTimeToChange = (newValue) => {
    setValueTimeTo(newValue);
    if (typeRental === 2) {
      const minimumCheckoutTime = new Date(valueTimeFrom.getTime() + 60 * 60 * 1000);
      const timeCheckOut = new Date(valueTimeFrom);
      timeCheckOut.setHours(24, 0, 0, 0);
      if (newValue < minimumCheckoutTime) {
        setValueTimeTo(minimumCheckoutTime);
        const timeDiff = Math.abs(minimumCheckoutTime - valueTimeFrom);
        const numberOfHours = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60));
        setNumberOfHours(numberOfHours);
      } else if (newValue > timeCheckOut) {
        setValueTimeTo(timeCheckOut);
        toast.warning("Thời gian thuê theo giờ chỉ được đến 24h PM.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      } else if (newValue < new Date(valueTimeFrom.getTime())) {
        setValueTimeTo(minimumCheckoutTime);
        toast.warning("Thời gian thuê phải ở tương lai.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      }
    } else if (typeRental === 1) {
      const defaultCheckOutTime = setMinutes(setHours(new Date(), 12), 0);
      setValueTimeTo(defaultCheckOutTime);
    }

    const timeDiff = Math.abs(newValue - valueTimeFrom);
    const numberOfHours = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60));
    setNumberOfHours(numberOfHours);
  };

  const handleTypeRentalChange = (event) => {
    const selectedTypeRental = event.target.value;
    setTypeRental(selectedTypeRental);

    if (selectedTypeRental === 2) {
      const today = new Date();
      setValueTo(today);
      const minimumCheckoutTime = new Date(valueTimeFrom.getTime() + 60 * 60 * 1000);
      if (valueTimeTo < minimumCheckoutTime) {
        setValueTimeTo(minimumCheckoutTime);
        const timeDiff = Math.abs(minimumCheckoutTime - valueTimeFrom);
        const numberOfHours = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60));
        setNumberOfHours(numberOfHours);
        console.log(numberOfHours);
      }
    } else if (selectedTypeRental === 1) {
      const tomorrow = addDays(new Date(), 1);
      setValueTo(tomorrow);
      const defaultCheckOutTime = setMinutes(setHours(new Date(), 12), 0);
      setValueTimeTo(defaultCheckOutTime);
      const timeDiff = Math.abs(valueTo - valueFrom);
      const numberOfDays = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setNumberOfDays(numberOfDays);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Hàm định dạng giờ mà không có giây
  const formatTimeWithoutSeconds = (date) => {
    return date ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  };
  // Kết thúc xử lí ngày đặt phòng

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
    const selectedRoom = room
      .find((floorRooms) => floorRooms.some((r) => r.id === idRoom))
      ?.find((r) => r.id === idRoom);
    if (selectedRoom) {
      setRoomPricePerDay(selectedRoom?.typeRoom?.pricePerDay);
      setRoomPricePerHours(selectedRoom?.typeRoom?.pricePerHours);
    }
  }, [idRoom, room]);

  // get data for filter
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
        const response = await axios.get("http://localhost:2003/api/general/floor/getList");
        const response2 = await axios.get("http://localhost:2003/api/general/type-room/getList");
        console.log(response.data);
        console.log(response2.data);
        setFloor(response.data);
        setTypeRoom(response2.data);
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

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
        if (idRoom) {
          const order = await axios.get(`http://localhost:2003/api/order/getByRoomId/${idRoom}`);
          console.log("Id Order: ", order.data.id);
          setOrder(order.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, [idRoom]);

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        let api = "http://localhost:2003/api/room/room-plan";

        let hasQueryParams = false;

        // Construct the API URL based on the selected options
        if (statusChoose !== "") {
          api += `?status=${statusChoose}`;
          hasQueryParams = true;
        }
        if (textSearch !== "") {
          api += hasQueryParams ? `&key=${textSearch}` : `?key=${textSearch}`;
          hasQueryParams = true;
        }
        if (floorChose !== "") {
          api += hasQueryParams ? `&floorId=${floorChose}` : `?floorId=${floorChose}`;
          hasQueryParams = true;
        }
        if (typeRoomChose !== "") {
          api += hasQueryParams ? `&typeRoomId=${typeRoomChose}` : `?typeRoomId=${typeRoomChose}`;
          hasQueryParams = true;
        }
        // const response = await axios.get("http://localhost:2003/api/room/room-plan");
        const response = await axios.get(api);
        console.log("Data: ", response.data);
        setRoom(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [statusChoose, textSearch, floorChose, typeRoomChose]);

  // Check in
  const createOrder = async () => {
    // Thực hiện xử lý khi ngày được xác nhận
    if (idRoom && valueFrom && valueTo && valueTimeFrom && valueTimeTo) {
      if (numberOfPeople < 1) {
        toast.error("Số người lớn hơn 0!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return false;
      } else if (!/^\d+$/.test(numberOfPeople)) {
        toast.error("Vui lòng chỉ nhập số nguyên!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      }
      // const adult = parseInt(numberOfPeople);
      // const children = parseInt(
      //   rooms.find((r) => r.id === selectedRoomId)?.typeRoom?.children || 0
      // );
      // const totalPeople = parseInt(adult + children);
      const capacity =
        room
          .find((floorRooms) => floorRooms.some((r) => r.id === idRoom))
          ?.find((r) => r.id === idRoom)?.typeRoom?.capacity || 0;
      if (numberOfPeople > capacity) {
        toast.error("Số người không được vượt quá sức chứa!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return false;
      }
      let totalAmount;

      if (typeRental === 1) {
        totalAmount = numberOfDays * roomPricePerDay;
      } else {
        totalAmount = numberOfHours * roomPricePerHours;
      }
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setOpenLoading(true);
        const response = await axios.post("http://localhost:2003/api/order/save", {
          room: room
            .find((floorRooms) => floorRooms.some((r) => r.id === idRoom))
            ?.find((r) => r.id === idRoom),
          checkIn: new Date(
            valueFrom.setHours(valueTimeFrom.getHours(), valueTimeFrom.getMinutes())
          ),
          checkOut: new Date(valueTo.setHours(valueTimeTo.getHours(), valueTimeTo.getMinutes())),
          timeIn: typeRental,
          roomPrice: totalAmount,
          customerQuantity: numberOfPeople,
        });
        // const responseOrderDetail = await axios.get(
        //   `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${response.data.id}`
        // );
        // setOrderDetailData(responseOrderDetail.data);
        // const room = await axios.get("http://localhost:2003/api/room/room-plan");
        // console.log("Data: ", room.data);
        // setRoom(room.data);
        // window.location.href = "/room-plan";

        router.push(`/booking?id=${response.data.id}`);
        console.log("Check-in thành công:", response.data);
        // Đóng dialog chọn ngày
        handleCloseDateDialog();
      } catch (error) {
        setOpenLoading(false);
        console.log("Lỗi khi thêm phòng vào hóa đơn chi tiết:", error);
        // Xử lý lỗi nếu có
        if (error.response.status === 400) {
          toast.error(error.response.data, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast.error("Lỗi không xác định. Vui lòng thử lại sau.", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    } else {
      toast.warning("Vui lòng ngày check-in/check-out và giờ check-in/check-out.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return false;
    }
  };

  // Update Checkout hóa đơn
  const handleUpdateOrder = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await axios.put(
        `http://localhost:2003/api/order/update-checkout/${order.id}`
      );
      console.log("ACB");
      setOpenLoading(true);
      setAnchorEl(null);
      setIdRoom("");
      setRoomName("");
      router.push(`/booking?id=${order.id}`);
    } catch (error) {
      setOpenLoading(false);
      console.log(error);
      toast.error("Có lỗi xảy ra !");
    }
  };

  const handleDetailOrder = () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setOpenLoading(true);
      setAnchorEl(null);
      setIdRoom("");
      setRoomName("");
      router.push(`/booking?id=${order.id}`);
    } catch (error) {
      setOpenLoading(false);
      console.log(error);
      toast.error("Có lỗi xảy ra !");
    }
  };

  return (
    <Container>
      <Head>
        <title>Sơ đồ phòng | Armani Hotel</title>
      </Head>
      <ToastContainer />
      <h1 style={{ display: "flex", justifyContent: "center" }}>Sơ đồ phòng</h1>
      <RoomPlanSearch textSearch={textSearch} setTextSearch={setTextSearch} />
      <RoomPlanFilter
        floor={floor}
        typeRoom={typeRoom}
        floorChose={floorChose}
        typeRoomChose={typeRoomChose}
        statusChoose={statusChoose}
        setFloorChose={setFloorChose}
        setTypeRoomChose={setTypeRoomChose}
        setStatusChoose={setStatusChoose}
      />
      <Dialog
        open={openDateDialog}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "50%",
          },
        }}
      >
        <DialogTitle>{roomName} - Chọn ngày check-in và check-out</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDateDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          style={{
            marginTop: 15,
            // display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center content horizontally
          }}
        >
          <DatePicker
            disabled
            label="Từ ngày"
            value={valueFrom}
            onChange={handleFromDateChange}
            renderInput={(params) => (
              <TextField
                style={{ marginRight: 25, width: 375 }}
                {...params}
                inputProps={{
                  value: formatDate(valueFrom),
                  readOnly: true,
                }}
              />
            )}
          />
          <TimePicker
            disabled
            label="Giờ check-in"
            onChange={handleValueTimeFromChange}
            value={valueTimeFrom}
            renderInput={(params) => (
              <TextField
                style={{ width: 375 }}
                {...params}
                inputProps={{
                  value: valueTimeFrom ? formatTimeWithoutSeconds(valueTimeFrom) : "",
                  readOnly: true,
                }}
              />
            )}
          />
          <br />
          <br />
          <DatePicker
            disablePast
            label="Đến ngày"
            minDate={dataForm.dateFrom}
            maxDate={maxDate}
            value={valueTo}
            onChange={handleToDateChange}
            renderInput={(params) => (
              <TextField
                style={{ marginRight: 25, width: 375 }}
                {...params}
                inputProps={{
                  value: formatDate(valueTo),
                  readOnly: true,
                }}
              />
            )}
          />
          <TimePicker
            disabled={typeRental === 1}
            label="Giờ check-out"
            value={valueTimeTo}
            onChange={handleValueTimeToChange}
            renderInput={(params) => (
              <TextField
                style={{ width: 375 }}
                {...params}
                inputProps={{
                  value: valueTimeTo ? formatTimeWithoutSeconds(valueTimeTo) : "",
                  readOnly: true,
                }}
              />
            )}
          />
          <br />
          <br />
          <FormControl variant="standard" style={{ width: 200, marginLeft: 300 }}>
            <InputLabel id="demo-simple-select-standard-label">Loại hình thuê</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Loại hình thuê"
              value={typeRental}
              onChange={handleTypeRentalChange}
            >
              <MenuItem value={1}>Theo ngày</MenuItem>
              <MenuItem value={2}>Theo giờ</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <TextField
            fullWidth
            label="Sức chứa"
            variant="outlined"
            disabled
            value={
              idRoom
                ? room
                    .find((floorRooms) => floorRooms.some((r) => r.id === idRoom))
                    ?.find((r) => r.id === idRoom)?.typeRoom?.capacity || ""
                : ""
            }
          />
          <br />
          <br />
          {typeRental === 1 && (
            <TextField fullWidth label="Số ngày" variant="outlined" disabled value={numberOfDays} />
          )}
          {typeRental === 2 && (
            <TextField fullWidth label="Số giờ" variant="outlined" disabled value={numberOfHours} />
          )}
          <br />
          <br />

          {typeRental === 1 && (
            <TextField
              fullWidth
              label="Giá"
              variant="outlined"
              disabled
              value={
                idRoom
                  ? formatPrice(
                      room
                        .find((floorRooms) => floorRooms.some((r) => r.id === idRoom))
                        ?.find((r) => r.id === idRoom)?.typeRoom?.pricePerDay * numberOfDays || ""
                    )
                  : ""
              }
            />
          )}
          {typeRental === 2 && (
            <TextField
              fullWidth
              label="Giá"
              variant="outlined"
              disabled
              value={
                idRoom
                  ? formatPrice(
                      room
                        .find((floorRooms) => floorRooms.some((r) => r.id === idRoom))
                        ?.find((r) => r.id === idRoom)?.typeRoom?.pricePerHours * numberOfHours ||
                        ""
                    )
                  : ""
              }
            />
          )}
          <br />
          <br />
          <TextField
            fullWidth
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            label="Số người"
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            fullWidth
            label="Trẻ em"
            variant="outlined"
            disabled
            value={
              idRoom
                ? room
                    .find((floorRooms) => floorRooms.some((r) => r.id === idRoom))
                    ?.find((r) => r.id === idRoom)?.typeRoom?.children || ""
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDateDialog} variant="outlined" color="error">
            Hủy
          </Button>
          <Button onClick={createOrder} variant="outlined">
            Xác nhận
          </Button>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </DialogActions>
      </Dialog>
      {room.map((room, floorIndex) => (
        <Box key={floorIndex}>
          <Typography variant="h5" gutterBottom>
            Tầng {floorIndex + 1}
          </Typography>
          <br />
          <Stack>
            <Grid container>
              {room.map((room) => {
                const status = getStatusColor(room.status);
                const statusText = status.text;
                return (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={room.id}>
                    <Box
                      style={{
                        border: "1px solid #ccc",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        height: 470,
                      }}
                    >
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
                            <IconButton
                              aria-controls={open ? "demo-positioned-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              onClick={(event) => handleClick(event, room.id, room.roomName)}
                            >
                              <KeyboardArrowDownIcon />
                            </IconButton>
                            {room.status === 1 && room.id === idRoom ? (
                              <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                              >
                                <MenuItem onClick={handleOpenDateDialog}>
                                  <KeyboardArrowDownIcon />
                                  Tiến hành check-in
                                </MenuItem>
                              </Menu>
                            ) : null}
                            {room.orderDetailList.find(
                              (orderDetail) =>
                                orderDetail.order &&
                                orderDetail.order.status === 1 &&
                                room.status === 2 &&
                                room.id === idRoom
                            ) ? (
                              <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                              >
                                <MenuItem onClick={handleDetailOrder}>
                                  <KeyboardArrowDownIcon />
                                  Chi tiết hóa đơn
                                </MenuItem>
                              </Menu>
                            ) : (
                              <>
                                {room.orderDetailList.find(
                                  (orderDetail) =>
                                    orderDetail.order &&
                                      orderDetail.order.status === 2 &&
                                     room.status === 2 &&
                                    room.id === idRoom
                                ) ? (
                                  <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                      vertical: "top",
                                      horizontal: "left",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "left",
                                    }}
                                  >
                                    <MenuItem onClick={handleUpdateOrder}>
                                      <KeyboardArrowDownIcon />
                                      Chi tiết hóa đơn
                                    </MenuItem>
                                  </Menu>
                                ) : null}
                              </>
                            )}
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
                            image={
                              room.photoList.map((photo) =>
                                typeof photo.url === "string" ? photo.url : ""
                              )[0]
                            }
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
                          {room.status === 2 || room.status === 1 ? (
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
                          {room.status === 2 || room.status === 1 ? (
                            <>
                              {room.orderDetailList.map((orderDetail, index) =>
                                orderDetail.status === 1 || orderDetail.status === 2 ? (
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
                    </Box>
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
