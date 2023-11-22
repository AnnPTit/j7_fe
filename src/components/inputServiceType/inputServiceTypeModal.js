import classNames from "classnames/bind";
import style from "./inputServiceTypeModal.module.scss";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);
const handleSubmit = async (code) => {
  // Lấy giá trị từ các trường nhập liệu
  const serviceTypeInput = document.querySelector('input[name="serviceTypeName"]');
  const descriptionInput = document.querySelector('input[name="description"]');

  const serviceTypeName = serviceTypeInput?.value;
  const description = descriptionInput?.value;

  let randomString = generateRandomString(10); // Sinh chuỗi ngẫu nhiên có độ dài 10

  const payload = {
    serviceTypeCode: "LDV_" + randomString,
    serviceTypeName,
    description,
  };
  console.log(payload);

  try {
    const accessToken = localStorage.getItem("accessToken"); 
    if (!accessToken) {
     console.log("Bạn chưa đăng nhập");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; 
    const response = await axios.post("http://localhost:2003/api/admin/service-type/save", payload);
    console.log(response);
    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = `/input/inputService/inputService?code=${code}`;
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
        window.location.href = "/"; // Chuyển hướng đến trang đăng nhập
      } else if (error.response.status === 400) {
        console.log(error.response);
        // alert(error.response.data.serviceTypeCode);
        if (
          error.response.data.serviceTypeCode == undefined &&
          error.response.data.serviceTypeName == undefined
        ) {
          toast.error(error.response.data);
        }
        toast.error(error.response.data.serviceTypeCode, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.serviceTypeName, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        alert("Có lỗi xảy ra trong quá trình gọi API");
      }
    } else {
      console.log("Không thể kết nối đến API");
    }
  }
};
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  const randomChars = Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * charactersLength))
  );
  return randomChars.join("");
}

function InputServiceTypeModal({ code }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <form>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="serviceTypeName" />
              <div className={cx("underline")}></div>
              <label>Tên Loại Dịch vụ</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="description" />
              <div className={cx("underline")}></div>
              <label>Mô tả</label>
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

export default InputServiceTypeModal;
