import classNames from "classnames/bind";
import style from "./inputServiceType.module.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

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
      alert("Bạn chưa đăng nhập");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

    const response = await axios.post("http://localhost:2003/api/admin/service-type/save", payload); // Gọi API /api/service-type/save với payload và access token
    toast.success("Add Successfully!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(response); //

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");

      window.location.href = "/serviceType";
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

function InputServiceType() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("text")}>Service Type</div>
        <form action="/api/admin/service-type/save" method="post">
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="serviceTypeCode" />
              <div className={cx("underline")}></div>
              <label>ServiceType Code</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="serviceTypeName" />
              <div className={cx("underline")}></div>
              <label>ServiceType Name</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="description" />
              <div className={cx("underline")}></div>
              <label>Description</label>
            </div>
          </div>

          <div className={cx("form-row submit-btn")}>
            <div className={cx("input-data")}>
              <div className={cx("inner")}>
                <button className={cx("input-btn")} onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputServiceType;
