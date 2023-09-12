import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, Button, Grid, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import React from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/router";

export const BookRoomSearch = ({ textSearch, setTextSearch }) => {
  const pathname = usePathname();
  const router = useRouter();

  const item = {
    title: "Add",
    path: "/room-service",
    icon: (
      <SvgIcon fontSize="small">
        <PlusIcon />
      </SvgIcon>
    ),
  };
  const active = item.path ? pathname === item.path : false;

  const orderData = {};

  const createOrder = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      // Gửi yêu cầu POST đến server để đặt phòng
      const response = await axios.post("http://localhost:2003/api/admin/order/save", orderData);

      // Ở đây, bạn có thể thực hiện các hành động sau khi đặt phòng thành công,
      // chẳng hạn hiển thị thông báo, điều hướng trang hoặc cập nhật trạng thái.
      router.push(`/room-service?id=${response.data.id}`);
      console.log("Tạo thành công:", response.data);
      console.log("Id:", response.data.id);
    } catch (error) {
      console.log("Lỗi khi đặt phòng:", error);
      // Xử lý lỗi nếu có
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container my={2.5}>
        <OutlinedInput
          fullWidth
          value={textSearch}
          placeholder="Tìm kiếm theo mã"
          sx={{ maxWidth: 500 }}
          onChange={(e) => {
            setTextSearch(e.target.value);
          }}
        />

        <Grid>
          <Button
            className="btn btn-primary"
            style={{
              height: 55,
              width: 170,
              marginLeft: 600,
              backgroundColor: "darkblue",
              color: "white",
            }}
            onClick={createOrder}
          >
            <SvgIcon fontSize="small">
              <PlusIcon />
            </SvgIcon>{" "}
            Tạo Hóa Đơn
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};
