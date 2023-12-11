import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
export const ProfileDetail = () => {
  const [accountUpdate, setAccountUpdate] = useState({
    id: "",
    accountCode: "",
    fullname: "",
    gender: "",
    birthday: "",
    phoneNumber: "",
    email: "",
    password: "",
    citizenId: "",
    provinces: "",
    districts: "",
    wards: "",
    createAt: "",
  });

  const id = localStorage.getItem("idAccount");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.get(`http://localhost:2003/api/admin/account/detail/${id}`);

        if (response.data) {
          setAccountUpdate(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      }
    }

    fetchData();
  }, [id]);
  console.log(accountUpdate.password);

  const handleSubmit = async () => {
    if (!newPassword.trim()) {
      toast.error("Mật khẩu mới không được trống!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
    if (confirmNewPassword !== newPassword) {
      toast.error("Mật khẩu nhập lại không trùng khớp!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return false;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const payload = {
        password: newPassword,
      };
      console.log(payload);
      const response = await axios.put(
        `http://localhost:2003/api/admin/account/changePassword/${id}`,
        payload
      );

      if (response.status === 200) {
        console.log("API call successful");
        localStorage.removeItem("idAccount");
        localStorage.removeItem("fullName");
        window.location.href = "/auth/login";
        return true;
      } else {
        console.log("API call failed");
        return false;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          alert("Bạn không có quyền truy cập vào trang này");
          window.location.href = "/auth/login";
        } else if (error.response.status === 400) {
          console.log(error.response.data);
        } else {
          alert("Có lỗi xảy ra trong quá trình gọi API");
          return false;
        }
      } else {
        console.log("Không thể kết nối đến API");
        return false;
      }
    }
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Thông tin cá nhân" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="fullname"
                  value={accountUpdate.fullname}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  name="lastName"
                  value={accountUpdate.birthday}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Giới tính"
                  name="phoneNumber"
                  value={accountUpdate.gender ? "Nam" : "Nữ"}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phoneNumber"
                  value={accountUpdate.phoneNumber}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Căn cước công dân"
                  name="citizenId"
                  value={accountUpdate.citizenId}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={accountUpdate.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tỉnh/Thành phố"
                  name="email"
                  value={accountUpdate.provinces}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quận/Huyện"
                  name="email"
                  value={accountUpdate.districts}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phường/Xã"
                  name="email"
                  value={accountUpdate.wards}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    console.log("New Password Changed:", e.target.value);
                    setNewPassword(e.target.value);
                  }}
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => {
                    console.log("Confirm New Password Changed:", e.target.value);
                    setConfirmNewPassword(e.target.value);
                  }}
                  con
                  type="password"
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              Swal.fire({
                title: "Bạn chắc chắn chứ?",
                text: "Bạn sẽ không thể quay lại điều này!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Chắc chắn!",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const success = await handleSubmit();
                  if (success) {
                    toast.success("Đổi mật khẩu thành công!");
                  }
                }
              });
            }}
          >
            Cập nhật
          </Button>
          <ToastContainer />
        </CardActions>
      </Card>
    </form>
  );
};
