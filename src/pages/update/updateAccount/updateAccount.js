import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import style from "./updateAccount.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

const cx = classNames.bind(style);

function UpdateAccount() {
  // const [serviceType, setServiceType] = useState([]);
  // const [unit, setUnit] = useState([]);
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query
  const [accountUpdate, setAccountUpdate] = useState({
    id: "",
    accountCode: "",
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
          console.log("Bạn chưa đăng nhập");
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
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get(`http://localhost:2003/api/admin/account/detail/${id}`);
        console.log("Account", response.data);

        if (response.data) {
          setAccountUpdate(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, [id]);

  const handleBirthDayChange = (date) => {
    const formattedDate = formatDateToYYYYMMDD(date);
    setAccountUpdate((prev) => ({
      ...prev,
      birthday: formattedDate,
    }));
  };

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  // call api địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWards, setSelectedWards] = useState("");

  const [idProvince, setIdProvince] = useState(0);
  const [idDistrict, setIdDistrict] = useState(0);

  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [proId, setProId] = useState();
  const findProvinceIdByName = (name) => {
    const province = provinces.find((p) => p.province_name === name);
    return province ? province.province_id : null;
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get("https://vapi.vnappmob.com/api/province/");
      setProvinces(response.data.results);
      const idP = response.data.results
        ? response.data.results.find((p) => p.province_name === accountUpdate.provinces)
        : null;
      console.log(idP);
      const province = response.data.results.find((p) => p.province_id === idP?.province_id);
      setSelectedProvince(province);
      setIdProvince(province?.province_id || 0);
      const name = province ? province.province_name : "";
      setSelectedProvinceName(name);
      if (province) {
        setDistricts([]);
        setWards([]);
      }
      console.log(province);
    };
    fetchProvinces();
  }, [accountUpdate.provinces, id]);

  useEffect(() => {
    if (idProvince) {
      const fetchDistricts = async () => {
        const response = await axios.get(
          `https://vapi.vnappmob.com/api/province/district/${idProvince}`
        );
        setDistricts(response.data.results);
        const idD = response.data.results.find((d) => d.district_name === accountUpdate.districts);
        setSelectedDistrict(idD?.district_id);
        const district = response.data.results.find((d) => d.district_id === idD?.district_id);
        setIdDistrict(district?.district_id || 0);
        const name = district ? district.district_name : "";
        setSelectedDistrictName(name);
        if (district) {
          setWards([]);
        }
        console.log(district);
      };
      fetchDistricts();
    }
  }, [accountUpdate.districts, idProvince]);

  useEffect(() => {
    if (idDistrict) {
      const fetchWards = async () => {
        const response = await axios.get(
          `https://vapi.vnappmob.com/api/province/ward/${idDistrict}`
        );
        setWards(response.data.results);
        const ward = response.data.results.find((w) => w.ward_name === accountUpdate.wards);
        console.log(ward);
        setSelectedWards(ward?.ward_id);
        const name = ward ? ward.ward_name : "";
        setSelectedWards(name);
      };
      fetchWards();
    }
  }, [accountUpdate.wards, idDistrict, selectedWards]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    console.log("ABC: ", selectedProvince);
    const province = provinces.find((p) => p.province_id === e.target.value);
    setIdProvince(province?.province_id || 0);
    const name = province ? province.province_name : "";
    setSelectedProvinceName(name);
    if (province) {
      setDistricts([]);
      setWards([]);
    }
    console.log(province);
  };

  useEffect(() => {}, []);

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    const district = districts.find((d) => d.district_id === e.target.value);
    setIdDistrict(district?.district_id || 0);
    const name = district ? district.district_name : "";
    setSelectedDistrictName(name);
    if (district) {
      setWards([]);
    }
    console.log(district);
  };

  const handleWardsChange = (e) => {
    setSelectedWards(e.target.value);
    console.log(e.target.value);
  };

  const findDistrictIdByName = (name) => {
    const district = districts.find((d) => d.district_name === name);
    return district ? district.district_id : null;
  };

  const findWardIdByName = (name) => {
    const ward = wards.find((w) => w.ward_name === name);
    return ward ? ward.ward_id : null;
  };

  const selectedProvinceId = findProvinceIdByName(selectedProvinceName);
  const selectedDistrictId = findDistrictIdByName(selectedDistrictName);
  const selectedWardId = findWardIdByName(selectedWards);

  console.log(provinces);
  const handleSubmit = async (event, id, accountUpdate) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    // Tạo payload dữ liệu để gửi đến API
    const payload = {
      ...accountUpdate,
      id: id,
      accountCode: accountUpdate.accountCode,
      gender: accountUpdate.gender,
      fullname: accountUpdate.fullname,
      email: accountUpdate.email,
      phoneNumber: accountUpdate.phoneNumber,
      birthday: accountUpdate.birthday,
      citizenId: accountUpdate.citizenId,
      provinces: selectedProvinceName,
      districts: selectedDistrictName,
      wards: selectedWards,
    };
    console.log("payload ", payload);

    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return false;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
      const response = await axios.put(
        `http://localhost:2003/api/admin/account/update/${id}`,
        payload
      ); // Gọi API /api/service-type/save với payload và access token
      console.log(response); //

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");

        window.location.href = "/account";
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

          const isAccountCodeError = error.response.data.accountCode === undefined;
          const isFullnameError = error.response.data.fullname === undefined;
          const isEmailError = error.response.data.email === undefined;
          const isPhoneNumberError = error.response.data.phoneNumber === undefined;
          const isCitizenIdError = error.response.data.citizenId === undefined;
          const isBirthdayError = error.response.data.birthday === undefined;

          if (
            !isAccountCodeError &&
            !isFullnameError &&
            !isEmailError &&
            !isPhoneNumberError &&
            !isCitizenIdError &&
            !isBirthdayError
          ) {
            toast.error(error.response.data.accountCode, {
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
            if (!isAccountCodeError) {
              toast.error(error.response.data.accountCode, {
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
  return (
    <div className={cx("wrapper")}>
      <h1>Cập nhật tài khoản</h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="accountCode"
          value={accountUpdate.accountCode}
          onChange={(e) => {
            setAccountUpdate((prev) => ({
              ...prev,
              accountCode: e.target.value,
            }));
          }}
          disabled
        />

        <label htmlFor="floatingInput">Mã nhân viên</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="fullname"
          value={accountUpdate.fullname}
          onChange={(e) => {
            setAccountUpdate((prev) => ({
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
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            Giới tính
          </label>
          <div className="col-sm-10">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                value="true"
                checked={accountUpdate.gender === true}
                onChange={(e) => {
                  setAccountUpdate((prev) => ({
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
                checked={accountUpdate.gender === false}
                onChange={(e) => {
                  setAccountUpdate((prev) => ({
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

      <DatePicker
        className="form-control"
        label="Ngày sinh"
        value={accountUpdate.birthday}
        onChange={handleBirthDayChange}
        format="yyyy-MM-dd"
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              value: accountUpdate.birthday || "",
              readOnly: true,
            }}
          />
        )}
      />
      <br />
      <br></br>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="email"
          value={accountUpdate.email}
          onChange={(e) => {
            setAccountUpdate((prev) => ({
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
          value={accountUpdate.phoneNumber}
          onChange={(e) => {
            setAccountUpdate((prev) => ({
              ...prev,
              phoneNumber: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Số điện thoại</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="citizenId"
          value={accountUpdate.citizenId}
          onChange={(e) => {
            setAccountUpdate((prev) => ({
              ...prev,
              citizenId: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Căn cước công dân</label>
      </div>

      <br />

      <select
        className="form-select"
        name="provinces"
        value={selectedProvinceId} // Sử dụng giá trị đã tìm thấy
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
      <select
        className="form-select"
        name="districts"
        value={selectedDistrictId} // Sử dụng giá trị đã tìm thấy
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
      <select
        className="form-select"
        name="wards"
        value={selectedWardId} // Sử dụng giá trị đã tìm thấy
        onChange={handleWardsChange}
      >
        <option value="">Chọn phường xã</option>
        {wards.map((ward) => (
          <option key={ward.ward_id} value={ward.ward_id}>
            {ward.ward_name}
          </option>
        ))}
      </select>
      <br />
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
              const isSubmitSuccess = await handleSubmit(event, id, accountUpdate);
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
UpdateAccount.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateAccount;
