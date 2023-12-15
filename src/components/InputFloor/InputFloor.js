import classNames from "classnames/bind";
import style from "./InputFloor.module.scss";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);

const handleSubmit = async (event) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  // Lấy giá trị từ các trường nhập liệu
  const floorCodeInput = document.querySelector('input[name="floorCode"]');
  const floorNameInput = document.querySelector('input[name="floorName"]');
  const noteInput = document.querySelector('textarea[name="note"]');

  const floorCode = floorCodeInput?.value;
  const floorName = floorNameInput?.value;
  const note = noteInput?.value;

  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    floorCode,
    floorName,
    note,
  };
  console.log(payload);

  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage

    console.log(accessToken);
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
     console.log("Bạn chưa đăng nhập");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

    const response = await axios.post("http://localhost:2003/api/admin/floor/save", payload); // Gọi API /api/customers/save với payload và access token
    console.log(response);

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = "/input/inputRoom/inputRoom";
      toast.success("Thêm thành công!");
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
          error.response.data.floorCode == undefined &&
          error.response.data.floorName == undefined && 
          error.response.data.note == undefined
        ) {
          toast.error(error.response.data);
        }
        toast.error(error.response.data.floorCode, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.floorName, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.note, {
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

const alertSave = () => {
  Swal.fire({
    title: "Are you sure?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, add!",
  }).then((result) => {
    if (result.isConfirmed) {
      handleSubmit();
      Swal.fire("Added!", "Your data has been added.", "success");
      toast.success("Add Successfully!");
    }
  });
};

function InputFloor() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <form>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="floorCode" />
              <div className={cx("underline")}></div>
              <label>Mã tầng</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="floorName" />
              <div className={cx("underline")}></div>
              <label>Floor Name</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data textarea")}>
              <textarea rows="8" cols="52" name="note"></textarea>
              <br />
              <div className={cx("underline")}></div>
              <br />
            </div>
          </div>
          <div className={cx("form-row submit-btn")}>
            <div className={cx("input-data")}>
              <div className={cx("inner")}>
                <button className={cx("input-btn")} onClick={handleSubmit}>
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

export default InputFloor;
