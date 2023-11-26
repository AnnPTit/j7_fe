import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import style from "./inputServiceType.module.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
const cx = classNames.bind(style);
const handleSubmit = async (event) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  // Lấy giá trị từ các trường nhập liệu
  const serviceTypeCodeInpt = document.querySelector('input[name="serviceTypeCode"]');
  const serviceTypeNameInpt = document.querySelector('input[name="serviceTypeName"]');
  const descriptionInpt = document.querySelector('input[name="description"]');

  const serviceTypeCode = serviceTypeCodeInpt?.value;
  const serviceTypeName = serviceTypeNameInpt?.value;
  const description = descriptionInpt?.value;

  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    serviceTypeCode,
    serviceTypeName,
    description,
  };
  console.log(payload);
  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    console.log(accessToken);
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
     console.log("Bạn chưa đăng nhập");
      return false;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
    const response = await axios.post("http://localhost:2003/api/admin/service-type/save", payload); // Gọi API /api/service-type/save với payload và access token
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
        window.location.href = "/";
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

function InputServiceType() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { code } = router.query; // Lấy thông tin từ URL qua router.query
  return (
    <div className={cx("wrapper")}>
      <h1>Thêm Loại Dịch Vụ</h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          value={code}
          aria-label="default input example"
          name="serviceTypeCode"
          disabled
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
        />
        <label htmlFor="floatingPassword">Mô tả</label>
      </div>
      <br />
      <button
        className={(cx("input-btn"), "btn btn-primary")}
        onClick={() => {
          Swal.fire({
            title: "Bạn có chắc chắn muốn thêm ? ",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(event);
              if (isSubmitSuccess) {
                Swal.fire("Thêm thành công !", "Thêm thành công !", "success");
              }
            }
          });
        }}
      >
        Thêm mới
      </button>
      <ToastContainer />
    </div>
  );
}

InputServiceType.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputServiceType;
