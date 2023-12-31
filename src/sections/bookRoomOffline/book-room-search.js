import { Card, Button, Grid, OutlinedInput, SvgIcon } from "@mui/material";
import ForwardIcon from "@heroicons/react/24/solid/ForwardIcon";
import React from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/router";

export const BookRoomSearch = ({ textSearch, setTextSearch }) => {
  const pathname = usePathname();
  const router = useRouter();

  const item = {
    title: "Add",
    path: "/booking",
    icon: (
      <SvgIcon fontSize="small">
        <ForwardIcon />
      </SvgIcon>
    ),
  };
  const active = item.path ? pathname === item.path : false;
  const account = localStorage.getItem("idAccount");
  const fullname = localStorage.getItem("fullName");

  const orderData = {
    account: { id: account },
    // createBy: fullname,
    // updatedBy: fullname,
  };

  const createOrder = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
       console.log("Bạn chưa đăng nhập");
        return;
      }
      // Gửi yêu cầu POST đến server để đặt phòng
      const response = await axios.post("http://localhost:2003/api/order/save", orderData);
      router.push(`/booking?id=${response.data.id}`);
      console.log("Tạo thành công:", response.data);
      console.log("Id:", response.data.id);
    } catch (error) {
      console.log("Lỗi khi đặt phòng:", error);
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
              width: 220,
              marginLeft: 560,
              backgroundColor: "darkblue",
              color: "white",
            }}
            onClick={createOrder}
          >
            Tiến hành đặt phòng
            <SvgIcon style={{ marginLeft: 20 }}>
              <ForwardIcon/>
            </SvgIcon>
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};
