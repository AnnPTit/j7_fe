import classNames from "classnames/bind";
import style from "./inputUnitModal.module.scss";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);
const handleSubmit = async (code) => {
  // Lấy giá trị từ các trường nhập liệu
  const unitNameInput = document.querySelector('input[name="unitName"]');
  const unitName = unitNameInput?.value;
  const payload = {
    unitName,
  };
  console.log(payload);
  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    if (!accessToken) {
     console.log("Bạn chưa đăng nhập");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
    const response = await axios.post("http://localhost:2003/api/admin/unit/save", payload); // Gọi API /api/customers/save với payload và access token
    console.log(response);
    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = `/input/inputService/inputService?code=${code}`;
      toast.success("Thêm Thành Công !");
      // Thực hiện các hành động khác sau khi API thành công
    } else {
      // Xử lý khi API gặp lỗi
      console.log("API call failed");
      // Thực hiện các hành động khác khi gọi API thất bại
    }
  } catch (error) {
    // Xử lý khi có lỗi xảy ra trong quá trình gọi API
    if (error.response) {
      // Xử lý response lỗi
      if (error.response.status === 403) {
        alert("Bạn không có quyền truy cập vào trang này");
        window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
      } else if (error.response.status === 400) {
        console.log(error.response);
        // alert(error.response.data.unitNameCode);
      } else {
        alert("Có lỗi xảy ra trong quá trình gọi API");
      }
    } else {
      console.log("Không thể kết nối đến API");
    }
  }
};

function InputUnitModal({ code }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <form>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="unitName" />
              <div className={cx("underline")}></div>
              <label>Tên Đơn Vị</label>
            </div>
          </div>
          <div className={cx("form-row submit-btn")}>
            <div className={cx("input-data")}>
              <div className={cx("inner")}>
                <button className={cx("input-btn")} onClick={() => handleSubmit(code)}>
                  Thêm
                </button>
                <ToastContainer />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputUnitModal;
