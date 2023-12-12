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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [startDay, setStartDay] = useState();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [endDate, setEndDate] = useState();

  const handleDateFromChange = (date) => {
    setStartDay(date);
    if (date > endDate) {
      setEndDate(date);
    }
    console.log(date);
  };

  const handleDateToChange = (date) => {
    setEndDate(date);
    if (date < startDay) {
      toast.error("Ngày kết thúc không được trước ngày bắt đầu", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setStartDay(date);
    }
    console.log(date);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định

    // Lấy giá trị từ các trường nhập liệu
    const nameInput = document.querySelector('input[name="name"]');
    const minimumInvoiceInput = document.querySelector('input[name="minimumInvoice"]');
    const reduceValueInput = document.querySelector('input[name="reduceValue"]');
    const numberOfApplicationInput = document.querySelector('input[name="numberOfApplication"]');
    const maximumReductionValueInput = document.querySelector(
      'input[name="maximumReductionValue"]'
    );
    const startDayInput = document.querySelector('input[name="startDay"]');
    const endDateInput = document.querySelector('input[name="endDate"]');

    const name = nameInput?.value;
    const minimumInvoice = minimumInvoiceInput?.value;
    const reduceValue = reduceValueInput?.value;
    const numberOfApplication = numberOfApplicationInput?.value;
    const maximumReductionValue = maximumReductionValueInput?.value;

    // Tạo payload dữ liệu để gửi đến API
    const payload = {
      name,
      minimumInvoice,
      reduceValue,
      numberOfApplication,
      maximumReductionValue,
      startDay,
      endDate,
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

      const response = await axios.post(
        "http://localhost:2003/api/admin/discount-program/save",
        payload
      ); // Gọi API /api/service-type/save với payload và access token
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

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
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
          name="name"
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
          name="minimumInvoice"
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
          name="reduceValue"
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
          name="maximumReductionValue"
        />
        <label htmlFor="floatingPassword">Giá trị giảm tối đa</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="number"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          variant="outlined"
          name="numberOfApplication"
        />
        <label htmlFor="floatingPassword">Số lượng</label>
      </div>
      <br />

      <DatePicker
        className="form-control"
        label="Ngày bắt đầu"
        disablePast
        value={startDay}
        onChange={handleDateFromChange}
        renderInput={(params) => (
          <TextField
            style={{ marginRight: 20 }}
            {...params}
            inputProps={{
              value: formatDate(startDay),
              readOnly: true,
            }}
          />
        )}
      />

      <br />
      <br />
      <DatePicker
        className="form-control"
        disablePast
        label="Ngày kết thúc"
        value={endDate}
        onChange={handleDateToChange}
        renderInput={(params) => (
          <TextField
            style={{ marginRight: 20 }}
            {...params}
            inputProps={{
              value: formatDate(endDate),
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
