import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import style from "./inputDiscountProgram.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import CurrencyInput from "react-currency-input-field";
const cx = classNames.bind(style);

function UpdateDiscountProgram() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [startDay, setStartDay] = useState();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [endDate, setEndDate] = useState();

  const [minimumInvoice, setMinimumInvoice] = useState();
  const [maximumReductionValue, setMaximumReductionValue] = useState();

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

  const [discountProgramUpdate, setDiscountProgramUpdate] = useState({
    id: "",
    name: "",
    code: "",
    minimumInvoice: "",
    reduceValue: "",
    numberOfApplication: "",
    maximumReductionValue: "",
    startDay: "",
    endDate: "",
  });

  console.log("acbc", startDay);
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const formatDate2 = (inputDateString) => {
    const inputDate = new Date(inputDateString);

    const day =(inputDate.getUTCDate()).toString().padStart(2, "0");
    const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = inputDate.getUTCFullYear();

    console.log(`${day}/${month}/${year}`);

    return `${day}/${month}/${year}`;
  };
  function handleChangeMin(value) {
    setDiscountProgramUpdate((prev) => ({
      ...prev,
      minimumInvoice: value,
    }));
  }
  function handleChangeMax(value) {
    setDiscountProgramUpdate((prev) => ({
      ...prev,
      maximumReductionValue: value,
    }));
  }

  const handleSubmit = async (event, id, discountProgramUpdate) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định

    // Tạo payload dữ liệu để gửi đến API
    const payload = {
      ...discountProgramUpdate,
      id: id,
      startDay: startDay,
      endDate: endDate,
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
        `http://localhost:2003/api/admin/discount-program/update/${id}`,
        payload
      ); // Gọi API /api/service-type/save với payload và access token
      console.log(response); //

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
        const response = await axios.get(
          `http://localhost:2003/api/admin/discount-program/detail/${id}`
        );
        console.log("DiscountProgram", response.data);
        // Todo : set start day , enđey
        setStartDay(response.data.startDay);
        setEndDate(response.data.endDate);

        if (response.data) {
          setDiscountProgramUpdate(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, [id]);

  return (
    <div className={cx("wrapper")}>
      <h1>Cập nhật chương trình giảm giá</h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="code"
          value={discountProgramUpdate.name}
          onChange={(e) => {
            setDiscountProgramUpdate((prev) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        />

        <label htmlFor="floatingInput">Tên chương trình</label>
      </div>
      <div className="form-floating">
        <CurrencyInput
          className="form-control"
          id="input-example"
          name="price"
          placeholder="Please enter a number"
          // defaultValue={0}
          // decimalsLimit={2}
          value={discountProgramUpdate.minimumInvoice}
          onValueChange={(value) => handleChangeMin(value)} // Thêm event và value vào hàm
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
          value={discountProgramUpdate.reduceValue}
          onChange={(e) => {
            setDiscountProgramUpdate((prev) => ({
              ...prev,
              reduceValue: e.target.value,
            }));
          }}
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
          name="numberOfApplication"
          value={discountProgramUpdate.numberOfApplication}
          onChange={(e) => {
            setDiscountProgramUpdate((prev) => ({
              ...prev,
              numberOfApplication: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Số lượng</label>
      </div>
      <br />
      <div className="form-floating">
        <CurrencyInput
          className="form-control"
          id="input-example"
          name="price"
          placeholder="Please enter a number"
          // defaultValue={0}
          // decimalsLimit={2}
          value={discountProgramUpdate.maximumReductionValue}
          onValueChange={(value) => handleChangeMax(value)} // Thêm event và value vào hàm
        />
        <label htmlFor="floatingPassword">Giá trị giảm tối đa</label>
      </div>
      <br />
      <DatePicker
        className="form-control"
        label="Ngày bắt đầu"
        disablePast
        value={discountProgramUpdate.startDay}
        onChange={handleDateFromChange}
        renderInput={(params) => (
          <TextField
            style={{ marginRight: 20 }}
            {...params}
            inputProps={{
              value: startDay ? formatDate2(startDay) : "",
              readOnly: true,
            }}
          />
        )}
      />

      <br />
      <br />
      <DatePicker
        className="form-control"
        label="Ngày kết thúc"
        disablePast
        value={discountProgramUpdate.endDate}
        onChange={handleDateToChange}
        renderInput={(params) => (
          <TextField
            style={{ marginRight: 20 }}
            {...params}
            inputProps={{
              value: endDate ? formatDate2(endDate) : "",
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
            confirmButtonText: "Yes, Update it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(event, id, discountProgramUpdate);
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
UpdateDiscountProgram.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateDiscountProgram;
