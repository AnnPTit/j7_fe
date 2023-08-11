import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Paper, TextareaAutosize } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
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
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import React, { Component } from "react";
import QrReader from "react-qr-scanner";
import { useState, useEffect } from "react";
import axios from "axios";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import NoSymbolIcon from "@heroicons/react/24/solid/NoSymbolIcon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel"; // ...
import { parse, format, subYears } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BookRoom() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query;
  const [rooms, setRooms] = useState([]);
  const [service, setService] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [floor, setFloor] = useState([]);
  const [typeRoom, setTypeRoom] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [unit, setUnit] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [customerInfo, setCustomerInfo] = useState([]);
  const [serviceUsed, setServiceUsed] = useState([]);
  const [serviceUsedTotalPrice, setServiceUsedTotalPrice] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [numberOfDays, setNumberOfDays] = useState(0); // Add this state
  const [valueTo, setValueTo] = useState(null);
  const [valueFrom, setValueFrom] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [valueTimeTo, setValueTimeTo] = useState(null);
  const [valueTimeFrom, setValueTimeFrom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [noteOrder, setNoteOrder] = useState("");
  const [noteReturnRoom, setNoteReturnRoom] = useState("");
  const [givenCustomer, setGivenCustomer] = useState(0);

  // Dialogs
  const [openSeacrhRoom, setOpenSeacrhRoom] = React.useState(false);
  const [openAddService, setOpenAddService] = React.useState(false);
  const [openDateDialog, setOpenDateDialog] = React.useState(false);
  const [openChooseCustomer, setOpenChooseCustomer] = React.useState(false);
  const [openQuantityNote, setOpenQuantityNote] = React.useState(false);
  const [openAcceptOrder, setOpenAcceptOrder] = React.useState(false);
  const [openReturnRoom, setOpenReturnRoom] = React.useState(false);

  // QR Code
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState("No result");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  // const [scannedData, setScannedData] = useState(""); // Initialize with empty string

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cccd, setCccd] = useState(""); // Initialize with an empty string or default value
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState("");

  const [order, setOrder] = useState({
    id: "",
    typeOfOrder: "",
    orderCode: "",
    status: "",
    // customer: {},
    // account: {},
  });

  const [dataForm, setDataForm] = React.useState({
    dateFrom: new Date(),
    dateTo: new Date(),
  });

  const handleFromDateChange = (newValue) => {
    setValueFrom(newValue);
    if (newValue > valueTo) {
      setValueTo(newValue);
    }

    const timeDiff = Math.abs(valueTo - newValue);
    const numberOfDays = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setNumberOfDays(numberOfDays);
  };

  const handleToDateChange = (newValue) => {
    setValueTo(newValue);
    if (newValue < valueFrom) {
      setValueFrom(newValue);
    }

    const timeDiff = Math.abs(newValue - valueFrom);
    const numberOfDays = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setNumberOfDays(numberOfDays);
  };

  const formatDate = (date) => {
    if (!date) {
      return ""; // Return an empty string for null date values
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const handleDateTimeFromChange = (newTime) => {
    setValueTimeFrom(newTime);
    if (newTime > valueTimeTo) {
      setValueTimeTo(newTime);
    }
  };

  const handleDateTimeToChange = (newTime) => {
    setValueTimeTo(newTime);
    if (newTime < valueTimeFrom) {
      setValueTimeFrom(newTime);
    }
  };

  const handleOpenSearchRoom = () => {
    setOpenSeacrhRoom(true);
  };

  const handleCloseSearchRoom = () => {
    setOpenSeacrhRoom(false);
  };

  const handleOpenAddService = () => {
    setOpenAddService(true);
  };

  const handleCloseAddService = () => {
    setOpenAddService(false);
  };

  const handleOpenDateDialog = () => {
    setOpenDateDialog(true); // Open date selection dialog
  };

  const handleOpenChooseCustomer = () => {
    setOpenChooseCustomer(true);
  };

  const handleCloseChooseCustomer = () => {
    setOpenChooseCustomer(false);
  };

  const handleOpenAcceptOrder = () => {
    setOpenAcceptOrder(true);
  };

  const handleCloseAcceptOrder = () => {
    setNoteOrder("");
    setOpenAcceptOrder(false);
  };

  const handleOpenReturnRoom = () => {
    setOpenReturnRoom(true);
  };

  const handleCloseReturnRoom = () => {
    setGivenCustomer("");
    setNoteReturnRoom("");
    setOpenReturnRoom(false);
  };

  const handleOpenQuantityNote = (serviceId) => {
    setSelectedServiceId(serviceId);
    setOpenQuantityNote(true);
  };

  const handleCloseQuantityNote = () => {
    setSelectedServiceId(null);
    setOpenQuantityNote(false);
    setQuantity("");
    setNote("");
  };

  const handleCloseDateDialog = () => {
    setValueFrom(null);
    setValueTo(null);
    setNumberOfDays(0);
    setOpenDateDialog(false);
  };

  const handleError = (err) => {
    console.error(err);
  };

  const toggleCamera = () => {
    setCameraEnabled((prevCameraEnabled) => {
      if (!prevCameraEnabled) {
        setResult(""); // Reset the result when turning off the camera
      }
      return !prevCameraEnabled;
    });
  };

  const handleScan = (data) => {
    // console.log("Scanned data:", data); // Log the entire scanned object
    if (data && data.text) {
      const scannedText = data.text; // Extract the scanned text
      console.log("Scanned text:", scannedText); // Log the extracted text
      const dataParts = scannedText.match(/^(.*?)\|\|(.+?)\|(.+?)\|(.+?)\|/);
      const cccdValue = dataParts ? dataParts[1] : "";
      const nameValue = dataParts ? dataParts[2] : "";
      const birthdateValue = dataParts ? dataParts[3] : "";
      const genderValue = dataParts ? dataParts[4] : "";
      const formattedBirthdate = `${birthdateValue.substr(0, 2)}/${birthdateValue.substr(
        2,
        2
      )}/${birthdateValue.substr(4, 4)}`;
      console.log("Ngày sinh: ", formattedBirthdate);

      setCccd(cccdValue);
      setCustomerName(nameValue);
      setGender(genderValue);
      setBirthday(formattedBirthdate);
      console.log("Ngày sinhh: ", birthday);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCccd(customer.citizenId);
    setCustomerName(customer.fullname);
    setPhoneNumber(customer.phoneNumber);
    setBirthday(format(new Date(customer.birthday), "dd/MM/yyyy"));
    setGender(customer.gender == 1 ? "Nam" : "Nữ");
    setOpenChooseCustomer(false);
  };

  const handleBirthDayChange = (date) => {
    setBirthday(date); // Update the birthday state with the selected date
  };

  const previewStyle = {
    height: 240,
    width: 320,
    transform: cameraEnabled ? "scaleX(-1)" : "none",
  };

  const handleCheckboxChange = (orderDetailId) => {
    setSelectedOrderDetails(orderDetailId);
  };

  const calculateTotalAmountPriceRoom = () => {
    let total = 0;
    orderDetailData.forEach((orderDetail) => {
      total += orderDetail.roomPrice;
    });
    return total;
  };

  const calculateTotalService = () => {
    let total = 0;
    serviceUsedTotalPrice.forEach((serviceUsed) => {
      if (serviceUsed.orderDetail.order.id === id) {
        total += serviceUsed.quantity * serviceUsed.service.price;
      }
    });
    return total;
  };

  const calculateTotalAmount = () => {
    let total = 0;
    serviceUsed.forEach((service) => {
      total += service.quantity * service.service.price;
    });
    return total;
  };

  const calculateTotal = () => {
    return calculateTotalAmountPriceRoom() + calculateTotalService();
  };

  const vatAmount = totalAmount * 0.05;
  const sumAmount = totalAmount + vatAmount;
  const moneyReturnCustomer = givenCustomer - sumAmount;

  useEffect(() => {
    const newTotal = calculateTotal();
    setTotalAmount(newTotal);
  }, [calculateTotalAmountPriceRoom, calculateTotalService]);

  const renderButtonsBasedOnStatus = () => {
    switch (order.status) {
      case 1:
        return (
          <React.Fragment>
            <button style={{ width: 100, height: 50 }} className="btn btn-outline-danger">
              Hủy
            </button>
            <button
              onClick={handleSave}
              style={{ marginLeft: 20, width: 100, height: 50 }}
              className="btn btn-outline-success"
            >
              Lưu
            </button>
            <button
              style={{
                marginLeft: 20,
                width: 150,
                height: 50,
              }}
              onClick={handleOpenAcceptOrder}
              className="btn btn-outline-primary"
            >
              Nhận phòng
            </button>
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <button style={{ width: 100, height: 50 }} className="btn btn-outline-danger">
              Hủy
            </button>
            <button
              onClick={handleSave}
              style={{ marginLeft: 20, width: 100, height: 50 }}
              className="btn btn-outline-success"
            >
              Lưu
            </button>
            <button
              style={{
                marginLeft: 20,
                width: 150,
                height: 50,
              }}
              onClick={handleOpenReturnRoom}
              className="btn btn-outline-primary"
            >
              Trả phòng
            </button>
          </React.Fragment>
        );
      case 3:
        return <React.Fragment></React.Fragment>;
      // Add more cases for other statuses if needed
      default:
        return null; // Return null to hide all buttons if the status doesn't match any case
    }
  };

  const handleConfirmOrder = async () => {
    try {
      // Make an API call to update the order status to "Đã xác nhận" (status: 2) or your desired status
      // You can use the axios.put() method for this
      await axios.put(`http://localhost:2003/api/admin/order/update-accept/${id}`, {
        note: noteOrder,
      });
      handleCloseAcceptOrder();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturnRoom = async () => {
    try {
      await axios.put(`http://localhost:2003/api/admin/order/update-return/${id}`, {
        totalMoney: sumAmount,
        vat: vatAmount,
        moneyGivenByCustomer: givenCustomer,
        excessMoney: moneyReturnCustomer,
        note: noteReturnRoom,
      });
      handleCloseReturnRoom();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    const updatedTotalMoney = calculateTotal(); // Lấy giá trị tạm tính

    const response = await axios.put(`http://localhost:2003/api/admin/order/update/${id}`, {
      totalMoney: updatedTotalMoney,
    });
    toast.success("Lưu thành công!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(response.data);
  };

  const handleConfirm = async () => {
    const serviceResponse = await axios.get(
      `http://localhost:2003/api/admin/service/detail/${selectedServiceId}`
    );
    const orderDetailResponse = await axios.get(
      `http://localhost:2003/api/order-detail/detail/${selectedOrderDetails}`
    );

    // Step 2: Create Service and OrderDetail objects
    const service = serviceResponse.data; // Assuming the API returns the service object
    const orderDetail = orderDetailResponse.data; // Assuming the API returns the orderDetail object

    const serviceUsedDTO = {
      service: service,
      orderDetail: orderDetail,
      quantity: parseInt(quantity), // Convert to number if needed
      note: note,
    };

    try {
      const response = await axios.post(
        "http://localhost:2003/api/service-used/save",
        serviceUsedDTO
      );
      setQuantity("");
      setNote("");
      setOpenQuantityNote(false);
      setOpenAddService(false);
      setServiceUsed((prevServiceUsed) => [...prevServiceUsed, response.data]);
      const newTotal = calculateTotal();
      setTotalAmount(newTotal);
      console.log("Service added to serviceUsed: ", response.data);
      toast.success("Thêm thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Error adding to service used");
    }
  };

  const handleAddCustomerToRooms = async () => {
    const genderBoolean = gender === "Nam"; // true if gender is "Nam", false if gender is "Nữ"
    const parsedBirthday = parse(birthday, "dd/MM/yyyy", new Date());

    // Format the parsed birthday to "yyyy-MM-dd" format
    const formattedBirthday = format(parsedBirthday, "yyyy-MM-dd");
    const customerInfo = {
      citizenId: cccd,
      fullname: customerName,
      gender: genderBoolean,
      birthday: formattedBirthday,
      phoneNumber: phoneNumber,
    };

    // Loop through selectedOrderDetails and add customer information
    try {
      const response = await axios.post(
        `http://localhost:2003/api/information-customer/save/${selectedOrderDetails}`,
        customerInfo
      );
      setCustomerInfo((prevCustomerInfo) => [...prevCustomerInfo, response.data]);
      toast.success("Thêm thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(
        `Information customer added to orderDetail ${selectedOrderDetails}:`,
        response.data
      );
    } catch (error) {
      console.error(
        `Error adding information customer to orderDetail ${selectedOrderDetails}:`,
        error
      );
    }
    // Clear selectedOrderDetails after adding customer information
    setCccd("");
    setCustomerName("");
    setGender("");
    setBirthday("");
    setPhoneNumber("");
  };

  useEffect(() => {
    if (selectedOrderDetails) {
      const fetchServiceUsed = async () => {
        try {
          const response = await axios.get(
            `http://localhost:2003/api/service-used/load/${selectedOrderDetails}`
          );
          setServiceUsed(response.data);
        } catch (error) {
          console.error("Error loading service used:", error);
        }
      };

      fetchServiceUsed();
    } else {
      setServiceUsed([]);
    }
  }, [selectedOrderDetails]);

  useEffect(() => {
    if (selectedOrderDetails) {
      const fetchCustomerInfo = async () => {
        try {
          const response = await axios.get(
            `http://localhost:2003/api/information-customer/load/${selectedOrderDetails}`
          );
          setCustomerInfo(response.data);
        } catch (error) {
          console.error("Error loading customer information:", error);
        }
      };

      fetchCustomerInfo();
    } else {
      setCustomerInfo([]);
    }
  }, [selectedOrderDetails]);

  // Delete Customer
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/information-customer/delete/${id}`);

      // Xóa khách hàng khỏi danh sách ngay sau khi xóa
      // Cách này giả định rằng customerInfo là danh sách khách hàng
      setCustomerInfo((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id));
      toast.success("Xóa thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteServiceUsed = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/service-used/delete/${id}`);

      // Xóa khách hàng khỏi danh sách ngay sau khi xóa
      // Cách này giả định rằng customerInfo là danh sách khách hàng
      setServiceUsed((prevServices) => prevServices.filter((serviceUsed) => serviceUsed.id !== id));
      const newTotal = calculateTotal();
      setTotalAmount(newTotal);
      toast.success("Xóa thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
        const response = await axios.get("http://localhost:2003/api/admin/room/getAllByStatus");
        setRooms(response.data); // Cập nhật danh sách phòng từ response
        // ... (các phần mã khác)
      } catch (error) {
        console.log(error);
      }
    }

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
        const response = await axios.get("http://localhost:2003/api/admin/service/getAll");
        setService(response.data); // Cập nhật danh sách phòng từ response
        // ... (các phần mã khác)
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

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
        const response = await axios.get("http://localhost:2003/api/admin/floor/getList");
        const response2 = await axios.get("http://localhost:2003/api/admin/type-room/getList");
        const response3 = await axios.get("http://localhost:2003/api/admin/service-type/getAll");
        const response4 = await axios.get("http://localhost:2003/api/admin/unit/getAll");
        const response5 = await axios.get("http://localhost:2003/api/customers/getList");
        const response6 = await axios.get("http://localhost:2003/api/service-used/load");
        console.log(response.data);
        console.log(response2.data);
        setFloor(response.data);
        setTypeRoom(response2.data);
        setServiceType(response3.data);
        setUnit(response4.data);
        setCustomer(response5.data);
        setServiceUsedTotalPrice(response6.data);
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
          alert("Bạn chưa đăng nhập");
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
    console.log("Fetching order details for ID:", id); // Add this line
    async function fetchData() {
      try {
        // ... (your code)
        const response = await axios.get(`http://localhost:2003/api/admin/order/detail/${id}`);
        console.log("Order API Response:", response.data); // Add this line
        if (response.data) {
          setOrder(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
    handleOpenDateDialog();
  };

  const [roomPricePerDay, setRoomPricePerDay] = useState(0); // Thêm state để lưu giá theo ngày của phòng

  // Trong useEffect để fetch giá theo giờ của phòng khi selectedRoomId thay đổi
  useEffect(() => {
    const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
    if (selectedRoom) {
      setRoomPricePerDay(selectedRoom.typeRoom.pricePerDay);
    }
  }, [selectedRoomId, rooms]);
  // Trong hàm handleConfirmDate
  const createOrderDetail = async () => {
    // Thực hiện xử lý khi ngày được xác nhận
    if (selectedRoomId && valueFrom && valueTo && valueTimeFrom && valueTimeTo) {
      const totalAmount = numberOfDays * roomPricePerDay;
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        const response = await axios.post("http://localhost:2003/api/order-detail/save", {
          order: { id: id },
          room: rooms.find((r) => r.id === selectedRoomId),
          checkIn: new Date(
            valueFrom.setHours(valueTimeFrom.getHours(), valueTimeFrom.getMinutes())
          ),
          checkOut: new Date(valueTo.setHours(valueTimeTo.getHours(), valueTimeTo.getMinutes())),
          roomPrice: totalAmount,
          customerQuantity: numberOfPeople,
        });

        window.location.href = `/room-service?id=${id}`;
        console.log("Phòng đã được thêm vào hóa đơn chi tiết:", response.data);
        // Đóng dialog chọn ngày
        handleCloseDateDialog();
        handleCloseSearchRoom();
      } catch (error) {
        console.log("Lỗi khi thêm phòng vào hóa đơn chi tiết:", error);
        // Xử lý lỗi nếu có
      }
    } else {
      alert("Vui lòng chọn phòng, ngày check-in/check-out và giờ check-in/check-out.");
    }
  };

  return (
    <div
      style={{
        justifyContent: "center",
        marginTop: 30,
        width: "90%", // Center the timeline container horizontally
      }}
    >
      <ToastContainer />
      <Dialog
        open={openSeacrhRoom}
        onClose={handleCloseSearchRoom}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "80%",
            maxHeight: "90%",
          },
        }}
      >
        <DialogTitle>Tìm kiếm phòng</DialogTitle>
        <DialogContent>
          <OutlinedInput
            fullWidth
            defaultValue=""
            placeholder="Tìm kiếm phòng"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
            sx={{ maxWidth: 500 }}
          />
          <br />
          <br />
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Phòng</TableCell>
                    <TableCell>Loại phòng</TableCell>
                    <TableCell>Tầng</TableCell>
                    <TableCell>Giá theo ngày</TableCell>
                    <TableCell>Giá theo giờ</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <img
                          style={{ height: 200, objectFit: "cover", width: "80%" }}
                          src={room.photoList[0].url}
                        />
                      </TableCell>
                      <TableCell>{room.roomName}</TableCell>
                      <TableCell>{room.typeRoom.typeRoomName}</TableCell>
                      <TableCell>{room.floor.floorName}</TableCell>
                      <TableCell>{formatPrice(room.typeRoom.pricePerDay)}</TableCell>
                      <TableCell>{formatPrice(room.typeRoom.pricePerHours)}</TableCell>
                      <TableCell>
                        {room.status == 1 ? "Phòng trống" : "Phòng đã được đặt"}
                      </TableCell>
                      <TableCell>
                        {room.status === 1 && ( // Kiểm tra nếu room.status là 1 thì hiển thị nút
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleRoomSelect(room.id)}
                          >
                            Chọn
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDateDialog}
        onClose={handleCloseDateDialog}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "35%",
          },
        }}
      >
        <DialogTitle>Chọn ngày check-in và check-out</DialogTitle>
        <DialogContent
          style={{
            marginTop: 15,
            // display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center content horizontally
          }}
        >
          <DatePicker
            disablePast
            label="Từ ngày"
            value={valueFrom}
            onChange={handleFromDateChange}
            renderInput={(params) => (
              <TextField
                style={{ marginRight: 25 }}
                {...params}
                inputProps={{
                  value: formatDate(valueFrom), // Format the value here
                  readOnly: true, // Prevent manual input
                }}
              />
            )}
          />
          <TimePicker
            disablePast
            label="Giờ check-in"
            value={valueTimeFrom}
            onChange={handleDateTimeFromChange}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  value: valueTimeFrom ? valueTimeFrom.toLocaleTimeString() : "",
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
            value={valueTo}
            onChange={handleToDateChange}
            renderInput={(params) => (
              <TextField
                style={{ marginRight: 25 }}
                {...params}
                inputProps={{
                  value: formatDate(valueTo), // Format the value here
                  readOnly: true, // Prevent manual input
                }}
              />
            )}
          />
          <TimePicker
            disablePast
            label="Giờ check-out"
            value={valueTimeTo}
            onChange={handleDateTimeToChange}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  value: valueTimeTo ? valueTimeTo.toLocaleTimeString() : "",
                  readOnly: true,
                }}
              />
            )}
          />
          <br />
          <br />
          <TextField
            fullWidth
            label="Sức chứa"
            variant="outlined"
            disabled
            value={
              selectedRoomId ? rooms.find((r) => r.id === selectedRoomId)?.typeRoom?.capacity : ""
            }
          />
          <br />
          <br />
          <TextField fullWidth label="Số ngày" variant="outlined" disabled value={numberOfDays} />
          <br />
          <br />
          <TextField
            fullWidth
            label="Giá"
            variant="outlined"
            disabled
            value={
              selectedRoomId
                ? formatPrice(
                    rooms.find((r) => r.id === selectedRoomId)?.typeRoom?.pricePerDay * numberOfDays
                  )
                : ""
            }
          />
          <br />
          <br />
          <TextField
            fullWidth
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            label="Số người"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDateDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={createOrderDetail} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ marginBottom: 20, height: 50, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleOpenSearchRoom} className="btn btn-primary">
          TÌM PHÒNG
        </button>
      </div>
      <Paper
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: 1150,
          marginLeft: 140, // Add the box shadow
        }}
      >
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>Phòng</TableCell>
                  <TableCell>Tầng</TableCell>
                  <TableCell>Loại phòng</TableCell>
                  <TableCell>Sức chứa</TableCell>
                  <TableCell>Ngày check-in</TableCell>
                  <TableCell>Ngày check-out</TableCell>
                  <TableCell>Thành tiền</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetailData.map((orderDetail, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedOrderDetails === orderDetail.id}
                        onChange={() => handleCheckboxChange(orderDetail.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {orderDetail.roomImages.map((imageUrl, imgIndex) => (
                        <img
                          style={{ height: 150, objectFit: "cover", width: "80%" }}
                          key={imgIndex}
                          src={imageUrl}
                          alt={`Room ${index + 1} Image ${imgIndex + 1}`}
                        />
                      ))}
                    </TableCell>
                    <TableCell>{orderDetail.room.roomName}</TableCell>
                    <TableCell>{orderDetail.room.floor.floorName}</TableCell>
                    <TableCell>{orderDetail.room.typeRoom.typeRoomName}</TableCell>
                    <TableCell>{orderDetail.room.typeRoom.capacity}</TableCell>
                    <TableCell>
                      {format(new Date(orderDetail.checkIn), "dd/MM/yyyy - HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(orderDetail.checkOut), "dd/MM/yyyy - HH:mm:ss")}
                    </TableCell>
                    <TableCell>{formatPrice(orderDetail.roomPrice)}</TableCell>
                    <TableCell>
                      <button className="btn btn-danger m-xl-2">
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <h6
              style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", color: "red" }}
            >
              Tổng tiền: {formatPrice(calculateTotalAmountPriceRoom())}
            </h6>
          </Box>
        </Scrollbar>
      </Paper>
      <div
        style={{
          marginBottom: 20,
          marginTop: 20,
          height: 50,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Dialog
          open={openQuantityNote}
          onClose={handleCloseQuantityNote}
          fullWidth
          PaperProps={{
            style: {
              maxWidth: "30%",
              maxHeight: "90%",
            },
          }}
        >
          <DialogTitle>
            {selectedServiceId !== null &&
              service.find((service) => service.id === selectedServiceId)?.serviceName}
          </DialogTitle>
          <DialogContent>
            <br />
            <TextField
              label="Số lượng"
              fullWidth
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <br />
            <br />
            <TextareaAutosize
              className="form-control"
              placeholder="Ghi chú"
              name="note"
              cols={100}
              style={{ height: 150 }}
              variant="outlined"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <button onClick={handleConfirm} className="btn btn-outline-primary">
              XÁC NHẬN
            </button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openAddService}
          onClose={handleCloseAddService}
          fullWidth
          PaperProps={{
            style: {
              maxWidth: "60%",
              maxHeight: "90%",
            },
          }}
        >
          <DialogTitle>CÁC LOẠI DỊCH VỤ</DialogTitle>
          <DialogContent>
            <OutlinedInput
              fullWidth
              defaultValue=""
              placeholder="Tìm kiếm dịch vụ"
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon color="action" fontSize="small">
                    <MagnifyingGlassIcon />
                  </SvgIcon>
                </InputAdornment>
              }
              sx={{ maxWidth: 500 }}
            />
            <br />
            <br />
            <Scrollbar>
              <Box sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên dịch vụ</TableCell>
                      <TableCell>Loại dịch vụ</TableCell>
                      <TableCell>Đơn vị tính</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {service.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.serviceName}</TableCell>
                        <TableCell>{service.serviceType.serviceTypeName}</TableCell>
                        <TableCell>{service.unit.unitName}</TableCell>
                        <TableCell>{formatPrice(service.price)}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleOpenQuantityNote(service.id)}
                            className="btn btn-outline-primary"
                          >
                            Chọn
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Scrollbar>
          </DialogContent>
        </Dialog>
        <button onClick={handleOpenAddService} className="btn btn-primary">
          THÊM DỊCH VỤ
        </button>
      </div>
      <Paper
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: 1150,
          marginLeft: 140, // Add the box shadow
        }}
      >
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên dịch vụ</TableCell>
                  <TableCell>Phòng</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Thành tiền</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceUsed.length > 0 ? (
                  serviceUsed.map((serviceUsed) => (
                    <TableRow key={serviceUsed.id}>
                      <TableCell>{serviceUsed.service.serviceName}</TableCell>
                      <TableCell>{serviceUsed.orderDetail.room.roomName}</TableCell>
                      <TableCell>{serviceUsed.quantity}</TableCell>
                      <TableCell>{serviceUsed.quantity * serviceUsed.service.price}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDeleteServiceUsed(serviceUsed.id)}
                          className="btn btn-danger m-xl-2"
                        >
                          <SvgIcon fontSize="small">
                            <TrashIcon />
                          </SvgIcon>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <div>
                        <SvgIcon style={{ fontSize: "100px" }}>
                          <NoSymbolIcon />
                        </SvgIcon>

                        <span>Không có dữ liệu.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <h6
              style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", color: "red" }}
            >
              Tổng tiền: {formatPrice(calculateTotalAmount())}
            </h6>
          </Box>
        </Scrollbar>
      </Paper>
      <Paper
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: 1150,
          marginLeft: 140, // Add the box shadow
          marginTop: 30,
        }}
      >
        <h3 style={{ display: "flex", justifyContent: "center" }}>DANH SÁCH KHÁCH HÀNG</h3>
        <hr />
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>CCCD</TableCell>
                  <TableCell>Tên khách hàng</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerInfo.length > 0 ? (
                  customerInfo.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.citizenId}</TableCell>
                      <TableCell>{customer.fullname}</TableCell>
                      <TableCell>{customer.gender == 1 ? "Nam" : "Nữ"}</TableCell>
                      <TableCell>{format(new Date(customer.birthday), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{customer.phoneNumber}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="btn btn-danger m-xl-2"
                        >
                          <SvgIcon fontSize="small">
                            <TrashIcon />
                          </SvgIcon>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <div>
                        <SvgIcon style={{ fontSize: "100px" }}>
                          <NoSymbolIcon />
                        </SvgIcon>

                        <span>Không có dữ liệu.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Paper>
      <div className="row">
        <Paper
          style={{
            flexDirection: "row", // Arrange items horizontally
            justifyContent: "space-between", // Evenly distribute the sections
            alignItems: "center",
            border: "1px solid #ccc",
            padding: "20px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 650,
            marginLeft: 150, // Add the box shadow
            marginTop: 30,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>THÔNG TIN KHÁCH HÀNG</h3>
            <button
              onClick={handleOpenChooseCustomer}
              style={{ width: 100 }}
              className="btn btn-outline-primary"
            >
              Chọn
            </button>
            <Dialog
              open={openChooseCustomer}
              onClose={handleCloseChooseCustomer}
              fullWidth
              PaperProps={{
                style: {
                  maxWidth: "60%",
                  maxHeight: "90%",
                },
              }}
            >
              <DialogTitle>Chọn khách hàng</DialogTitle>
              <DialogContent>
                <OutlinedInput
                  fullWidth
                  defaultValue=""
                  placeholder="Tìm kiếm khách hàng"
                  startAdornment={
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <MagnifyingGlassIcon />
                      </SvgIcon>
                    </InputAdornment>
                  }
                  sx={{ maxWidth: 500 }}
                />
                <br />
                <br />
                <Scrollbar>
                  <Box sx={{ minWidth: 800 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>CCCD</TableCell>
                          <TableCell>Tên khách hàng</TableCell>
                          <TableCell>Giới tính</TableCell>
                          <TableCell>Ngày sinh</TableCell>
                          <TableCell>Số điện thoại</TableCell>
                          <TableCell>Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customer.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>{customer.citizenId}</TableCell>
                            <TableCell>{customer.fullname}</TableCell>
                            <TableCell>{customer.gender == 1 ? "Nam" : "Nữ"}</TableCell>
                            <TableCell>
                              {format(new Date(customer.birthday), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>{customer.phoneNumber}</TableCell>
                            <TableCell>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleCustomerSelect(customer)}
                              >
                                Chọn
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Scrollbar>
              </DialogContent>
            </Dialog>
          </div>
          <hr />
          <div>
            <div>
              <TextField
                style={{ width: 290, marginRight: 20 }}
                label="CCCD"
                variant="outlined"
                value={cccd || ""}
                onChange={(e) => setCccd(e.target.value)}
              />
              <TextField
                style={{ width: 290 }}
                label="Tên khách hàng"
                variant="outlined"
                value={customerName || ""}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <br />
            <div>
              <TextField
                style={{ width: 290, marginRight: 20 }}
                label="Số điện thoại"
                variant="outlined"
                value={phoneNumber || ""}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <DatePicker
                maxDate={subYears(new Date(), 18)}
                label="Ngày sinh"
                value={birthday || ""}
                onChange={handleBirthDayChange}
                renderInput={(params) => (
                  <TextField
                    style={{ width: 290 }}
                    {...params}
                    inputProps={{
                      value: birthday || "",
                      readOnly: true, // Prevent manual input
                    }}
                  />
                )}
              />
            </div>
            <br />
            <br />
            <FormControl style={{ width: 600, display: "flex", justifyContent: "center" }}>
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{ width: 200, height: 50 }}
                className="btn btn-outline-success"
                onClick={handleAddCustomerToRooms}
              >
                Thêm khách hàng
              </button>
            </div>
          </div>
        </Paper>
        <Paper
          style={{
            height: 400,
            border: "1px solid #ccc",
            padding: "20px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 400,
            marginLeft: 89,
            marginTop: 30,
          }}
        >
          {cameraEnabled ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <QrReader
                delay={delay}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
              />
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>Camera is disabled.</div>
          )}
          <p>{result}</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="btn btn-outline-primary" onClick={toggleCamera}>
              {cameraEnabled ? "Disable Camera" : "Enable Camera"}
            </button>
          </div>
        </Paper>
        <div
          style={{
            marginTop: 20,
            marginBottom: 30,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <h6 style={{ marginTop: 20, marginRight: 350, color: "red" }}>
            <span style={{ marginRight: 30 }}>TẠM TÍNH: {formatPrice(totalAmount)}</span>
            VAT: {formatPrice(vatAmount)}
          </h6>
          {renderButtonsBasedOnStatus()}
          <Dialog open={openAcceptOrder} onClose={handleCloseAcceptOrder} maxWidth="md">
            <DialogTitle>Xác nhận khách hàng nhận phòng</DialogTitle>
            <DialogContent>
              <TextareaAutosize
                className="form-control"
                placeholder="Ghi chú"
                name="note"
                cols={100}
                style={{ height: 150 }}
                variant="outlined"
                value={noteOrder}
                onChange={(e) => setNoteOrder(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmOrder}>Xác nhận</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openReturnRoom} onClose={handleCloseReturnRoom} maxWidth="md">
            <DialogTitle>XÁC NHẬN THANH TOÁN</DialogTitle>
            <DialogContent>
              <br />
              <div style={{ display: "flex" }}>
                <br />
                <TextField
                  style={{ width: 520, marginRight: 30 }}
                  disabled
                  label="Số tiền"
                  value={totalAmount}
                  fullWidth
                  variant="outlined"
                />
                <br />
                <br />
                <TextField
                  style={{ width: 550 }}
                  disabled
                  label="VAT"
                  value={vatAmount}
                  fullWidth
                  variant="outlined"
                />
              </div>
              <br />
              <TextField
                disabled
                label="Tổng tiền"
                value={sumAmount}
                fullWidth
                variant="outlined"
              />
              <br />
              <br />
              <TextField
                label="Khách hàng trả"
                value={givenCustomer}
                onChange={(e) => setGivenCustomer(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <br />
              <br />
              <TextField
                disabled
                label="Tiền trả lại"
                value={givenCustomer - sumAmount}
                fullWidth
                variant="outlined"
              />
              <br />
              <br />
              <TextareaAutosize
                className="form-control"
                placeholder="Ghi chú"
                name="note"
                value={noteReturnRoom}
                onChange={(e) => setNoteReturnRoom(e.target.value)}
                cols={80}
                style={{ height: 150 }}
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <button onClick={handleReturnRoom} className="btn btn-outline-primary">
                TIỀN MẶT
              </button>
              <button className="btn btn-outline-danger">CHUYỂN KHOẢN</button>
            </DialogActions>
            <br />
          </Dialog>
        </div>
      </div>
    </div>
  );
}

BookRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookRoom;