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
  IconButton,
  TextareaAutosize,
  Typography,
  Stack,
  Grid,
  CardContent,
  Menu,
  MenuItem,
  CardMedia,
  DialogTitle,
  FormControl,
  InputLabel,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SeverityPill } from "src/components/severity-pill";
import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Drawer } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { parse, format, subYears, differenceInHours, isToday } from "date-fns";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHotel, FaSignOutAlt } from "react-icons/fa";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { RoomPlanSearch } from "../roomPlan/room-plan-search";
import RoomPlanFilter from "../roomPlan/room-plan-filter";

const numeral = require("numeral");

export const BookRoomTable = (props) => {
  const { items = [], selected = [] } = props;
  const router = useRouter();
  const [order, setOrder] = useState({});
  const [booking, setBooking] = useState({
    bankAccountNumber: "",
    bankAccountName: "",
  });
  const [orderDetail, setOrderDetail] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [surcharge, setSurcharge] = useState(0);
  const [room, setRoom] = useState([]);
  const [idRoom, setIdRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [floor, setFloor] = useState([]);
  const [typeRoom, setTypeRoom] = useState([]);
  const [statusChoose, setStatusChoose] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [floorChose, setFloorChose] = useState("");
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [note, setNote] = useState("");
  const [noteCancelBooking, setNoteCancelBooking] = useState("");
  const [bank, setBank] = useState();

  // Khách hàng
  const [cccd, setCccd] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState("Nam");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");

  // Loading && Dialog
  const [loading, setLoading] = useState(false);
  const [openLoading, setOpenLoading] = React.useState(false);
  const [openChooseRoom, setOpenChooseRoom] = React.useState(false);
  const [openUpdateCustomer, setOpenUpdateCustomer] = React.useState(false);
  const [openCancelBooking, setOpenCancelBooking] = React.useState(false);
  const [openRefund, setOpenRefund] = React.useState(false);
  const [refundMoney, setRefundMoney] = React.useState(0);
  const [fee, setFee] = React.useState(0);

  //Tính toán số tiền hoàn trả
  const caculateRefundMoney = () => {
    // Kiểm tra ngày check in phải lớn hơn ngày hôm nay 2 ngày  -> miễn phí
    // Quá 2 ngày -> phí đêm đầu
    console.log(booking.checkInDate);
  };

  //Dialog chọn phòng
  const handleOpenChooseRoom = () => {
    setOpenChooseRoom(true);
  };

  const handleCloseChooseRoom = () => {
    setOpenChooseRoom(false);
    setStatusChoose("");
    setTextSearch("");
    setFloorChose("");
    setTypeRoomChose("");
    setAnchorEl(null);
  };

  // Dialog update khách hàng
  const handleOpenUpdateCustomer = () => {
    setOpenUpdateCustomer(true);
  };

  const handleCloseUpdateCustomer = () => {
    setOpenUpdateCustomer(false);
    setCccd("");
    setBirthday(null);
    setGender("Nam");
    setNationality("");
    setAddress("");
  };

  // Dialog hủy booking
  const handleOpenCancelBooking = () => {
    setOpenCancelBooking(true);
  };
  const handleOpenRefund = () => {
    console.log("okk");
    setOpenRefund(true);
  };
  const handleCloseRefund = () => {
    setOpenRefund(false);
  };

  const hanldeCloseCancelBooking = () => {
    setOpenCancelBooking(false);
  };

  // Xử lí check-in/check-out
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAnchorEl = Boolean(anchorEl);

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

  const [open, setOpen] = useState(false);
  const showDrawer = async (bookingId) => {
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
      const responseBooking = await axios.get(
        `http://localhost:2003/api/manage-booking/getById/${bookingId}`
      );
      setBooking(responseBooking.data);
      // setOrderId(responseOrder.data.id);
      console.log(responseBooking.data);
      setNoteCancelBooking(responseBooking.data.cancelReason);

      if (booking?.order?.id !== null) {
        const responseOrderDetail = await axios.get(
          `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${booking?.order?.id}`
        );
        console.log("OrderDetail: ", responseOrderDetail.data);
        setOrderDetail(responseOrderDetail.data);
      }

      // Lấy ngày hiện tại
      const currentDate = new Date();

      // Chuyển đổi ngày từ dạng chuỗi sang đối tượng Date
      const checkInDate = new Date(booking.checkInDate);

      // Tính toán khoảng cách thời gian giữa ngày check in và ngày hiện tại
      const timeDifference = checkInDate.getTime() - currentDate.getTime();

      // Chuyển đổi khoảng cách thời gian từ milliseconds sang days
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      // Kiểm tra nếu ngày check in phải lớn hơn ngày hôm nay 2 ngày
      if (daysDifference > 2) {
        // Miễn phí
        console.log("Miễn phí");
      } else if (daysDifference < 0) {
        console.log("Đớp hết");
      } else {
        // Phí đêm đầu
        const price = responseBooking.data.typeRoom.pricePerDay;
        console.log("Phí đêm đầu", price);
        const fee = price + price * 0.1;
        const refund = responseBooking.data.totalPrice - fee;
        setRefundMoney(refund);
        setFee(fee);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function getFile() {
    // Get the input element
    var fileInput = document.getElementById("fileInput");

    // Get the selected file
    var selectedFile = fileInput.files[0];

    // Display file details (for example, the file name)
    if (selectedFile) {
      alert("Selected file: " + selectedFile.name);
    } else {
      alert("No file selected");
    }
  }

  const onClose = () => {
    setOpen(false);
    // setBooking(null);
    // setOrderDetail(null);
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

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 0:
        return { color: "error", text: "Đã hủy" };
      case 1:
        return { color: "warning", text: "Chưa xếp phòng" };
      case 2:
        return { color: "primary", text: "Đã xếp phòng" };
      case 3:
        return { color: "secondary", text: "Đã nhận phòng" };
      case 4:
        return { color: "success", text: "Đã trả phòng" };
      case 5:
        return { color: "warning", text: "Yêu cầu hủy phòng / Hoàn tiền" };
      case 6:
        return { color: "error", text: "Khách hủy" };
      case -1:
        return { color: "error", text: "Thanh toán thất bại" };
      default:
        return { color: "default", text: "Unknown" };
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

  const handleRedirect = async () => {
    if (!booking) {
      return false;
    }

    const { checkInDate } = booking;
    console.log("Check-in: ", checkInDate);
    const currentDate = new Date();
    const checkinDateTime = new Date(checkInDate);
    console.log("Check-in Datetime: ", checkinDateTime);

    const shouldApplySurcharge =
      currentDate < checkinDateTime &&
      (differenceInHours(checkinDateTime, currentDate) <= 38 ||
        (isToday(checkinDateTime) && currentDate.getHours() < checkinDateTime.getHours()));

    const inTime =
      currentDate >= checkinDateTime && currentDate.getHours() >= checkinDateTime.getHours();

    if (shouldApplySurcharge) {
      const payload = {
        orderId: booking?.order?.id,
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
        setOpenLoading(true);
        router.push(`/booking?id=${booking?.order?.id}`);
      } catch (error) {
        setOpenLoading(false);
        console.log(error);
        toast.error("Có lỗi xảy ra !");
      }
    } else if (inTime) {
      const payload = {
        orderId: booking?.order?.id,
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
        setOpenLoading(true);
        router.push(`/booking?id=${booking?.order?.id}`);
      } catch (error) {
        setOpenLoading(false);
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
    router.push(`/booking?id=${booking?.order?.id}`);
  };

  useEffect(() => {
    const calculateSurcharge = () => {
      if (!booking) {
        return false;
      }

      const { checkInDate } = booking;
      console.log("Check-in: ", checkInDate);
      const currentDate = new Date();
      const checkinDateTime = new Date(checkInDate);
      console.log("Check-in Datetime: ", checkinDateTime);

      const shouldApplySurcharge =
        currentDate < checkinDateTime &&
        (differenceInHours(checkinDateTime, currentDate) <= 38 ||
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
  }, [booking, setSurcharge]);

  const isNewOrder = (order) => {
    const isNewStatus = order.status === 1;
    return isNewStatus;
  };

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
        const responseFloor = await axios.get("http://localhost:2003/api/general/floor/getList");
        const responseTypeRoom = await axios.get(
          "http://localhost:2003/api/general/type-room/getList"
        );
        setFloor(responseFloor.data);
        setTypeRoom(responseTypeRoom.data);
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

  // Load thông tin hóa đơn chi tiết
  useEffect(() => {
    if (booking?.order?.id) {
      const fetchOrderDetail = async () => {
        try {
          const response = await axios.get(
            `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${booking?.order?.id}`
          );
          setOrderDetail(response.data);
        } catch (error) {
          console.error("Error loading customer information:", error);
        }
      };

      fetchOrderDetail();
    } else {
      setOrderDetail([]);
    }
  }, [booking?.order?.id]);

  // Xếp phòng
  const addRoom = async () => {
    // Thực hiện xử lý khi ngày được xác nhận
    if (idRoom) {
      if (orderDetail.length >= booking?.numberRooms) {
        toast.error("Vượt quá số lượng phòng!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return false;
      }

      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        const response = await axios.post("http://localhost:2003/api/order/add-room-booking", {
          idBooking: booking?.id,
          idRoom: idRoom,
        });

        setOrderDetail([...orderDetail, response.data]);
        const responseBooking = await axios.get(
          `http://localhost:2003/api/manage-booking/getById/${booking?.id}`
        );
        setBooking(responseBooking.data);
        const responseOrderDetail = await axios.get(
          `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${booking?.order?.id}`
        );
        setOrderDetail(responseOrderDetail.data);
        const responseRoom = await axios.get("http://localhost:2003/api/room/room-plan");
        setRoom(responseRoom.data);
        props.onChangeStatus(booking?.id);
        // router.push(`/booking?id=${id}`);
        toast.success("Xếp phòng thành công!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.log("Phòng đã được thêm vào hóa đơn chi tiết:", response.data);
        // Đóng dialog chọn ngày
        handleCloseChooseRoom();
      } catch (error) {
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

  // Xóa phòng
  const handleDeleteRoom = async (orderDetailid) => {
    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      await axios.put(
        `http://localhost:2003/api/order-detail/delete-room-booking/${orderDetailid}?idOrder=${booking?.order?.id}`
      );

      setOrderDetail((prevOrderDetail) =>
        prevOrderDetail.filter((orderDetailData) => orderDetailData.id !== orderDetailid)
      );
      const response = await axios.get(
        `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${booking?.order?.id}`
      );
      setOrderDetail(response.data);
      const responseRoom = await axios.get("http://localhost:2003/api/room/room-plan");
      setRoom(responseRoom.data);
      const responseBooking = await axios.get(
        `http://localhost:2003/api/manage-booking/getById/${booking?.id}`
      );
      setBooking(responseBooking.data);
      console.log("Length: ", orderDetail.length - 1);
      if (orderDetail.length - 1 === 0) {
        props.onChangeWaitRoom(booking?.id);
      }
      toast.success("Hủy phòng thành công!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Xác nhận khách hàng booking
  const handleAcceptCustomerBooking = async () => {
    if (cccd == null || !cccd.trim() || birthday == null || !birthday.trim()) {
      toast.error("Vui lòng thông tin khách hàng!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    } else if (!/^\d+$/.test(cccd)) {
      toast.error("CCCD chỉ được chứa ký tự số!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    } else if (!/^[0]\d{11}$/.test(cccd)) {
      toast.error("CCCD phải bắt đầu bằng số 0 và có đúng 12 số!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    const genderBoolean = gender === "Nam"; // true if gender is "Nam", false if gender is "Nữ"
    const parsedBirthday = parse(birthday, "dd/MM/yyyy", new Date());

    const formattedBirthday = format(parsedBirthday, "yyyy-MM-dd");
    const customerBooking = {
      idBooking: booking?.id,
      idOrder: booking?.order?.id,
      idCustomer: booking?.customer?.id,
      citizenId: cccd,
      gender: genderBoolean,
      birthday: formattedBirthday,
      nationality: nationality,
      address: address,
    };

    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const response = await axios.post(
        "http://localhost:2003/api/manage-booking/accept-customer",
        customerBooking
      );
      toast.success("Xác nhận thành công!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      if (!booking) {
        return false;
      }

      const { checkInDate } = booking;
      console.log("Check-in: ", checkInDate);
      const currentDate = new Date();
      const checkinDateTime = new Date(checkInDate);
      console.log("Check-in Datetime: ", checkinDateTime);

      const shouldApplySurcharge =
        currentDate < checkinDateTime &&
        (differenceInHours(checkinDateTime, currentDate) <= 38 ||
          (isToday(checkinDateTime) && currentDate.getHours() < checkinDateTime.getHours()));

      const inTime =
        currentDate >= checkinDateTime && currentDate.getHours() >= checkinDateTime.getHours();

      if (shouldApplySurcharge) {
        const payload = {
          orderId: booking?.order?.id,
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
          setOpenLoading(true);
          router.push(`/booking?id=${booking?.order?.id}`);
        } catch (error) {
          setOpenLoading(false);
          console.log(error);
          toast.error("Có lỗi xảy ra !");
        }
      } else if (inTime) {
        const payload = {
          orderId: booking?.order?.id,
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
          setOpenLoading(true);
          router.push(`/booking?id=${booking?.order?.id}`);
        } catch (error) {
          setOpenLoading(false);
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
      router.push(`/booking?id=${booking?.order?.id}`);
      console.log("Customer Booking added: ", response.data);
      setCccd("");
      setGender("Nam");
      setBirthday(null);
      setNationality("");
      setAddress("");
    } catch (error) {
      if (error.response) {
        // Xử lý response lỗi
        if (error.response.status === 403) {
          alert("Bạn không có quyền truy cập vào trang này");
          window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
        } else if (error.response.status === 400) {
          toast.error(error.response.data, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
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
        `http://localhost:2003/api/order/update-checkout/${booking?.order?.id}`
      );
      console.log("ACB");
      setOpenLoading(true);
      router.push(`/booking?id=${booking?.order?.id}`);
    } catch (error) {
      setOpenLoading(false);
      console.log(error);
      toast.error("Có lỗi xảy ra !");
    }
  };

  // Update Checkout hóa đơn
  const handleCancelBooking = async () => {
    const payload = {
      ...booking,
      bankAccountName: booking.bankAccountName,
      bankAccountNumber: booking.bankAccountNumber,
      note: noteCancelBooking,
    };
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await axios.put(
        `http://localhost:2003/api/manage-booking/cancel-booking/${booking?.id}`,
        payload
      );
      setBooking(response.data);
      const responseOrderDetail = await axios.get(
        `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${booking?.order?.id}`
      );
      setOrderDetail(responseOrderDetail.data);
      const responseRoom = await axios.get("http://localhost:2003/api/room/room-plan");
      setRoom(responseRoom.data);
      const responseBooking = await axios.get(
        `http://localhost:2003/api/manage-booking/getById/${booking?.id}`
      );
      setBooking(responseBooking.data);
      props.onChangeCancel(booking?.id);
      setOpenCancelBooking(false);
      setOpenLoading(true);
      toast.success("Hủy thành công !");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
      setOpenLoading(false);
    }
  };

  const handleCancelBooking2 = async () => {
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];

    // Create FormData object
    const formData = new FormData();

    // Append file to FormData
    formData.append("file", file);
    formData.append("id", booking.id);

    // Other form data
    formData.append("bankAccountName", booking.bankAccountName);
    formData.append("bankAccountNumber", booking.bankAccountNumber);
    formData.append("note", noteCancelBooking);

    if (file === undefined) {
      toast.error("Hình ảnh không được để trống !");
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await axios.put(
        `http://localhost:2003/api/manage-booking/cancel-booking/customer/${booking?.id}`,
        formData
      );
      setBooking(response.data);
      const responseOrderDetail = await axios.get(
        `http://localhost:2003/api/order-detail/loadOrderDetailByOrderId/${booking?.order?.id}`
      );
      setOrderDetail(responseOrderDetail.data);
      const responseRoom = await axios.get("http://localhost:2003/api/room/room-plan");
      setRoom(responseRoom.data);
      setOpenCancelBooking(false);
      setOpenLoading(true);
      toast.success("Hủy thành công !");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
      setOpenLoading(false);
    }
  };

  return (
    <Card sx={{ marginTop: 5, marginBottom: 3 }}>
      <ToastContainer></ToastContainer>
      <Dialog
        open={openCancelBooking}
        onClose={hanldeCloseCancelBooking}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "40%",
            maxHeight: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", justifyContent: "center" }}
          id="customized-dialog-title"
        >
          Hủy Booking
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={hanldeCloseCancelBooking}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.customer?.fullname}
            label="Tên khách hàng"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.customer?.phoneNumber}
            label="Số điện thoại"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.customer?.email}
            label="Email"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.bankAccountNumber}
            onChange={(e) => {
              setBooking((prev) => ({
                ...prev,
                bankAccountNumber: e.target.value,
              }));
            }}
            label="Số tài khoản"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.bankAccountName}
            onChange={(e) => {
              setBooking((prev) => ({
                ...prev,
                bankAccountName: e.target.value,
              }));
            }}
            label="Tên ngân hàng"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.totalPrice ? formatPrice(booking?.totalPrice) + " VND" : ""}
            label="Số tiền chuyển lại"
          />
          <br />
          <h6 style={{ marginLeft: 5 }}>Lí do hủy đặt phòng: </h6>
          <TextareaAutosize
            className="form-control"
            placeholder="Lí do hủy đặt phòng"
            name="note"
            cols={80}
            style={{ height: 150 }}
            variant="outlined"
            value={noteCancelBooking}
            onChange={(e) => setNoteCancelBooking(e.target.value)}
          />
          <br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={hanldeCloseCancelBooking} color="error">
              Đóng
            </Button>
            <Button variant="outlined" onClick={handleCancelBooking} style={{ marginLeft: 20 }}>
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openRefund}
        onClose={handleCloseRefund}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "40%",
            maxHeight: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", justifyContent: "center" }}
          id="customized-dialog-title"
        >
          Hoàn thành xác nhận chuyển tiền
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseRefund}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.customer?.fullname}
            label="Tên khách hàng"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.customer?.phoneNumber}
            label="Số điện thoại"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.customer?.email}
            label="Email"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.bankAccountNumber}
            onChange={(e) => {
              setBooking((prev) => ({
                ...prev,
                bankAccountNumber: e.target.value,
              }));
            }}
            label="Số tài khoản"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.bankAccountName}
            onChange={(e) => {
              setBooking((prev) => ({
                ...prev,
                bankAccountName: e.target.value,
              }));
            }}
            label="Tên ngân hàng"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={formatPrice(refundMoney) + " VND"}
            label="Số tiền chuyển lại"
          />
          <br />
          <h6 style={{ marginLeft: 5 }}>Lí do hủy đặt phòng: </h6>
          <TextareaAutosize
            className="form-control"
            placeholder="Lí do hủy đặt phòng"
            name="note"
            cols={80}
            style={{ height: 150 }}
            variant="outlined"
            value={noteCancelBooking}
            onChange={(e) => setNoteCancelBooking(e.target.value)}
          />
          <br />
          <p>Chọn hình ảnh</p>
          <input type="file" id="fileInput" />
          <br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCloseRefund} color="error">
              Đóng
            </Button>
            <Button variant="outlined" onClick={handleCancelBooking2} style={{ marginLeft: 20 }}>
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openUpdateCustomer}
        onClose={handleCloseUpdateCustomer}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "35%",
            maxHeight: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", justifyContent: "center" }}
          id="customized-dialog-title"
        >
          Xác nhận thông tin khách hàng
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUpdateCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.customer?.fullname}
            label="Tên khách hàng"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={
              booking?.customer?.phoneNumber
                ? formatPhoneNumber(booking?.customer?.phoneNumber)
                : ""
            }
            label="Số điện thoại"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={booking?.customer?.email}
            label="Email"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={cccd || ""}
            onChange={(e) => setCccd(e.target.value)}
            label="Giấy tờ tùy thân"
          />
          <br />
          <DatePicker
            disableFuture
            maxDate={subYears(new Date(), 18)}
            openTo="year"
            label="Ngày sinh"
            value={birthday || ""}
            onChange={handleBirthDayChange}
            renderInput={(params) => (
              <TextField
                style={{ display: "flex", justifyContent: "center" }}
                {...params}
                inputProps={{
                  value: birthday || "",
                  readOnly: true,
                }}
              />
            )}
          />
          <br />
          <FormControl style={{ display: "flex", justifyContent: "center" }}>
            <FormLabel
              style={{ display: "flex", justifyContent: "center" }}
              id="demo-row-radio-buttons-group-label"
            >
              Giới tính
            </FormLabel>
            <RadioGroup
              style={{ display: "flex", justifyContent: "center" }}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={gender || ""}
              onChange={(e) => setGender(e.target.value)}
            >
              <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
              <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
            </RadioGroup>
          </FormControl>
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={nationality || ""}
            onChange={(e) => setNationality(e.target.value)}
            label="Quốc tịch"
          />
          <br />
          <TextField
            style={{ display: "flex", justifyContent: "center" }}
            value={address || ""}
            onChange={(e) => setAddress(e.target.value)}
            label="Địa chỉ"
          />
          <br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCloseUpdateCustomer} color="error">
              Đóng
            </Button>
            <Button
              variant="outlined"
              onClick={handleAcceptCustomerBooking}
              style={{ marginLeft: 20 }}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openChooseRoom}
        onClose={handleCloseChooseRoom}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "90%",
            maxHeight: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", justifyContent: "center" }}
          id="customized-dialog-title"
        >
          Sơ đồ phòng
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseChooseRoom}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
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
                                {room.orderDetailList.find(
                                  (orderDetail) =>
                                    orderDetail.order &&
                                    orderDetail.order.status === 1 &&
                                    orderDetail.order.typeOfOrder == 0 &&
                                    room.status === 1
                                ) ? (
                                  <>
                                    <SeverityPill variant="contained" color="primary">
                                      Khách đặt trước
                                    </SeverityPill>
                                  </>
                                ) : null}
                              </Typography>

                              <Typography variant="h6" component="div">
                                {room.roomName}
                                {room.status === 1 ? (
                                  <>
                                    <IconButton
                                      aria-controls={
                                        openAnchorEl ? "demo-positioned-menu" : undefined
                                      }
                                      aria-haspopup="true"
                                      aria-expanded={openAnchorEl ? "true" : undefined}
                                      onClick={(event) =>
                                        handleClick(event, room.id, room.roomName)
                                      }
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
                                        <MenuItem onClick={addRoom}>
                                          <KeyboardArrowDownIcon />
                                          Chọn phòng
                                        </MenuItem>
                                      </Menu>
                                    ) : null}
                                  </>
                                ) : null}

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
                              {room?.status === 2 || room?.status === 1 ? (
                                <>
                                  {room?.orderDetailList.map((orderDetail, index) =>
                                    orderDetail?.status === 1 || orderDetail?.status === 2 ? (
                                      <React.Fragment key={index}>
                                        <Typography>
                                          <SvgIcon fontSize="small">
                                            <FaHotel />
                                          </SvgIcon>{" "}
                                          {orderDetail?.checkInDatetime
                                            ? format(
                                                new Date(orderDetail?.checkInDatetime),
                                                "dd/MM/yyyy HH:mm"
                                              )
                                            : ""}
                                          <Typography
                                            variant="h6"
                                            style={{ color: "red", marginTop: 10 }}
                                          >
                                            {orderDetail?.roomPrice
                                              ? formatPrice(orderDetail?.roomPrice)
                                              : ""}
                                          </Typography>
                                        </Typography>
                                      </React.Fragment>
                                    ) : null
                                  )}
                                </>
                              ) : null}
                              {room?.status === 2 || room?.status === 1 ? (
                                <>
                                  {room?.orderDetailList.map((orderDetail, index) =>
                                    orderDetail?.status === 1 || orderDetail?.status === 2 ? (
                                      <Typography key={index}>
                                        <SvgIcon fontSize="small">
                                          <FaSignOutAlt />
                                        </SvgIcon>{" "}
                                        {orderDetail?.checkOutDatetime
                                          ? format(
                                              new Date(orderDetail?.checkOutDatetime),
                                              "dd/MM/yyyy HH:mm"
                                            )
                                          : ""}
                                        <Typography variant="h6" style={{ marginTop: 10 }}>
                                          {orderDetail?.order?.customer?.fullname}
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
        </DialogContent>
      </Dialog>
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
            <div style={{ display: "flex", marginLeft: 50 }}>
              <hr style={{ width: 260 }} />
              <h4
                style={{
                  marginLeft: 30,
                  marginRight: 30,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Chi tiết Booking
              </h4>
              <hr style={{ width: 290 }} />
            </div>
            <br />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ fontSize: 20 }}>
                <p>+ Tên khách hàng: {booking?.customer?.fullname}</p>
                <p>+ Số điện thoại: {booking?.customer?.phoneNumber}</p>
                <p>+ Email: {booking?.customer?.email}</p>
                <p>+ Loại phòng: {booking?.typeRoom?.typeRoomName}</p>
                <p>+ Số lượng phòng: {booking?.numberRooms}</p>
                {booking.status === 5 ? (
                  <div>
                    <p
                      style={{
                        color: "red",
                      }}
                    >
                      Ngân hàng : {booking?.bankAccountName ? booking?.bankAccountName : ""}{" "}
                    </p>
                    <p>Phí thu : {formatPrice(fee)} VND</p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div style={{ fontSize: 20 }}>
                <p>
                  + Ngày nhận phòng: {booking?.checkInDate ? formatDate(booking?.checkInDate) : ""}
                </p>
                <p>
                  + Ngày trả phòng: {booking?.checkOutDate ? formatDate(booking?.checkOutDate) : ""}
                </p>
                <p>+ Số người lớn: {booking?.numberAdults}</p>
                <p>+ Số trẻ em: {booking?.numberChildren}</p>
                <p>
                  + Tiền đã thanh toán:{" "}
                  {booking?.totalPrice ? formatPrice(booking?.totalPrice) : ""} VND
                </p>
                {booking.status === 5 ? (
                  <div>
                    <p
                      style={{
                        color: "red",
                      }}
                    >
                      Tài khoản : {booking?.bankAccountNumber ? booking?.bankAccountNumber : ""}{" "}
                    </p>
                    <p>
                      Số tiền hoàn trả :{" "}
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        {formatPrice(refundMoney)}
                      </span>{" "}
                      VND
                    </p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div style={{ marginLeft: 50, display: "flex" }}>
              {booking?.status === 2 ||
              booking?.status === 3 ||
              booking?.status === 4 ||
              booking?.status === 0 ? (
                <>
                  <h5 style={{ marginTop: 10 }}>Phòng</h5>
                </>
              ) : null}
              {booking?.status === 1 ? (
                <>
                  <h5 style={{ marginTop: 10 }}>Chưa xếp phòng</h5>
                </>
              ) : null}
              {booking?.status === 1 || (booking?.status === 2 && booking?.order?.status === 1) ? (
                <>
                  <Button onClick={handleOpenChooseRoom}>
                    <PlusCircleIcon />
                  </Button>
                </>
              ) : null}
              {booking?.status === 5 ? (
                <>
                  <Button onClick={handleOpenRefund}>
                    <CheckCircleIcon /> Hoàn tiền
                  </Button>
                </>
              ) : null}

              <hr style={{ marginLeft: 20, marginTop: 25, width: 480 }} />
            </div>
            <br />
            {booking?.status === 2 ? (
              <>
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
                        {booking?.order?.status === 1 ? <TableCell>Thao tác</TableCell> : ""}
                        {/* <TableCell>Sức chứa</TableCell>
                        <TableCell>Số khách</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetail.map((od, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {od && od.roomImages && od.roomImages[0] && (
                                <img
                                  style={{ objectFit: "cover", width: 150 }}
                                  src={od.roomImages[0]}
                                  // alt={`Room ${index + 1} Image 1`}
                                />
                              )}
                            </TableCell>
                            <TableCell>{od?.room?.roomName}</TableCell>
                            <TableCell>{od?.room?.typeRoom?.typeRoomName}</TableCell>
                            <TableCell>
                              {od && od?.checkIn && format(new Date(od?.checkIn), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              {od && od?.checkOut && format(new Date(od?.checkOut), "dd/MM/yyyy")}
                            </TableCell>
                            {od && od?.order?.status === 1 ? (
                              <TableCell>
                                <Button onClick={() => handleDeleteRoom(od?.id)}>
                                  <XCircleIcon />
                                </Button>
                              </TableCell>
                            ) : (
                              ""
                            )}
                            {/* <TableCell>{od?.room?.typeRoom?.capacity}</TableCell>
                            <TableCell>{od?.customerQuantity}</TableCell> */}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                      style={{ marginRight: 20 }}
                      value={numeral(surcharge).format("0,0 ") + "  đ"}
                      label="* Phụ thu : 10.000đ /h"
                    />
                    <Button variant="outlined" onClick={handleOpenCancelBooking} color="error">
                      Hủy đặt phòng
                    </Button>
                    <Button
                      onClick={handleOpenUpdateCustomer}
                      variant="outlined"
                      style={{ marginLeft: 20 }}
                    >
                      Khách hàng nhận phòng
                    </Button>
                  </div>
                </Box>
              </>
            ) : null}
            {booking?.status === 3 && booking?.order?.status === 1 ? (
              <>
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
                        {/* <TableCell>Sức chứa</TableCell>
                        <TableCell>Số khách</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetail.map((od, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {od && od.roomImages && od.roomImages[0] && (
                                <img
                                  style={{ objectFit: "cover", width: 150 }}
                                  src={od.roomImages[0]}
                                  // alt={`Room ${index + 1} Image 1`}
                                />
                              )}
                            </TableCell>
                            <TableCell>{od?.room?.roomName}</TableCell>
                            <TableCell>{od?.room?.typeRoom?.typeRoomName}</TableCell>
                            <TableCell>
                              {od && od?.checkIn && format(new Date(od?.checkIn), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              {od && od?.checkOut && format(new Date(od?.checkOut), "dd/MM/yyyy")}
                            </TableCell>
                            {/* <TableCell>{od?.room?.typeRoom?.capacity}</TableCell>
                            <TableCell>{od?.customerQuantity}</TableCell> */}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="outlined" onClick={onClose} color="error">
                      Đóng
                    </Button>
                    <Button
                      onClick={handleRedirectDetail}
                      variant="outlined"
                      style={{ marginLeft: 20 }}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </Box>
              </>
            ) : null}
            {booking?.order?.status === 2 ? (
              <>
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
                        {/* <TableCell>Sức chứa</TableCell>
                        <TableCell>Số khách</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetail.map((od, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {od && od.roomImages && od.roomImages[0] && (
                                <img
                                  style={{ objectFit: "cover", width: 150 }}
                                  src={od.roomImages[0]}
                                  // alt={`Room ${index + 1} Image 1`}
                                />
                              )}
                            </TableCell>
                            <TableCell>{od?.room?.roomName}</TableCell>
                            <TableCell>{od?.room?.typeRoom?.typeRoomName}</TableCell>
                            <TableCell>
                              {od && od?.checkIn && format(new Date(od?.checkIn), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              {od && od?.checkOut && format(new Date(od?.checkOut), "dd/MM/yyyy")}
                            </TableCell>
                            {/* <TableCell>{od?.room?.typeRoom?.capacity}</TableCell>
                            <TableCell>{od?.customerQuantity}</TableCell> */}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="outlined" onClick={onClose} color="error">
                      Đóng
                    </Button>
                    <Button
                      onClick={handleUpdateOrder}
                      variant="outlined"
                      style={{ marginLeft: 20 }}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </Box>
              </>
            ) : null}
            {booking?.order?.status === 3 && booking?.status === 4 ? (
              <>
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
                        {/* <TableCell>Sức chứa</TableCell>
                        <TableCell>Số khách</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetail.map((od, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {od && od.roomImages && od.roomImages[0] && (
                                <img
                                  style={{ objectFit: "cover", width: 150 }}
                                  src={od.roomImages[0]}
                                  // alt={`Room ${index + 1} Image 1`}
                                />
                              )}
                            </TableCell>
                            <TableCell>{od?.room?.roomName}</TableCell>
                            <TableCell>{od?.room?.typeRoom?.typeRoomName}</TableCell>
                            <TableCell>
                              {od && od?.checkIn && format(new Date(od?.checkIn), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              {od && od?.checkOut && format(new Date(od?.checkOut), "dd/MM/yyyy")}
                            </TableCell>
                            {/* <TableCell>{od?.room?.typeRoom?.capacity}</TableCell>
                            <TableCell>{od?.customerQuantity}</TableCell> */}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
                <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={onClose} color="error">
                    Đóng
                  </Button>
                </div>
              </>
            ) : null}
            {booking?.status === 0 ? (
              <>
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
                        {/* <TableCell>Sức chứa</TableCell>
                        <TableCell>Số khách</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetail.map((od, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {od && od.roomImages && od.roomImages[0] && (
                                <img
                                  style={{ objectFit: "cover", width: 150 }}
                                  src={od.roomImages[0]}
                                  // alt={`Room ${index + 1} Image 1`}
                                />
                              )}
                            </TableCell>
                            <TableCell>{od?.room?.roomName}</TableCell>
                            <TableCell>{od?.room?.typeRoom?.typeRoomName}</TableCell>
                            <TableCell>
                              {od && od?.checkIn && format(new Date(od?.checkIn), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              {od && od?.checkOut && format(new Date(od?.checkOut), "dd/MM/yyyy")}
                            </TableCell>
                            {/* <TableCell>{od?.room?.typeRoom?.capacity}</TableCell>
                            <TableCell>{od?.customerQuantity}</TableCell> */}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
                <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={onClose} color="error">
                    Đóng
                  </Button>
                </div>
              </>
            ) : null}
            {booking?.status === 1 ? (
              <React.Fragment>
                <div style={{ marginLeft: 50 }}>
                  <h6>Ghi chú hủy đặt phòng: </h6>
                  <TextareaAutosize
                    className="form-control"
                    placeholder="Ghi chú"
                    name="note"
                    cols={80}
                    style={{ height: 150 }}
                    variant="outlined"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <br />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={onClose} color="error">
                    Đóng
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleOpenCancelBooking}
                    style={{ marginLeft: 10 }}
                  >
                    Hủy đặt phòng
                  </Button>
                </div>
              </React.Fragment>
            ) : null}
            <br />
            <br />
            <br />
            <br />
          </div>
        </Scrollbar>
      </Drawer>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">STT</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Loại phòng</TableCell>
                <TableCell>Số lượng phòng</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((booking, index) => {
                const created = moment(booking.createAt).format("DD/MM/YYYY");
                const statusData = getStatusButtonColor(booking.status);
                const statusText = statusData.text;

                return (
                  <TableRow hover key={booking.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking?.customer?.fullname}
                      {isNewOrder(booking) && (
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
                    <TableCell>{formatPhoneNumber(booking?.customer?.phoneNumber)}</TableCell>
                    <TableCell>{booking?.customer?.email}</TableCell>
                    <TableCell>{booking?.typeRoom?.typeRoomName}</TableCell>
                    <TableCell>{booking.numberRooms}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>
                      <SeverityPill variant="contained" color={statusData.color}>
                        {statusText}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => showDrawer(booking.id)}>
                        <InformationCircleIcon />
                      </Button>
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
