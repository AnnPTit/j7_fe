import classNames from "classnames/bind";
import style from "./inputDiscountProgram.module.scss";
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

function inputDiscountProgram() {
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

    const accountCode = accountCodeInput?.value;
    const password = passwordInput?.value;
    const gender = genderdInput?.value;
    const fullname = fullNameInput?.value;
    const email = emailInput?.value;
    const phoneNumber = phoneInput?.value;
    const birthdayAccount = birthday;
    const citizenId = citizenIdInput?.value;

    // Tạo payload dữ liệu để gửi đến API
    const payload = {};
    console.log("payload ", payload);

    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return false;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

      // const response = await axios.post("http://localhost:2003/api/admin/account/save", payload); // Gọi API /api/service-type/save với payload và access token
      console.log(response);

      //

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");

        window.location.href = "/discount-program";
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

  return (
    <div className={cx("wrapper")}>
      <h1>Thêm Chương Trình Giảm Giá</h1>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          variant="outlined"
          name="fullname"
        />
        <label htmlFor="floatingPassword">Tên chương trình</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="number"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          variant="outlined"
          name="fullname"
        />
        <label htmlFor="floatingPassword">Hóa đơn tối thiểu</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="number"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          variant="outlined"
          name="fullname"
        />
        <label htmlFor="floatingPassword">Giá trị giảm</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="number"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          variant="outlined"
          name="fullname"
        />
        <label htmlFor="floatingPassword">Số lượng</label>
      </div>
      <br />
      <DatePicker
        label="Ngày áp dụng"
        value={"" || null}
        onChange={handleBirthDayChange}
        className="form-control"
        renderInput={(params) => (
          <TextField
            // style={{ width: 290 }}
            {...params}
            inputProps={{
              readOnly: true,
            }}
          />
        )}
      />
      <br />
      <br />
      <DatePicker
        label="Ngày kết thúc"
        value={"" || null}
        onChange={handleBirthDayChange}
        className="form-control"
        renderInput={(params) => (
          <TextField
            // style={{ width: 290 }}
            {...params}
            inputProps={{
              readOnly: true,
            }}
          />
        )}
      />
      <br />
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
inputDiscountProgram.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default inputDiscountProgram;
// Test pull request
