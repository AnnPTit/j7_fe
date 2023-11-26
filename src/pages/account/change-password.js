import { useState } from "react";
import { useRouter } from "next/router";
import { Container, Button, Form } from "react-bootstrap";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();

  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const id = localStorage.getItem("idAccount");

  const handleChangePassword = async () => {
    if (cpassword !== password) {
      console.error("Mật khẩu không trùng khớp!");
      toast.error("Mật khẩu không trùng khớp!");
      return;
    }

    const payload = {
      password: password,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return false;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const response = await axios.put(
        `http://localhost:2003/api/admin/account/changePassword/${id}`,
        payload
      );

      console.log(response);

      if (response.status === 200) {
        console.log("Đổi mật khẩu thành công");
        window.location.href = "/auth/login";
        return true;
      } else {
        toast.error("Đổi mật khẩu thất bại");
        return false;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          alert("Bạn không có quyền truy cập vào trang này");
          router.push("/auth/login");
        } else if (error.response.status === 400) {
          console.log(error.response.data);
          toast.error(error);
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
    <Container>
      <h1>Đổi mật khẩu</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formPassword" required>
          <div className="form-floating">
            <Form.Control
              type="password"
              className="form-control"
              placeholder="Mật Khẩu"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="formPassword">Mật Khẩu</label>
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword" required>
          <div className="form-floating">
            <Form.Control
              type="password"
              className="form-control"
              placeholder="Xác Nhận Mật Khẩu"
              name="cpassword"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
            <label htmlFor="formConfirmPassword">Xác Nhận Mật Khẩu</label>
          </div>
        </Form.Group>

        <Button
          variant="primary"
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
                await handleChangePassword();
                toast.success("Đổi mật khẩu thành công!");
              }
            });
          }}
        >
          Đổi Mật Khẩu
        </Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
