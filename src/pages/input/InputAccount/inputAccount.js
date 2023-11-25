import classNames from "classnames/bind";
import style from "./inputAccount.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { parse, format } from "date-fns";
import "react-toastify/dist/ReactToastify.css";

import React, { Component } from "react";
import QrReader from "react-qr-scanner";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import { DatePicker, TimePicker } from "@mui/x-date-pickers";

const cx = classNames.bind(style);

function InputAccount() {
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

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get("https://vapi.vnappmob.com/api/province/");
      setProvinces(response.data.results);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (idProvince) {
      const fetchDistricts = async () => {
        const response = await axios.get(
          `https://vapi.vnappmob.com/api/province/district/${idProvince}`
        );
        setDistricts(response.data.results);
      };
      fetchDistricts();
    }
  }, [idProvince]);

  useEffect(() => {
    if (idDistrict) {
      const fetchWards = async () => {
        const response = await axios.get(
          `https://vapi.vnappmob.com/api/province/ward/${idDistrict}`
        );
        setWards(response.data.results);
      };
      fetchWards();
    }
  }, [idDistrict]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    // Lấy giá trị từ các trường nhập liệu
    const accountCodeInput = document.querySelector('input[name="accountCode"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const fullNameInput = document.querySelector('input[name="fullname"]');
    const genderdInput = document.querySelector('input[name="gender"]');
    const emailInput = document.querySelector('input[name="email"]');
    const phoneInput = document.querySelector('input[name="phoneNumber"]');
    const citizenIdInput = document.querySelector('input[name="citizenId"]');

    const wardsInput = document.querySelector('select[name="wards"]');
    const wards = wardsInput?.value;

    const accountCode = accountCodeInput?.value;
    const password = passwordInput?.value;
    const gender = genderdInput?.value;
    const fullname = fullNameInput?.value;
    const email = emailInput?.value;
    const phoneNumber = phoneInput?.value;
    const birthdayAccount = birthday;
    const citizenId = citizenIdInput?.value;

    // Tạo payload dữ liệu để gửi đến API
    const payload = {
      accountCode,
      password,
      gender,
      fullname,
      email,
      phoneNumber,
      birthday: birthdayAccount,
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
       console.log("Bạn chưa đăng nhập");
        return false;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

      const response = await axios.post("http://localhost:2003/api/admin/account/save", payload); // Gọi API /api/service-type/save với payload và access token
      console.log(response);

      //

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
          toast.error(error.response.data);
          const isFullnameError = error.response.data.fullname === undefined;
          const isEmailError = error.response.data.email === undefined;
          const isPhoneNumberError = error.response.data.phoneNumber === undefined;
          const isCitizenIdError = error.response.data.citizenId === undefined;
          const isBirthdayError = error.response.data.birthday === undefined;
          const isProvinceError = error.response.data.provinces === undefined;
          const isDistrictError = error.response.data.districts === undefined;
          const isWardError = error.response.data.wards === undefined;

          if (
            !isFullnameError &&
            !isEmailError &&
            !isPhoneNumberError &&
            !isCitizenIdError &&
            !isBirthdayError &&
            !isWardError
          ) {
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
            toast.error(error.response.data.wards, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            return false;
          } else {
            // Nếu có ít nhất một trường bị thiếu, xóa thông báo lỗi cho trường đó nếu có
            // và hiển thị thông báo lỗi cho các trường còn lại
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
            if (!isWardError) {
              toast.error(error.response.data.wards, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            toast.error(error.response.data.email, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            // if (error.response.data.email) {
            //   // API trả về lỗi cho trường email
            //   toast.error("Email này đã tồn tại!");
            // }

            // if (error.response.data.citizenId) {
            //   // API trả về lỗi cho trường số căn cước công dân
            //   toast.error("Số căn cước công dân này đã tồn tại!");
            // }
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
  // QR Code
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState("No result");
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const [citizenId, setCitizenId] = useState("");
  const [fullname, setFullname] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState("true");

  const handleScan = (data) => {
    if (data && data.text) {
      const scannedText = data.text;
      const dataParts = scannedText.split("|");

      if (dataParts.length === 6) {
        const citizenIdValue = dataParts[0];
        const fullnameValue = dataParts[2];
        const birthdateValue = dataParts[3];
        const genderValue = dataParts[4];
        // const provinceValue = dataParts[5];
        // const districtValue = dataParts[6];
        // const wardValue = dataParts[7];
        const formattedBirthdate = `${birthdateValue.substr(0, 2)}/${birthdateValue.substr(
          2,
          2
        )}/${birthdateValue.substr(4, 4)}`;

        const genderIsMale = genderValue === "Nam";
        setCitizenId(citizenIdValue);
        setFullname(fullnameValue);
        setGender(genderIsMale);
        setBirthday(formattedBirthdate);
      } else if (dataParts.length === 7) {
        const citizenIdValue = dataParts[0];
        const fullnameValue = dataParts[2];
        const birthdateValue = dataParts[3];
        const genderValue = dataParts[4];
        // const provinceValue = dataParts[5];
        // const districtValue = dataParts[6];
        // const wardValue = dataParts[7];
        const formattedBirthdate = `${birthdateValue.substr(0, 2)}/${birthdateValue.substr(
          2,
          2
        )}/${birthdateValue.substr(4, 4)}`;

        const genderIsMale = genderValue === "Nam";
        setCitizenId(citizenIdValue);
        setFullname(fullnameValue);
        setGender(genderIsMale);
        setBirthday(formattedBirthdate);
      } else {
        console.log("Lỗi khi quét QR CCCD:", dataParts.length);
      }
    }
  };
  const formatToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleBirthDayChange = (date) => {
    const formattedDate = formatToDDMMYYYY(date);
    setBirthday(formattedDate);
    console.log(formattedDate);
  };

  const toggleCamera = () => {
    setCameraEnabled((prevCameraEnabled) => {
      if (!prevCameraEnabled) {
        setResult(""); // Reset the result when turning off the camera
      }
      return !prevCameraEnabled;
    });
  };
  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
    transform: cameraEnabled ? "scaleX(-1)" : "none",
  };

  console.log(birthday);

  return (
    <div className={cx("wrapper")}>
      <h1>Thêm Nhân Viên</h1>
      <Paper
        style={{
          height: 400,
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: 400,
          marginLeft: 89,
          marginTop: 30,
        }}
      >
        {cameraEnabled ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <QrReader
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>Camera is disabled.</div>
        )}
        <p>{result}</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="btn btn-outline-primary" onClick={toggleCamera}>
            {cameraEnabled ? "Disable Camera" : "Enable Camera"}
          </button>
        </div>
      </Paper>
      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          variant="outlined"
          name="fullname"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
        />
        <label htmlFor="floatingPassword">Họ tên</label>
      </div>
      <br></br>
      <div className="form-floating sm-1">
          <FormLabel
          class="form-label"
          >
            Giới tính
          </FormLabel>
          <RadioGroup
            style={{ display: "flex", justifyContent: "center" }}
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="gender"
            value={gender || ""}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Nam" />
            <FormControlLabel value="false" control={<Radio />} label="Nữ" />
          </RadioGroup>

      </div>
      <br></br>
      <DatePicker
        label="Ngày sinh"
        value={birthday || null}
        onChange={handleBirthDayChange}
        className="form-control"
        renderInput={(params) => (
          <TextField
            // style={{ width: 290 }}
            {...params}
            inputProps={{
              value: birthday || "",
              readOnly: true,
            }}
          />
        )}
      />
      <br/>
      <br/>
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
          value={citizenId || ""}
          onChange={(e) => setCitizenId(e.target.value)}
        />
        <label htmlFor="floatingPassword">Căn cước công dân</label>
      </div>
      <br/>
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
      <br />
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
      <br />
      <select
        className="form-select"
        name="wards"
        value={selectedWards}
        onChange={handleWardsChange}
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
      <ToastContainer />
    </div>
  );
}
InputAccount.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputAccount;
// Test pull request
