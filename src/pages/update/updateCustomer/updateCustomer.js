import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import style from "./updateCustomer.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const cx = classNames.bind(style);
const handleSubmit = async (event, id, customerUpdate) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  const provincesInput = document.querySelector('select[name="provinces"]');
  const districtsInput = document.querySelector('select[name="districts"]');
  const wardsInput = document.querySelector('select[name="wards"]');

  const provinces = provincesInput?.value;
  const districts = districtsInput?.value;
  const wards = wardsInput?.value;

  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    ...customerUpdate,
    id: id,
    customerCode: customerUpdate.customerCode,
    gender: customerUpdate.gender,
    fullname: customerUpdate.fullname,
    email: customerUpdate.email,
    phoneNumber: customerUpdate.phoneNumber,
    birthday: customerUpdate.birthday,
    citizenId: customerUpdate.citizenId,
    provinces: customerUpdate.provinces,
    districts: customerUpdate.districts,
    wards: customerUpdate.wards,
  };
  console.log("payload ", payload);

  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
      alert("Bạn chưa đăng nhập");
      return false;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
    const response = await axios.put(
      `http://localhost:2003/api/admin/customer/update/${id}`,
      payload
    ); // Gọi API /api/service-type/save với payload và access token
    toast.success("update Successfully!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(response); //

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");

      window.location.href = "/customer";
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
      } else if (error.response.status === 400) {
        console.log(error.response.data);

        const isCustomerCodeError = error.response.data.customerCode === undefined;
        const isFullnameError = error.response.data.fullname === undefined;
        const isEmailError = error.response.data.email === undefined;
        const isPhoneNumberError = error.response.data.phoneNumber === undefined;
        const isCitizenIdError = error.response.data.citizenId === undefined;
        const isBirthdayError = error.response.data.birthday === undefined;

        if (
          !isCustomerCodeError &&
          !isFullnameError &&
          !isEmailError &&
          !isPhoneNumberError &&
          !isCitizenIdError &&
          !isBirthdayError
        ) {
          toast.error(error.response.data.customerCode, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          toast.error(error.response.data.fullname, {
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
          toast.error(error.response.data.birthday, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return false;
        } else {
          // Nếu có ít nhất một trường bị thiếu, xóa thông báo lỗi cho trường đó nếu có
          // và hiển thị thông báo lỗi cho các trường còn lại
          if (!isCustomerCodeError) {
            toast.error(error.response.data.customerCode, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isFullnameError) {
            toast.error(error.response.data.fullname, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isEmailError) {
            toast.error(error.response.data.email, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isPhoneNumberError) {
            toast.error(error.response.data.phoneNumber, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isCitizenIdError) {
            toast.error(error.response.data.citizenId, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isBirthdayError) {
            toast.error(error.response.data.birthday, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          return false;
        }
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

function UpdateCustomer() {
  // const [serviceType, setServiceType] = useState([]);
  // const [unit, setUnit] = useState([]);
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query
  const [customerUpdate, setCustomerUpdate] = useState({
    id: "",
    customerCode: "",
    fullname: "",
    gender: "",
    birthday: "",
    phoneNumber: "",
    email: "",
    citizenId: "",
    provinces: "",
    districts: "",
    wards: "",
    createAt: "",
  });
  // Lấy data cho combobox;
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
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);
  //Hàm detail
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
        const response = await axios.get(`http://localhost:2003/api/admin/customer/detail/${id}`);
        console.log("Customer", response.data);

        if (response.data) {
          setCustomerUpdate(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <h1>Cập Nhật Thông Tin Khách Hàng </h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="customerCode"
          value={customerUpdate.customerCode}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              customerCode: e.target.value,
            }));
          }}
        />

        <label htmlFor="floatingInput">Mã Khách Hàng</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="fullname"
          value={customerUpdate.fullname}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              fullname: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Họ tên</label>
      </div>
      <br></br>
      <div className="form-floating mb-3">
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-1 col-form-label">
            Giới tính
          </label>
          <div className="col-sm-10">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                value="true"
                checked={customerUpdate.gender === true}
                onChange={(e) => {
                  setCustomerUpdate((prev) => ({
                    ...prev,
                    gender: e.target.value === "true",
                  }));
                }}
              />
              <label className="form-check-label" htmlFor="inlineRadio1">
                Nam
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                value="false"
                checked={customerUpdate.gender === false}
                onChange={(e) => {
                  setCustomerUpdate((prev) => ({
                    ...prev,
                    gender: e.target.value === "true",
                  }));
                }}
              />
              <label className="form-check-label" htmlFor="inlineRadio2">
                Nữ
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-floating">
        <input
          type="date"
          className="form-control"
          id="floatingBirthday"
          placeholder="Ngày sinh"
          name="birthday"
          value={customerUpdate.birthday}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              birthday: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingBirthday">Ngày sinh</label>
      </div>

      <br></br>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="email"
          value={customerUpdate.email}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingInput">Email</label>
      </div>
      <div className="form-floating">
        <input
          type="tel"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="phoneNumber"
          value={customerUpdate.phoneNumber}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              phoneNumber: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Số điện thoại</label>
      </div>
      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="citizenId"
          value={customerUpdate.citizenId}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              citizenId: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Căn cước công dân</label>
      </div>

      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="provinces"
          value={customerUpdate.provinces}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              provinces: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Tỉnh/Thành Phố</label>
      </div>

      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="districts"
          value={customerUpdate.districts}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              districts: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Quận/Huyện</label>
      </div>

      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="wards"
          value={customerUpdate.wards}
          onChange={(e) => {
            setCustomerUpdate((prev) => ({
              ...prev,
              wards: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Phường/Xã</label>
      </div>

      <br></br>
      <button
        className={(cx("input-btn"), "btn btn-primary")}
        onClick={() => {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(event, id, customerUpdate);
              if (isSubmitSuccess) {
                Swal.fire("Update!", "Your data has been Update.", "success");
                toast.success("Update Successfully!");
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
UpdateCustomer.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateCustomer;
