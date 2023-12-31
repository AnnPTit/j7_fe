import classNames from "classnames/bind";
import style from "./InputCustomer.module.scss";
import axios from "axios";

const cx = classNames.bind(style);
const handleSubmit = async (event) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  // Lấy giá trị từ các trường nhập liệu
  const usernameInput = document.querySelector('input[name="username"]');
  const fullNameInput = document.querySelector('input[name="fullName"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const nationalityInput = document.querySelector('input[name="nationality"]');
  const birthdayInput = document.querySelector('input[name="birthday"]');
  const loactionInput = document.querySelector('textarea[name="location"]');

  const username = usernameInput?.value;
  const fullName = fullNameInput?.value;
  const email = emailInput?.value;
  const phoneNumber = phoneInput?.value;
  const nationality = nationalityInput?.value;
  const birthday = birthdayInput?.value;
  const address = loactionInput?.value;

  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    username,
    fullName,
    email,
    phoneNumber,
    nationality,
    birthday,
    address,
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

    const response = await axios.post("http://localhost:2003/api/customers/save", payload); // Gọi API /api/customers/save với payload và access token
    console.log(response); //

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = "/customers";
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
      } else {
        alert("Có lỗi xảy ra trong quá trình gọi API");
      }
    } else {
      console.log("Không thể kết nối đến API");
    }
  }
};

function InputCustomer() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("text")}>Contact us Form</div>
        <form action="/api/customers/save" method="post">
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="username" />
              <div className={cx("underline")}></div>
              <label>Username</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="fullname" />
              <div className={cx("underline")}></div>
              <label>Full Name</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="email" required name="email" />
              <div className={cx("underline")}></div>
              <label>Email Address</label>
            </div>
            <div className={cx("input-data")}>
              <input type="tel" required name="phone" />
              <div className={cx("underline")}></div>
              <label>Phone</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="nationality" />
              <div className={cx("underline")}></div>
              <label>Nationality</label>
            </div>
            <div className={cx("input-data")}>
              <input type="date" required name="birthday" />
              <div className={cx("underline")}></div>
              <label>Birthday</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data textarea")}>
              <textarea rows="8" cols="80" required name="location"></textarea>
              <br />
              <div className={cx("underline")}></div>
              <label>Write your location</label>
              <br />
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

export default InputCustomer;
