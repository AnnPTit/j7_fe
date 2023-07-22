import classNames from "classnames/bind";
import style from "./InputAccount.module.scss";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);
const handleSubmit = async (event) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  // Lấy giá trị từ các trường nhập liệu
  const accountCodeInput = document.querySelector('input[name="accountCode"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const fullNameInput = document.querySelector('input[name="fullname"]');
  const genderdInput = document.querySelector('input[name="gender"]');
  const birthdayInput = document.querySelector('input[name="birthday"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phoneNumber"]');
  const citizenIdInput = document.querySelector('input[name="citizenId"]');
  const positionInput = document.querySelector('input[name="position"]');


  const accountCode = accountCodeInput?.value;
  const password = passwordInput?.value;
  const gender = genderdInput?.value;
  const fullname = fullNameInput?.value;
  const email = emailInput?.value;
  const phoneNumber = phoneInput?.value;
  const birthday = birthdayInput?.value;
  const citizenId = citizenIdInput?.value;
  const position = positionInput?.value;

  let positionTypeObj = {
    id: "e0dd2171-1e7f-11ee-b6b7-088fc303f3c3",
  };

  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    accountCode,
    password,
    gender,
    fullname,
    email,
    phoneNumber,
    birthday,
    citizenId,
    position: positionTypeObj,
  };
  console.log(payload);

  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

    const response = await axios.post("http://localhost:2003/api/admin/account/save", payload); // Gọi API /api/service-type/save với payload và access token
    console.log(response); //

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = "/account";
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
        // alert(error.response.data.serviceTypeCode);
        if (
          error.response.data.accountCode == undefined &&
          error.response.data.fullname == undefined &&
          error.response.data.birthday == undefined &&
          error.response.data.email == undefined &&
          error.response.data.phoneNumber == undefined &&
          error.response.data.citizenId == undefined &&
          error.response.data.password == undefined
        ) {
          toast.error(error.response.data);
        }
        toast.error(error.response.data.accountCode, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.fullname, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.birthday, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.email, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.phoneNumber, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.citizenId, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.password, {
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

function InputAccount() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("text")}>Account</div>
        <form action="/api/account/save" method="post">
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="accountCode" />
              <div className={cx("underline")}></div>
              <label>Account Code</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="fullname" />
              <div className={cx("underline")}></div>
              <label>Full Name</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input", "horizontal-radio", "col-6")}>
              <label>Gender</label>
              <div className="">
                <input className="form-check" type="radio" required name="gender" value={true} defaultChecked/>
                <label className="form-check">nam</label>
              </div>
              <div className="">
                <input className="form-check" type="radio" required name="gender" value={false} />
                <label className="form-check">nữ</label>
              </div>
            </div>
            <div className={cx("input-data", "col")}>
              <input type="date" required name="birthday" />
              <div className={cx("underline")}></div>
              <label>Birthday</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="email" required name="email" />
              <div className={cx("underline")}></div>
              <label>Email Address</label>
            </div>
            <div className={cx("input-data")}>
              <input type="tel" required name="phoneNumber" />
              <div className={cx("underline")}></div>
              <label>Phone</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="citizenId" />
              <div className={cx("underline")}></div>
              <label>Citizen Id</label>
            </div>
            <div className={cx("input-data")}>
              <input type="password" required name="password" />
              <div className={cx("underline")}></div>
              <label>Password</label>
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

export default InputAccount;
