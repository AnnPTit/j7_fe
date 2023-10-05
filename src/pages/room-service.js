import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Box,
  TextareaAutosize,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
  TextField,
  OutlinedInput,
  InputAdornment,
  Checkbox,
  Select,
  InputLabel,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Scrollbar } from "src/components/scrollbar";
import React from "react";
import QrReader from "react-qr-scanner";
import { useState, useEffect } from "react";
import axios from "axios";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel"; // ...
import { parse, format, subYears } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoomSearch } from "src/sections/room/room-search";
import RoomFilter from "src/sections/room/room-filter";
import PriceRangeSlider from "src/sections/room/price-slider";
import { SeverityPill } from "src/components/severity-pill";
function BookRoom() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query;
  const [order, setOrder] = useState({
    id: "",
    typeOfOrder: "",
    orderCode: "",
    status: "",
    // customer: {},
    // account: {},
  });
  const [rooms, setRooms] = useState([]);
  const [service, setService] = useState([]);
  const [combo, setCombo] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [customerOrder, setCustomerOrder] = useState([]);
  const [customerOrderDetail, setCustomerOrderDetail] = useState([]);
  const [floor, setFloor] = useState([]);
  const [typeRoom, setTypeRoom] = useState([]);
  const [floorChose, setFloorChose] = useState("");
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [serviceType, setServiceType] = useState([]);
  const [unit, setUnit] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedComboId, setSelectedComboId] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [quantityCombo, setQuantityCombo] = useState("");
  const [noteCombo, setNoteCombo] = useState("");
  const [customerInfo, setCustomerInfo] = useState([]);
  const [infoCustomer, setInfoCustomer] = useState([]);
  const [serviceUsed, setServiceUsed] = useState([]);
  const [comboUsed, setComboUsed] = useState([]);
  const [serviceUsedTotalPrice, setServiceUsedTotalPrice] = useState([]);
  const [comboUsedTotalPrice, setComboUsedTotalPrice] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [numberOfDays, setNumberOfDays] = useState(0); // Add this state
  const [valueTo, setValueTo] = useState(null);
  const [valueFrom, setValueFrom] = useState(new Date());
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [valueTimeTo, setValueTimeTo] = useState(null);
  const [valueTimeFrom, setValueTimeFrom] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState(0);
  const [noteOrder, setNoteOrder] = useState("");
  const [noteReturnRoom, setNoteReturnRoom] = useState("");
  const [noteReturnOneRoom, setNoteReturnOneRoom] = useState("");
  const [noteCancelRoom, setNoteCancelRoom] = useState("");
  const [givenCustomer, setGivenCustomer] = useState(0);
  const [givenCustomerOneRoom, setGivenCustomerOneRoom] = useState(0);
  const [textSearch, setTextSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [roomPricePerDay, setRoomPricePerDay] = useState(0); // Thêm state để lưu giá theo ngày của phòng
  const [activeTab, setActiveTab] = useState("1");
  const [selectedCustomerAccept, setSelectedCustomerAccept] = useState("");
  const [selectedCustomerReturn, setSelectedCustomerReturn] = useState("");

  // Dialogs
  const [openSeacrhRoom, setOpenSeacrhRoom] = React.useState(false);
  const [openAddService, setOpenAddService] = React.useState(false);
  const [openAddCombo, setOpenAddCombo] = React.useState(false);
  const [openDateDialog, setOpenDateDialog] = React.useState(false);
  const [openChooseCustomer, setOpenChooseCustomer] = React.useState(false);
  const [openQuantityNote, setOpenQuantityNote] = React.useState(false);
  const [openQuantityNoteCombo, setOpenQuantityNoteCombo] = React.useState(false);
  const [openAcceptOrder, setOpenAcceptOrder] = React.useState(false);
  const [openReturnRoom, setOpenReturnRoom] = React.useState(false);
  const [openCancelRoom, setOpenCancelRoom] = React.useState(false);
  const [openReturnOneRoom, setOpenReturnOneRoom] = React.useState(false);

  // QR Code
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cccd, setCccd] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState("Nam");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Xử lí handle các hàm
  const handleChange = (event, newValue) => {
    setActiveTab(newValue.toString());
  };

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
      return "";
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
  };

  const handleOpenSearchRoom = () => {
    setOpenSeacrhRoom(true);
  };

  const handleCloseSearchRoom = () => {
    setOpenSeacrhRoom(false);
    setTextSearch("");
    setFloorChose("");
    setTypeRoomChose("");
    setPriceRange([0, 3000000]);
  };

  const handleOpenAddService = () => {
    setOpenAddService(true);
  };

  const handleCloseAddService = () => {
    setOpenAddService(false);
  };

  const handleOpenAddCombo = () => {
    setOpenAddCombo(true);
  };

  const handleCloseAddCombo = () => {
    setOpenAddCombo(false);
  };

  const handleOpenDateDialog = () => {
    setOpenDateDialog(true);
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

  const handleOpenReturnOneRoom = (orderDetailId) => {
    if (!selectedOrderDetails) {
      toast.error("Vui lòng chọn phòng trước khi trả phòng!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    setOpenReturnOneRoom(true);
    setAnchorEl(null);
  };

  const handleCloseReturnOneRoom = () => {
    setGivenCustomerOneRoom("");
    setNoteReturnOneRoom("");
    setOpenReturnOneRoom(false);
  };

  const handleOpenCancelOrder = () => {
    setOpenCancelRoom(true);
  };

  const handleCloseCancelOrder = () => {
    setNoteCancelRoom("");
    setOpenCancelRoom(false);
  };

  const handleOpenQuantityNoteCombo = (comboId) => {
    setSelectedComboId(comboId);
    setOpenQuantityNoteCombo(true);
  };

  const handleCloseQuantityNoteCombo = () => {
    setSelectedComboId(null);
    setOpenQuantityNoteCombo(false);
    setQuantityCombo("");
    setNoteCombo("");
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
    setValueFrom(new Date());
    setValueTimeFrom(new Date());
    setValueTo(null);
    setValueTimeTo(null);
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
    if (data && data.text) {
      const scannedText = data.text;
      const dataParts = scannedText.split("|");

      if (dataParts.length === 6) {
        const cccdValue = dataParts[0];
        const nameValue = dataParts[2];
        const birthdateValue = dataParts[3];
        const genderValue = dataParts[4];
        const formattedBirthdate = `${birthdateValue.substr(0, 2)}/${birthdateValue.substr(
          2,
          2
        )}/${birthdateValue.substr(4, 4)}`;

        setCccd(cccdValue);
        setCustomerName(nameValue);
        setGender(genderValue);
        setBirthday(formattedBirthdate);
      } else if (dataParts.length === 7) {
        const cccdValue = dataParts[0];
        const nameValue = dataParts[2];
        const birthdateValue = dataParts[3];
        const genderValue = dataParts[4];
        const formattedBirthdate = `${birthdateValue.substr(0, 2)}/${birthdateValue.substr(
          2,
          2
        )}/${birthdateValue.substr(4, 4)}`;

        setCccd(cccdValue);
        setCustomerName(nameValue);
        setGender(genderValue);
        setBirthday(formattedBirthdate);
      } else {
        console.log("Lỗi khi quét QR CCCD:", dataParts.length);
      }
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
    const formattedDate = format(date, "dd/MM/yyyy");
    setBirthday(formattedDate);
  };

  const previewStyle = {
    height: 240,
    width: 320,
    transform: cameraEnabled ? "scaleX(-1)" : "none",
  };

  const handleCheckboxChange = (orderDetailId) => {
    if (selectedOrderDetails === orderDetailId) {
      setSelectedOrderDetails(null); // Bỏ chọn nếu đang chọn lại cùng phòng
    } else {
      setSelectedOrderDetails(orderDetailId); // Chọn phòng mới
    }
  };

  const calculateTotalCostForOrderDetail = (orderDetailId) => {
    let totalComboCost = 0;
    let totalServiceCost = 0;
    let totalRoomCost = 0;

    // Tìm orderDetail cụ thể dựa trên orderDetailId
    const orderDetail = orderDetailData.find((detail) => detail.id === orderDetailId);

    if (orderDetail) {
      orderDetail.comboUsedList.forEach((comboUsed) => {
        totalComboCost += comboUsed.combo.price * comboUsed.quantity;
      });

      orderDetail.serviceUsedList.forEach((serviceUsed) => {
        totalServiceCost += serviceUsed.service.price * serviceUsed.quantity;
      });

      totalRoomCost = orderDetail.roomPrice;

      const total = totalComboCost + totalServiceCost + totalRoomCost;
      return total;
    }

    return 0;
  };

  // Sử dụng hàm calculateTotalCostForOrderDetail để tính tổng tiền cho orderDetail có id tương ứng
  const totalCostForOrderDetail = calculateTotalCostForOrderDetail(selectedOrderDetails);
  const [totalPriceRoom, setTotalPriceRoom] = useState(0);
  const [totalPriceCombo, setTotalPriceCombo] = useState(0);
  const [totalPriceService, setTotalPriceService] = useState(0);

  const calculateTotalAmountPriceRoom = () => {
    let total = 0;
    orderDetailData.forEach((orderDetail) => {
      total += orderDetail.roomPrice;
    });
    return total;
  };

  const calculateTotalCombo = () => {
    let total = 0;
    comboUsedTotalPrice.forEach((comboUsed) => {
      if (comboUsed.orderDetail.order.id === id) {
        total += comboUsed.quantity * comboUsed.combo.price;
      }
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

  const calculateTotalAmountCombo = () => {
    let total = 0;
    comboUsed.forEach((comboUsed) => {
      total += comboUsed.quantity * comboUsed.combo.price;
    });
    return total;
  };

  const calculateTotalAmount = () => {
    let total = 0;
    serviceUsed.forEach((serviceUsed) => {
      total += serviceUsed.quantity * serviceUsed.service.price;
    });
    return total;
  };

  const calculateTotal = () => {
    return calculateTotalAmountPriceRoom() + calculateTotalService() + calculateTotalCombo();
  };

  const vatOrderDetail = totalCostForOrderDetail * 0.05;
  const sumOrderDetail = totalCostForOrderDetail + vatOrderDetail;
  const moneyReturnCustomerOneRoom = givenCustomerOneRoom - sumOrderDetail;
  const vatAmount = totalAmount * 0.05;
  const sumAmount = totalAmount + vatAmount;
  const moneyReturnCustomer = givenCustomer - sumAmount;

  useEffect(() => {
    const newTotal = calculateTotal();
    setTotalAmount(newTotal);
  }, [calculateTotalAmountPriceRoom(), calculateTotalService(), calculateTotalCombo()]);

  const renderButtonsBasedOnStatus = () => {
    switch (order.status) {
      case 1:
        return (
          <React.Fragment>
            <button
              style={{ width: 100, height: 50 }}
              onClick={handleOpenCancelOrder}
              className="btn btn-outline-danger"
            >
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

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 0:
        return { color: "error", text: "Phòng chưa hoạt động" };
      case 1:
        return { color: "success", text: "Phòng trống" };
      case 2:
        return { color: "warning", text: "Phòng đặt tại quầy" };
      case 3:
        return { color: "success", text: "Phòng đặt qua website" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };

  // Xác nhận phòng
  const handleConfirmOrder = async () => {
    if (orderDetailData.length == 0) {
      toast.error("Chưa chọn phòng!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!selectedCustomerAccept) {
      toast.error("Chưa chọn khách hàng!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    // {orderDetailData.map((orderDetailData) => {
    //   if (orderDetailData.informationCustomerList.length == 0) {
    //     toast.error("Có phòng chưa có khách ở!", {
    //       position: toast.POSITION.BOTTOM_RIGHT,
    //     });
    //     return;
    //   }
    // })}

    if (infoCustomer.length == 0) {
      toast.error("Phòng chưa có khách ở!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      // Make an API call to update the order status to "Đã xác nhận" (status: 2)
      await axios.put(`http://localhost:2003/api/admin/order/update-accept/${id}`, {
        customerId: selectedCustomerAccept,
        totalMoney: sumAmount,
        vat: vatAmount,
        note: noteOrder,
      });
      setOrder({ ...order, status: 2 });
      handleCloseAcceptOrder();
      toast.success("Nhận phòng thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      router.push(`/orders?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  //Trả 1 phòng
  const handleReturnOneRoom = async () => {
    if (!givenCustomerOneRoom || givenCustomerOneRoom < sumOrderDetail) {
      toast.error("Số tiền khách trả không hợp lệ!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!selectedCustomerReturn) {
      toast.error("Chưa chọn khách hàng!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:2003/api/admin/order/return/${selectedOrderDetails}`,
        {
          customerId: selectedCustomerReturn,
          totalMoney: sumOrderDetail,
          vat: vatOrderDetail,
          moneyGivenByCustomer: givenCustomerOneRoom,
          excessMoney: moneyReturnCustomerOneRoom,
          note: noteReturnOneRoom,
        }
      );
      const orderId = response.data.id;
      handleCloseReturnOneRoom();
      toast.success("Trả phòng thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      router.push(`/orders?id=${orderId}`);
    } catch (error) {
      console.log(error);
    }
  };

  //Trả phòng
  const handleReturnRoom = async () => {
    if (!givenCustomer || givenCustomer < sumAmount) {
      // Xử lý khi tiền khách trả không hợp lệ, ví dụ: hiển thị thông báo lỗi
      toast.error("Số tiền khách trả không hợp lệ!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    try {
      await axios.put(`http://localhost:2003/api/admin/order/update-return/${id}`, {
        totalMoney: sumAmount,
        vat: vatAmount,
        moneyGivenByCustomer: givenCustomer,
        excessMoney: moneyReturnCustomer,
        note: noteReturnRoom,
      });
      setOrder({ ...order, status: 3 });
      handleCloseReturnRoom();
      toast.success("Trả phòng thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      router.push(`/orders?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // Hủy hóa đơn
  const handleCancelOrder = async () => {
    try {
      // Make an API call to update the order status to "Đã xác nhận" (status: 2)
      await axios.put(`http://localhost:2003/api/admin/order/delete/${id}`, {
        note: noteOrder,
      });
      setOrder({ ...order, status: 0 });
      handleCloseAcceptOrder();
      toast.success("Hủy thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      router.push(`/orders?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    // const updatedTotalMoney = calculateTotal(); // Lấy giá trị tạm tính
    const response = await axios.put(`http://localhost:2003/api/admin/order/update/${id}`, {
      totalMoney: sumAmount,
    });
    toast.success("Lưu thành công!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    router.push(`/room-service?id=${id}`);
    console.log(response.data);
  };

  // Thêm combo
  const handleConfirmCombo = async () => {
    if (!selectedOrderDetails) {
      toast.error("Vui lòng chọn phòng trước khi thêm combo!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    const comboResponse = await axios.get(
      `http://localhost:2003/api/admin/combo/detail/${selectedComboId}`
    );
    const orderDetailResponse = await axios.get(
      `http://localhost:2003/api/order-detail/detail/${selectedOrderDetails}`
    );

    // Step 2: Create Service and OrderDetail objects
    const combo = comboResponse.data; // Assuming the API returns the service object
    const orderDetail = orderDetailResponse.data; // Assuming the API returns the orderDetail object

    const comboUsedDTO = {
      combo: combo,
      orderDetail: orderDetail,
      quantity: parseInt(quantityCombo), // Convert to number if needed
      note: noteCombo,
    };

    if (!quantityCombo) {
      toast.error("Vui lòng không để trống số lượng!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:2003/api/combo-used/save", comboUsedDTO);
      setQuantityCombo("");
      setNoteCombo("");
      setOpenQuantityNoteCombo(false);
      setOpenAddCombo(false);
      setOpenAddService(false);
      setComboUsed(response.data);
      // const newTotal = calculateTotal();
      // setTotalAmount(newTotal);
      console.log("Combo added to comboUsed: ", response.data);
      toast.success("Thêm thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      window.location.href = `/room-service?id=${id}`;
    } catch (error) {
      console.error("Error adding to combo used");
    }
  };

  // Thêm dịch vụ
  const handleConfirm = async () => {
    if (!selectedOrderDetails) {
      toast.error("Vui lòng chọn phòng trước khi thêm dịch vụ!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

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

    if (!quantity) {
      toast.error("Vui lòng không để trống số lượng!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:2003/api/service-used/save",
        serviceUsedDTO
      );
      setQuantity("");
      setNote("");
      setOpenQuantityNote(false);
      setOpenAddService(false);
      setServiceUsed(response.data);
      const newTotal = calculateTotal();
      setTotalAmount(newTotal);
      console.log("Service added to serviceUsed: ", response.data);
      toast.success("Thêm thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      window.location.href = `/room-service?id=${id}`;
    } catch (error) {
      console.error("Error adding to service used");
    }
  };

  // Thêm khách hàng cho từng phòng
  const handleAddCustomerToRooms = async () => {
    if (!selectedOrderDetails) {
      toast.error("Vui lòng chọn phòng trước khi thêm thông tin khách hàng!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    if (!cccd || !customerName || !birthday || !phoneNumber) {
      toast.error("Vui lòng điền đầy đủ thông tin khách hàng!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    } else if (!/^\d+$/.test(cccd)) {
      toast.error("CCCD chỉ được chứa ký tự số!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    } else if (!/^[0]\d{11}$/.test(cccd)) {
      toast.error("CCCD phải bắt đầu bằng số 0 và có đúng 12 số!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    } else if (!/^\d+$/.test(phoneNumber)) {
      toast.error("Số điện thoại chỉ được chứa ký tự số!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    } else if (!/^[0]\d{9}$/.test(phoneNumber)) {
      toast.error("Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 số!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    const isCustomer = customerInfo.some((customer) => customer.citizenId === cccd);
    if (isCustomer) {
      toast.error("Khách hàng đã tồn tại trong danh sách của phòng này!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    console.log("List: ", orderDetailData);
    const isCustomerAdded = orderDetailData.some((orderDetail) => {
      // Kiểm tra xem orderDetail và customerInfo có tồn tại
      if (orderDetail && orderDetail.informationCustomerList) {
        return orderDetail.informationCustomerList.some((customer) => customer.citizenId === cccd);
      }
      return false; // Trường hợp nếu orderDetail hoặc customerInfo không tồn tại
    });

    if (isCustomerAdded) {
      toast.error("Khách hàng đã có mặt trong 1 phòng khác!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    const selectedOrderDetail = orderDetailData.find(
      (detail) => detail.id === selectedOrderDetails
    );
    console.log(selectedOrderDetail);
    // const { room } = selectedOrderDetail;

    if (customerInfo.length >= selectedOrderDetail.customerQuantity) {
      toast.error("Sức chứa của phòng đã đầy, không thể thêm khách hàng mới!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    const genderBoolean = gender === "Nam"; // true if gender is "Nam", false if gender is "Nữ"
    const parsedBirthday = parse(birthday, "dd/MM/yyyy", new Date());

    const formattedBirthday = format(parsedBirthday, "yyyy-MM-dd");
    const customerInfor = {
      citizenId: cccd,
      fullname: customerName,
      gender: genderBoolean,
      birthday: formattedBirthday,
      phoneNumber: phoneNumber,
    };

    try {
      const response = await axios.post(
        `http://localhost:2003/api/information-customer/save/${selectedOrderDetails}`,
        customerInfor
      );
      setCustomerInfo(response.data);
      window.location.href = `/room-service?id=${id}`;
      toast.success("Thêm thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(
        `Information customer added to orderDetail ${selectedOrderDetails}:`,
        response.data
      );
    } catch (error) {
      if (error.response) {
        // Xử lý response lỗi
        if (error.response.status === 403) {
          alert("Bạn không có quyền truy cập vào trang này");
          window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
        } else if (error.response.status === 400) {
          console.log(error.response.data);
        }
      }
    }
    setCccd("");
    setCustomerName("");
    setGender("Nam");
    setBirthday("");
    setPhoneNumber("");
  };

  // Load combo sử dụng khi tích vào từng phòng
  useEffect(() => {
    if (selectedOrderDetails) {
      const fetchComboUsed = async () => {
        try {
          const response = await axios.get(
            `http://localhost:2003/api/combo-used/load/${selectedOrderDetails}`
          );
          setComboUsed(response.data);
        } catch (error) {
          console.error("Error loading combo used:", error);
        }
      };
      fetchComboUsed();
    } else {
      setComboUsed([]);
    }
  }, [selectedOrderDetails]);

  // Load dịch vụ sử dụng khi tích vào từng phòng
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

  // Load thông tin khách hàng khi tích vào từng phòng
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

  // Xóa thông tin khách hàng
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/information-customer/delete/${id}`);

      // Xóa khách hàng khỏi danh sách ngay sau khi xóa
      setCustomerInfo((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id));
      toast.success("Xóa thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Xóa combo sử dụng
  const handleDeleteComboUsed = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/combo-used/delete/${id}`);
      // Xóa khách hàng khỏi danh sách ngay sau khi xóa
      setComboUsed((prevCombos) => prevCombos.filter((comboUsed) => comboUsed.id !== id));
      // const newTotal = calculateTotalAmountPriceRoom() + calculateTotalService();
      // setTotalAmount(newTotal);
      toast.success("Xóa thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Xóa dịch vụ sử dụng
  const handleDeleteServiceUsed = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/service-used/delete/${id}`);

      // Xóa khách hàng khỏi danh sách ngay sau khi xóa
      setServiceUsed((prevServices) => prevServices.filter((serviceUsed) => serviceUsed.id !== id));
      // const newTotal = calculateTotalAmountPriceRoom() + calculateTotalService();
      // setTotalAmount(newTotal);
      toast.success("Xóa thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Xóa phòng
  const handleDeleteRoom = async (orderDetailid) => {
    try {
      await axios.put(`http://localhost:2003/api/order-detail/delete/${orderDetailid}`);

      // Xóa khách hàng khỏi danh sách ngay sau khi xóa
      // setOrderDetailData((prevOrderDetail) =>
      //   prevOrderDetail.filter((orderDetailData) => orderDetailData.id !== id)
      // );
      // router.push(`/room-service?id=${id}`);
      window.location.href = `/room-service?id=${id}`;
      // const newTotal = calculateTotalAmountPriceRoom() + calculateTotalService();
      // setTotalAmount(newTotal);
      toast.success("Xóa thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setAnchorEl(null);
    } catch (error) {
      console.log(error);
    }
  };

  // Load phòng
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
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  // Load combo
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
        const response = await axios.get("http://localhost:2003/api/admin/combo/getAll");
        setCombo(response.data); // Cập nhật danh sách phòng từ response
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  // Load dịch vụ
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
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  // Load
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
        const response5 = await axios.get("http://localhost:2003/api/admin/customer/getAll");
        const response6 = await axios.get("http://localhost:2003/api/service-used/load");
        const response7 = await axios.get("http://localhost:2003/api/combo-used/load");
        const response8 = await axios.get(
          `http://localhost:2003/api/admin/customer/getAllByOrderId/${id}`
        );
        const response9 = await axios.get("http://localhost:2003/api/information-customer/load");
        const response10 = await axios.get(
          `http://localhost:2003/api/admin/customer/getAllByOrderDetailId/${selectedOrderDetails}`
        );
        console.log(response.data);
        setFloor(response.data);
        setTypeRoom(response2.data);
        setServiceType(response3.data);
        setUnit(response4.data);
        setCustomer(response5.data);
        setServiceUsedTotalPrice(response6.data);
        setComboUsedTotalPrice(response7.data);
        setCustomerOrder(response8.data);
        setInfoCustomer(response9.data);
        setCustomerOrderDetail(response10.data);
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  // Load hóa đơn chi tiết theo id hóa đơn
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

  // Load hóa đơn theo id
  useEffect(() => {
    console.log("Fetching order details for ID:", id); // Add this line
    async function fetchData() {
      try {
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

  // Trong useEffect để fetch giá theo ngày của phòng khi selectedRoomId thay đổi
  useEffect(() => {
    const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
    if (selectedRoom) {
      setRoomPricePerDay(selectedRoom.typeRoom.pricePerDay);
    }
  }, [selectedRoomId, rooms]);

  // Tạo phòng
  const createOrderDetail = async () => {
    // Thực hiện xử lý khi ngày được xác nhận
    if (selectedRoomId && valueFrom && valueTo && valueTimeFrom && valueTimeTo) {
      if (numberOfPeople < 1) {
        toast.error("Số người lớn hơn 0!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return false;
      }

      if (numberOfPeople > rooms.find((r) => r.id === selectedRoomId)?.typeRoom?.capacity) {
        toast.error("Số người không được vượt quá sức chứa!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return false;
      }
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
        toast.success("Thêm phòng thành công!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        console.log("Phòng đã được thêm vào hóa đơn chi tiết:", response.data);
        // Đóng dialog chọn ngày
        handleCloseDateDialog();
        handleCloseSearchRoom();
      } catch (error) {
        console.log("Lỗi khi thêm phòng vào hóa đơn chi tiết:", error);
        // Xử lý lỗi nếu có
      }
    } else {
      toast.warning("Vui lòng ngày check-in/check-out và giờ check-in/check-out.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return false;
    }
  };

  // Load and search book room
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // console.log(accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

        let Api = `http://localhost:2003/api/admin/room/loadAndSearchBookRoom`;
        // Add search text parameter only if there's a search text entered
        let hasQueryParams = false;

        // Construct the API URL based on the selected options
        if (textSearch !== "") {
          Api += `?key=${textSearch}`;
          hasQueryParams = true;
        }
        if (floorChose !== "") {
          Api += hasQueryParams ? `&floorId=${floorChose}` : `?floorId=${floorChose}`;
          hasQueryParams = true;
        }
        if (typeRoomChose !== "") {
          Api += hasQueryParams ? `&typeRoomId=${typeRoomChose}` : `?typeRoomId=${typeRoomChose}`;
          hasQueryParams = true;
        }
        if (priceRange.length !== 0) {
          Api += hasQueryParams
            ? `&start=${priceRange[0]}&end=${priceRange[1]}`
            : `?start=${priceRange[0]}&end=${priceRange[1]}`;
          hasQueryParams = true;
        }
        // console.warn(Api);
        setIsLoading(true);
        const response = await axios.get(Api); // Thay đổi URL API của bạn tại đây
        setRooms(response.data);
        setIsLoading(false);
      } catch (error) {
        if (error.response) {
          // Xử lý response lỗi
          if (error.response.status === 403) {
            alert("Bạn không có quyền truy cập vào trang này");
            window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
          } else {
            alert("Có lỗi xảy ra trong quá trình gọi API");
          }
        } else {
          console.log("Không thể kết nối đến API");
        }
      }
    };

    fetchData();
  }, [textSearch, floorChose, typeRoomChose, priceRange]);

  // Tạo phương phức thanh toán quá Bank
  const createPayment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:2003/api/payment-method/payment-vnpay/${id}`
      );
      const { finalUrl } = response.data;
      // Redirect the user to the payment page
      window.location.href = finalUrl;
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const createPaymentMomo = async () => {
    try {
      const response = await axios.post(
        `http://localhost:2003/api/payment-method/payment-momo/${id}`
      );
      console.log("MomoUrl: ", response.data);
      window.location.href = response.data.payUrl;
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const createPaymentZaloPay = async () => {
    try {
      const response = await axios.post(
        `http://localhost:2003/api/payment-method/payment-zalo/${id}`
      );
      console.log("ZaloPayUrl: ", response.data);
      // Redirect to the payment page
      window.location.href = response.data.orderurl;
    } catch (error) {
      console.error("Error creating payment:", error);
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
      <Head>
        <title>Đặt phòng tại quầy | Armani Hotel</title>
      </Head>
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
          <RoomSearch textSearch={textSearch} setTextSearch={setTextSearch} />
          <div style={{ display: "flex", marginTop: 10, alignItems: "center" }}>
            <div>
              <RoomFilter
                floor={floor}
                typeRoom={typeRoom}
                floorChose={floorChose}
                typeRoomChose={typeRoomChose}
                setFloorChose={setFloorChose}
                setTypeRoomChose={setTypeRoomChose}
              />
            </div>
            <div
              style={{
                marginLeft: 100,
                width: 260,
              }}
            >
              <PriceRangeSlider priceRange={priceRange} setPriceRange={setPriceRange} />
            </div>
          </div>
          <br />
          <br />
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Mã phòng</TableCell>
                    <TableCell>Phòng</TableCell>
                    <TableCell>Loại phòng</TableCell>
                    <TableCell>Tầng</TableCell>
                    <TableCell>Giá theo ngày</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((room, index) => {
                    const statusData = getStatusButtonColor(room.status);
                    const statusText = statusData.text;
                    return (
                      <TableRow key={room.id}>
                        <TableCell padding="checkbox">
                          <div key={index}>
                            <span>{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <img
                            style={{ height: 200, objectFit: "cover", width: "80%" }}
                            src={room.photoList[0].url}
                          />
                        </TableCell>
                        <TableCell>{room.roomCode}</TableCell>
                        <TableCell>{room.roomName}</TableCell>
                        <TableCell>{room.typeRoom.typeRoomName}</TableCell>
                        <TableCell>{room.floor.floorName}</TableCell>
                        <TableCell>{formatPrice(room.typeRoom.pricePerDay)}</TableCell>
                        <TableCell>
                          <SeverityPill variant="contained" color={statusData.color}>
                            {statusText}
                          </SeverityPill>
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
                    );
                  })}
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
            disabled
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
            disabled
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
        {order.status === 1 || order.status === 2 ? (
          <button onClick={handleOpenSearchRoom} className="btn btn-primary">
            TÌM PHÒNG
          </button>
        ) : null}
      </div>
      <Box
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
                  <TableCell>
                    {order.status === 1 || order.status === 2 ? <>Thao tác</> : null}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetailData.map((orderDetail, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrderDetails === orderDetail.id}
                        onChange={() => handleCheckboxChange(orderDetail.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {orderDetail.roomImages.length > 0 && ( // Kiểm tra xem có hình ảnh nào trong mảng không
                        <img
                          style={{ objectFit: "cover", width: "100%" }}
                          src={orderDetail.roomImages[0]} // Hiển thị chỉ hình ảnh đầu tiên
                          alt={`Room ${index + 1} Image 1`} // Ví dụ: Room 1 Image 1
                        />
                      )}
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
                      {order.status === 1 ? (
                        <>
                          <Button
                            className="btn btn-primary m-xl-2"
                            id="demo-positioned-button"
                            aria-controls={open ? "demo-positioned-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                          >
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </Button>
                          <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
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
                            <MenuItem onClick={handleClose}>Chuyển phòng</MenuItem>
                            <MenuItem onClick={() => handleDeleteRoom(orderDetail.id)}>
                              Hủy phòng
                            </MenuItem>
                          </Menu>
                        </>
                      ) : null}
                      {order.status === 2 ? (
                        <>
                          <Button
                            className="btn btn-primary m-xl-2"
                            id="demo-positioned-button"
                            aria-controls={open ? "demo-positioned-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                          >
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </Button>
                          <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
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
                            <MenuItem onClick={handleClose}>Chuyển phòng</MenuItem>
                            {orderDetailData.length > 1 && (
                              <MenuItem onClick={() => handleOpenReturnOneRoom(orderDetail.id)}>
                                Trả phòng
                              </MenuItem>
                            )}
                          </Menu>
                        </>
                      ) : null}
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
      </Box>
      <Dialog open={openReturnOneRoom} onClose={handleCloseReturnOneRoom} maxWidth="md">
        <DialogTitle>XÁC NHẬN THANH TOÁN</DialogTitle>
        <DialogContent>
          <br />
          <div style={{ display: "flex" }}>
            <br />
            <TextField
              style={{ width: 520, marginRight: 30 }}
              disabled
              label="Số tiền"
              value={totalCostForOrderDetail}
              fullWidth
              variant="outlined"
            />
            <br />
            <br />
            <TextField
              style={{ width: 550 }}
              disabled
              label="VAT"
              value={vatOrderDetail}
              fullWidth
              variant="outlined"
            />
          </div>
          <br />
          <TextField
            disabled
            label="Tổng tiền"
            value={sumOrderDetail}
            fullWidth
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            label="Khách hàng trả"
            value={givenCustomerOneRoom}
            onChange={(e) => setGivenCustomerOneRoom(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <br />
          <br />
          <div style={{ display: "flex" }}>
            <FormControl variant="standard">
              <InputLabel id="demo-simple-select-standard-label">Khách hàng</InputLabel>
              {customerOrderDetail.length > 0 ? (
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Khách hàng"
                  style={{ width: 300 }}
                  value={selectedCustomerReturn}
                  onChange={(event) => setSelectedCustomerReturn(event.target.value)}
                >
                  {customerOrderDetail.map((customerOrderDetail) => (
                    <MenuItem key={customerOrderDetail.id} value={customerOrderDetail.id}>
                      {customerOrderDetail.fullname}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <p>Loading...</p>
              )}
            </FormControl>
            <TextField
              style={{ marginLeft: 135, width: 500 }}
              disabled
              label="Tiền trả lại"
              value={givenCustomerOneRoom - sumOrderDetail}
              variant="outlined"
            />
          </div>
          <br />
          <TextareaAutosize
            className="form-control"
            placeholder="Ghi chú"
            name="note"
            value={noteReturnOneRoom}
            onChange={(e) => setNoteReturnOneRoom(e.target.value)}
            cols={80}
            style={{ height: 150 }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleReturnOneRoom} className="btn btn-outline-primary">
            TIỀN MẶT
          </button>
          {/* <button className="btn btn-outline-danger">CHUYỂN KHOẢN</button> */}
        </DialogActions>
        <br />
      </Dialog>
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
            <TextField
              style={{ marginTop: 10 }}
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
            <div>
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
              <button
                onClick={handleOpenAddCombo}
                style={{ marginLeft: 310, height: 50 }}
                className="btn btn-outline-primary"
              >
                COMBO DỊCH VỤ
              </button>
            </div>
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
        {order.status === 1 || order.status === 2 ? (
          <button onClick={handleOpenAddService} className="btn btn-primary">
            THÊM DỊCH VỤ
          </button>
        ) : null}
        <Dialog
          open={openQuantityNoteCombo}
          onClose={handleCloseQuantityNoteCombo}
          fullWidth
          PaperProps={{
            style: {
              maxWidth: "30%",
              maxHeight: "90%",
            },
          }}
        >
          <DialogTitle>
            {selectedComboId !== null &&
              combo.find((combo) => combo.id === selectedComboId)?.comboName}
          </DialogTitle>
          <DialogContent>
            <TextField
              style={{ marginTop: 10 }}
              label="Số lượng"
              fullWidth
              variant="outlined"
              value={quantityCombo}
              onChange={(e) => setQuantityCombo(e.target.value)}
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
              value={noteCombo}
              onChange={(e) => setNoteCombo(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <button onClick={handleConfirmCombo} className="btn btn-outline-primary">
              XÁC NHẬN
            </button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openAddCombo}
          onClose={handleCloseAddCombo}
          fullWidth
          PaperProps={{
            style: {
              maxWidth: "60%",
              maxHeight: "90%",
            },
          }}
        >
          <DialogTitle>COMBO DỊCH VỤ</DialogTitle>
          <DialogContent>
            <div>
              <OutlinedInput
                fullWidth
                defaultValue=""
                placeholder="Tìm kiếm combo"
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{ maxWidth: 500 }}
              />
            </div>
            <br />
            <Scrollbar>
              <Box sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên combo</TableCell>
                      <TableCell>Dịch vụ trong combo</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Mô tả</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {combo.map((combo) => (
                      <TableRow key={combo.id}>
                        <TableCell>{combo.comboName}</TableCell>
                        <TableCell>
                          <ul>
                            {combo.comboServiceList.map((comboService) => (
                              <li key={comboService.id}>
                                <p>
                                  {" "}
                                  {comboService.service.serviceName}
                                  {/* {formatCurrency(comboService.service.price)} */}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>{formatPrice(combo.price)}</TableCell>
                        <TableCell>{combo.note}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleOpenQuantityNoteCombo(combo.id)}
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
      </div>
      <TabContext value={activeTab}>
        <Box
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 1150,
            marginLeft: 140, // Add the box shadow
          }}
        >
          {/* <h3 style={{ display: "flex", justifyContent: "center" }}>DỊCH VỤ</h3>
          <hr /> */}
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Tabs value={String(activeTab)} onChange={handleChange} centered>
                <Tab label="DỊCH VỤ" value="1" />
                <Tab label="COMBO DỊCH VỤ" value="2" />
              </Tabs>
            </Box>
            <TabPanel value="1">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên dịch vụ</TableCell>
                    <TableCell>Phòng</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Thành tiền</TableCell>
                    <TableCell>
                      {order.status === 1 || order.status === 2 ? <>Thao tác</> : null}
                    </TableCell>
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
                          {order.status === 1 || order.status === 2 ? (
                            <>
                              <button
                                onClick={() => handleDeleteServiceUsed(serviceUsed.id)}
                                className="btn btn-danger m-xl-2"
                              >
                                <SvgIcon fontSize="small">
                                  <TrashIcon />
                                </SvgIcon>
                              </button>
                            </>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <div>
                          <span style={{ fontFamily: "monospace", fontSize: 20 }}>
                            Không có dữ liệu.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <h6
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "flex-end",
                  color: "red",
                }}
              >
                Tổng tiền: {formatPrice(calculateTotalAmount())}
              </h6>
            </TabPanel>
            <TabPanel value="2">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên combo</TableCell>
                    <TableCell>Phòng</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Thành tiền</TableCell>
                    <TableCell>
                      {order.status === 1 || order.status === 2 ? <>Thao tác</> : null}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comboUsed.length > 0 ? (
                    comboUsed.map((comboUsed) => (
                      <TableRow key={comboUsed.id}>
                        <TableCell>{comboUsed.combo.comboName}</TableCell>
                        <TableCell>{comboUsed.orderDetail.room.roomName}</TableCell>
                        <TableCell>{comboUsed.quantity}</TableCell>
                        <TableCell>{comboUsed.quantity * comboUsed.combo.price}</TableCell>
                        <TableCell>
                          {order.status === 1 || order.status === 2 ? (
                            <>
                              <button
                                onClick={() => handleDeleteComboUsed(comboUsed.id)}
                                className="btn btn-danger m-xl-2"
                              >
                                <SvgIcon fontSize="small">
                                  <TrashIcon />
                                </SvgIcon>
                              </button>
                            </>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <div>
                          <span style={{ fontFamily: "monospace", fontSize: 20 }}>
                            Không có dữ liệu.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <h6
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "flex-end",
                  color: "red",
                }}
              >
                Tổng tiền: {formatPrice(calculateTotalAmountCombo())}
              </h6>
            </TabPanel>
          </Scrollbar>
        </Box>
      </TabContext>
      <Box
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
                  <TableCell>
                    {order.status === 1 || order.status === 2 ? <>Thao tác</> : null}
                  </TableCell>
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
                        {order.status === 1 || order.status === 2 ? (
                          <>
                            <button
                              onClick={() => handleDelete(customer.id)}
                              className="btn btn-danger m-xl-2"
                            >
                              <SvgIcon fontSize="small">
                                <TrashIcon />
                              </SvgIcon>
                            </button>
                          </>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <div>
                        <span style={{ fontFamily: "monospace", fontSize: 20 }}>
                          Không có dữ liệu.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Box>
      <div className="row">
        <Box
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #ccc",
            padding: "20px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 650,
            marginLeft: 150,
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
                    style={{ width: 290, color: "yellow" }}
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
              {order.status === 1 || order.status === 2 ? (
                <button
                  style={{ width: 200, height: 50 }}
                  className="btn btn-outline-success"
                  onClick={handleAddCustomerToRooms}
                >
                  Thêm khách hàng
                </button>
              ) : null}
            </div>
          </div>
        </Box>
        <Box
          style={{
            height: 400,
            border: "1px solid #ccc",
            padding: "20px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 400,
            marginLeft: 80,
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
        </Box>
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
            <hr />
            <DialogContent>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <FormControl variant="standard">
                  <InputLabel id="demo-simple-select-standard-label">Khách hàng</InputLabel>
                  {customerOrder.length > 0 ? (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Khách hàng"
                      style={{ width: 200 }}
                      value={selectedCustomerAccept} // Đảm bảo giá trị selectedCustomerAccept tồn tại trong danh sách
                      onChange={(event) => setSelectedCustomerAccept(event.target.value)}
                    >
                      {customerOrder.map((customerOrder) => (
                        <MenuItem key={customerOrder.id} value={customerOrder.id}>
                          {customerOrder.fullname}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <p>Loading...</p>
                  )}
                </FormControl>
              </div>
              <br />
              <br />
              <TextareaAutosize
                className="form-control"
                placeholder="Ghi chú"
                name="note"
                cols={50}
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
                Tiền mặt
              </button>
              {/* <button onClick={createPaymentZaloPay} className="btn btn-outline-primary">
                Zalo Pay
              </button> */}
              <button onClick={createPaymentMomo} className="btn btn-outline-danger">
                Thanh toán MOMO
              </button>
              <button style={{ marginRight: 20 }} onClick={createPayment} className="btn btn-outline-dark">
                Chuyển khoản ngân hàng
              </button>
            </DialogActions>
            <br />
          </Dialog>
          <Dialog open={openCancelRoom} onClose={handleCloseCancelOrder} maxWidth="md">
            <DialogTitle>Xác nhận khách hàng hủy phòng</DialogTitle>
            <DialogContent>
              <TextareaAutosize
                className="form-control"
                placeholder="Ghi chú"
                name="note"
                cols={100}
                style={{ height: 150 }}
                variant="outlined"
                value={noteCancelRoom}
                onChange={(e) => setNoteCancelRoom(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelOrder}>Xác nhận</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

BookRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookRoom;
