import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import style from "./updateServiceType.module.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
const cx = classNames.bind(style);
const handleSubmit = async (event, id, serviceTypeUpdate) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    ...serviceTypeUpdate,
    id: id,
    serviceTypeCode: serviceTypeUpdate.serviceTypeCode,
    serviceTypeName: serviceTypeUpdate.serviceTypeName,
    description: serviceTypeUpdate.description,
  };
  console.log(payload);
  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    console.log(accessToken);
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
      alert("Bạn chưa đăng nhập");
      return false;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
    const response = await axios.put(
      `http://localhost:2003/api/admin/service-type/update/${id}`,
      payload
    ); // Gọi API /api/service-type/save với payload và access token
    toast.success("Cập nhật thành công !", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(response); //

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");

      window.location.href = "/serviceType";
      return true;
      // Thực hiện các hành động khác sau khi API thành công
    } else {
      // Xử lý khi API gặp lỗi
      console.log("API call failed");
      return false;
      // Thực hiện các hành động khác khi gọi API thất bại
    }
  } catch (error) {
    // Xử lý khi có lỗi xảy ra trong quá trình gọi API
    if (error.response) {
      // Xử lý response lỗi
      if (error.response.status === 403) {
        alert("Bạn không có quyền truy cập vào trang này");
        window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
        return false;
      } else if (error.response.status === 400) {
        console.log(error.response);
        // alert(error.response.data.serviceTypeCode);
        toast.error(error.response.data.serviceTypeName, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.serviceTypeCode, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
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

function UpdateServiceType() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query
  const [serviceTypeUpdate, setServiceTypeUpdate] = useState({
    serviceTypeCode: "",
    serviceTypeName: "",
    description: "",
  });
  // Hàm detail
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
        const response = await axios.get(
          `http://localhost:2003/api/admin/service-type/detail/${id}`
        );
        console.log("Service", response.data);

        if (response.data) {
          setServiceTypeUpdate(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, [id]);
  return (
    <div className={cx("wrapper")}>
      <h1>Cập nhật Loại Dịch Vụ</h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          disabled
          placeholder="Default input"
          aria-label="default input example"
          name="serviceTypeCode"
          value={serviceTypeUpdate.serviceTypeCode}
          onChange={(e) => {
            setServiceTypeUpdate((prev) => ({
              ...prev,
              serviceTypeCode: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingInput">Mã loại dịch vụ</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="serviceTypeName"
          value={serviceTypeUpdate.serviceTypeName}
          onChange={(e) => {
            setServiceTypeUpdate((prev) => ({
              ...prev,
              serviceTypeName: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Tên loại dịch vụ</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="description"
          value={serviceTypeUpdate.description}
          onChange={(e) => {
            setServiceTypeUpdate((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Mô tả</label>
      </div>
      <br />
      <button
        className={(cx("input-btn"), "btn btn-primary")}
        onClick={() => {
          Swal.fire({
            title: "Bạn có chắc muốn cập nhật ?",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(event, id, serviceTypeUpdate);
              if (isSubmitSuccess) {
                Swal.fire("Cập nhật thành công !", "Cập nhật thành công !", "success");
              }
            }
          });
        }}
      >
        Cập nhật
      </button>
      <ToastContainer />
    </div>
  );
}

UpdateServiceType.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateServiceType;
