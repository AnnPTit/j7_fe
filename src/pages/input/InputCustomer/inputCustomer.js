import classNames from "classnames/bind";
import style from "./inputCustomer.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);

function InputCustomer() {
  // call api địa chỉ
  const [gender, setGender] = useState(true);
  console.log(gender);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWards, setSelectedWards] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [idProvince, setIdProvince] = useState(0);
  const [idDistrict, setIdDistrict] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    // Lấy giá trị từ các trường nhập liệu
    const customerCodeInput = document.querySelector('input[name="customerCode"]');
    const userNameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const fullNameInput = document.querySelector('input[name="fullname"]');
    const birthdayInput = document.querySelector('input[name="birthday"]');
    const emailInput = document.querySelector('input[name="email"]');
    const phoneInput = document.querySelector('input[name="phoneNumber"]');
    const citizenIdInput = document.querySelector('input[name="citizenId"]');
    const provincesInput = document.querySelector('select[name="provinces"]');
    const districtsInput = document.querySelector('select[name="districts"]');
    const wardsInput = document.querySelector('select[name="wards"]');

    const customerCode = customerCodeInput?.value;
    const username = userNameInput?.value;
    const password = passwordInput?.value;
    const fullname = fullNameInput?.value;
    const email = emailInput?.value;
    const phoneNumber = phoneInput?.value;
    const birthday = birthdayInput?.value;
    const citizenId = citizenIdInput?.value;
    const provinces = provincesInput?.value;
    const districts = districtsInput?.value;
    const wards = wardsInput?.value;

    // Tạo payload dữ liệu để gửi đến API
    const payload = {
      customerCode,
      username,
      password,
      gender,
      fullname,
      email,
      phoneNumber,
      birthday,
      citizenId,
      provinces: selectedProvinceName,
      districts: selectedDistrictName,
      wards,
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

      const response = await axios.post("http://localhost:2003/api/admin/customer/save", payload); // Gọi API /api/service-type/save với payload và access token
      console.log(response);

      //

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

          const userName1 = error.response.data.username === undefined;
          const isFullnameError = error.response.data.fullname === undefined;
          const isEmailError = error.response.data.email === undefined;
          const isPhoneNumberError = error.response.data.phoneNumber === undefined;
          const isCitizenIdError = error.response.data.citizenId === undefined;
          const isBirthdayError = error.response.data.birthday === undefined;

          if (
            // !userName1 &&
            !isFullnameError &&
            !isEmailError &&
            !isPhoneNumberError &&
            !isCitizenIdError &&
            !isBirthdayError
          ) {
            // toast.error(error.response.data.userName, {
            //   position: toast.POSITION.BOTTOM_RIGHT,
            // });
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
            // if (!userName1) {
            //   toast.error(error.response.data.userName, {
            //     position: toast.POSITION.BOTTOM_RIGHT,
            //   });
            // }
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

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get("https://vapi.vnappmob.com/api/province/");
      setProvinces(response.data.results);
      console.log(response?.data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      let Api = `https://vapi.vnappmob.com/api/province/district/${idProvince}`;
      const response = await axios.get(Api);
      console.warn(Api);
      setDistricts(response.data.results);
      console.log(response?.data);
    };
    fetchDistricts();
  }, [idProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      let Api = `https://vapi.vnappmob.com/api/province/ward/${idDistrict}`;
      const response = await axios.get(Api);
      console.warn(Api);
      setWards(response.data.results);
      console.log(response?.data);
    };
    fetchWards();
  }, [idDistrict]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    console.log(selectedProvince);
    const province = provinces.find((province) => province.province_id === e.target.value);
    console.log(province.province_name);
    setIdProvince(province.province_id);
    const name = province ? province.province_name : "";
    setSelectedProvinceName(name);
    if (province) {
      setDistricts([]);
      setWards([]);
    }
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    const district = districts.find((district) => district.district_id === e.target.value);
    console.log(district.district_name);
    console.log(e.target.value);
    setIdDistrict(district.district_id);
    const name = district ? district.district_name : "";
    setSelectedDistrictName(name);
    if (district) {
      setWards([]);
    }
  };

  const handleWardsChange = (e) => {
    setSelectedWards(e.target.value);
    // const ward = wards.find((wards) => wards.wards_id === e.target.value);
    // setSelectedWards(ward);
    console.log(e.target.value);
  };

  return (
    <div className={cx("wrapper")}>
      <ToastContainer />
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="username"
        />
        <label htmlFor="floatingInput">User Name</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="fullname"
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
                onChange={(e) => setGender(e.target.value)}
                className="form-check-input"
                type="radio"
                name="gender"
                value="true"
              />
              <label className="form-check-label">Nam</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                onChange={(e) => setGender(e.target.value)}
                className="form-check-input"
                type="radio"
                name="gender"
                value="false"
              />
              <label className="form-check-label">Nữ</label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-floating">
        <input
          type="date"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="birthday"
        />
        <label htmlFor="floatingPassword">Ngày sinh</label>
      </div>
      <br></br>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="email"
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
        />
        <label htmlFor="floatingPassword">Căn cước công dân</label>
      </div>
      <br></br>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="password"
          placeholder="Default input"
          aria-label="default input example"
          name="password"
        />
        <label htmlFor="floatingInput">Password</label>
      </div>

      <br></br>
      <p>Tỉnh/Thành Phố</p>
      <select
        className="form-select"
        name="provinces"
        value={selectedProvince}
        onChange={handleProvinceChange}
      >
        <option value="">Chọn tỉnh thành</option>
        {provinces.map((province) => (
          <option key={province.province_id} value={province.province_id}>
            {province.province_name}
          </option>
        ))}
      </select>

      <br></br>
      <p>Quận/Huyện</p>
      <select
        className="form-select"
        name="districts"
        value={selectedDistrict}
        onChange={handleDistrictChange}
      >
        <option value="">Chọn quận huyện</option>
        {districts.map((district) => (
          <option key={district.district_id} value={district.district_id}>
            {district.district_name}
          </option>
        ))}
      </select>

      <br></br>
      <p>Phường/Xã</p>
      <select
        className="form-select"
        name="wards"
        onChange={handleWardsChange}
        value={selectedWards}
      >
        <option value="">Chọn phường xã</option>
        {wards.map((ward) => (
          <option key={ward.ward_id} value={ward.wards_id}>
            {ward.ward_name}
          </option>
        ))}
      </select>
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
            confirmButtonText: "Yes, Add it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(event);
              if (isSubmitSuccess) {
                Swal.fire("Add!", "Your data has been Add.", "success");
                toast.success("Add Successfully!");
              }
            }
          });
        }}
      >
        Thêm mới
      </button>
    </div>
  );
}
InputCustomer.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputCustomer;
