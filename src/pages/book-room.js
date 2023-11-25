import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function BookRoom() {
  const [rooms, setRooms] = useState([]);
  const [service, setService] = useState([]);
  const [floor, setFloor] = useState([]);
  const [typeRoom, setTypeRoom] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [unit, setUnit] = useState([]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

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
        const response = await axios.get("http://localhost:2003/api/admin/room/getAllByStatus");
        setRooms(response.data); // Cập nhật danh sách phòng từ response
        console.log("Room: ", response.data);
        console.log("Rooms: ", rooms);
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
         console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get("http://localhost:2003/api/admin/service/getAll");
        setService(response.data); // Cập nhật danh sách phòng từ response
        console.log("Service: ", response.data);
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
         console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get("http://localhost:2003/api/admin/floor/getList");
        const response2 = await axios.get("http://localhost:2003/api/admin/type-room/getList");
        const response3 = await axios.get("http://localhost:2003/api/admin/service-type/getAll");
        const response4 = await axios.get("http://localhost:2003/api/admin/unit/getAll");
        console.log(response.data);
        console.log(response2.data);
        setFloor(response.data);
        setTypeRoom(response2.data);
        setServiceType(response3.data);
        setUnit(response4.data);
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const handleSelectRoom = async (selectedRoom) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
       console.log("Bạn chưa đăng nhập");
        return;
      }

      // Tạo dữ liệu đối tượng OrderDetailDTO để gửi lên server
      const orderDetailDTO = {
        roomId: selectedRoom.id, // Đặt phòng dựa trên ID của phòng được chọn
        // Các trường thông tin khác nếu cần
      };

      // Gửi yêu cầu POST đến server để đặt phòng
      const response = await axios.post(
        "http://localhost:2003/api/admin/order/save-order",
        orderDetailDTO
      );

      // Ở đây, bạn có thể thực hiện các hành động sau khi đặt phòng thành công,
      // chẳng hạn hiển thị thông báo, điều hướng trang hoặc cập nhật trạng thái.
      window.location.href = `/book-room-detail?id=${response.data.id}`;
      console.log("Đặt phòng thành công:", response.data);
      console.log("Id:", response.data.id);
    } catch (error) {
      console.log("Lỗi khi đặt phòng:", error);
      // Xử lý lỗi nếu có
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
                  <TableCell>{room.status === 1 ? "Phòng trống" : ""}</TableCell>
                  <TableCell>
                    {selectedRoom && selectedRoom.id === room.id ? (
                      <button className="btn btn-outline-primary">Xem</button>
                    ) : (
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleSelectRoom(room)}
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
    </div>
  );
}

BookRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookRoom;
