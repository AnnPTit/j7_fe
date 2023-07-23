import classNames from "classnames/bind";
import style from "./InputTypeRoom.module.scss";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);
const handleSubmit = async (event) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  // Lấy giá trị từ các trường nhập liệu
  const typeRoomCodeInput = document.querySelector('input[name="typeRoomCode"]');
  const typeRoomNameInput = document.querySelector('input[name="typeRoomName"]');
  const pricePerDayInput = document.querySelector('input[name="pricePerDay"]');
  const pricePerHoursInput = document.querySelector('input[name="pricePerHours"]');
  const pricePerDaytimeInput = document.querySelector('input[name="pricePerDaytime"]');
  const pricePerNighttimeInput = document.querySelector('input[name="pricePerNighttime"]');
  const priceOvertimeInput = document.querySelector('input[name="priceOvertime"]');
  const capacityInput = document.querySelector('input[name="capacity"]');
  const noteInput = document.querySelector('textarea[name="note"]');

  const typeRoomCode = typeRoomCodeInput?.value;
  const typeRoomName = typeRoomNameInput?.value;
  const pricePerDay = pricePerDayInput?.value;
  const pricePerHours = pricePerHoursInput?.value;
  const pricePerDaytime = pricePerDaytimeInput?.value;
  const pricePerNighttime = pricePerNighttimeInput?.value;
  const priceOvertime = priceOvertimeInput?.value;
  const capacity = capacityInput?.value;
  const note = noteInput?.value;

  const payload = {
    typeRoomCode,
    typeRoomName,
    pricePerDay,
    pricePerHours,
    pricePerDaytime,
    pricePerNighttime,
    priceOvertime,
    capacity,
    note,
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

    const response = await axios.post("http://localhost:2003/api/admin/type-room/save", payload); // Gọi API /api/customers/save với payload và access token
    console.log(response);

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = "/type-room";
      toast.success("Add Successfully!");
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
        // alert(error.response.data.typeRoomCode);
        if (
          error.response.data.typeRoomCode == undefined &&
          error.response.data.typeRoomName == undefined
        ) {
          toast.error(error.response.data);
        }
        toast.error(error.response.data.typeRoomCode, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.typeRoomName, {
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

function InputTypeRoom() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("text")}>Loại phòng</div>
        <form>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="typeRoomCode" />
              <div className={cx("underline")}></div>
              <label>Mã</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="typeRoomName" />
              <div className={cx("underline")}></div>
              <label>Tên</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="number" required name="pricePerDay" />
              <div className={cx("underline")}></div>
              <label>Giá theo ngày</label>
            </div>
            <div className={cx("input-data")}>
              <input type="number" required name="pricePerHours" />
              <div className={cx("underline")}></div>
              <label>Giá theo giờ</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="number" required name="pricePerDaytime" />
              <div className={cx("underline")}></div>
              <label>Giá qua ngày</label>
            </div>
            <div className={cx("input-data")}>
              <input type="number" required name="pricePerNighttime" />
              <div className={cx("underline")}></div>
              <label>Giá qua đêm</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="number" required name="priceOvertime" />
              <div className={cx("underline")}></div>
              <label>Giá quá giờ</label>
            </div>
            <div className={cx("input-data")}>
              <input type="number" required name="capacity" />
              <div className={cx("underline")}></div>
              <label>Sức chứa</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data textarea")}>
              <textarea rows="6" cols="50" name="note"></textarea>
              <br />
              <div className={cx("underline")}></div>
              <br />
            </div>
          </div>
          <div className={cx("form-row submit-btn")}>
            <div className={cx("input-data")}>
              <div className={cx("inner")}>
                <button className={cx("input-btn")} onClick={handleSubmit}>
                  Save
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

export default InputTypeRoom;
