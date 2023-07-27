import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import style from "./inputCombo.module.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CurrencyInput from "react-currency-input-field";

const cx = classNames.bind(style);
const handleSubmit = async (event, selectedServiceCodes) => {
  event.preventDefault();
  // Lấy giá trị từ các trường nhập liệu
  const comboCodeInpt = document.querySelector('input[name="comboCode"]');
  const comboNameInpt = document.querySelector('input[name="comboName"]');
  const noteInpt = document.querySelector('input[name="note"]');
  const priceInpt = document.querySelector('input[name="price"]');
  const priceString = priceInpt.value; // Lấy giá trị dạng chuỗi từ trường input
  const cleanedPriceString = priceString.replace(/[^0-9]/g, ""); // Loại bỏ các ký tự không phải số
  // const price0 = parseInt(cleanedPriceString, 10); // Chuyển chuỗi thành số nguyên

  const comboCode = comboCodeInpt?.value;
  const comboName = comboNameInpt?.value;
  const note = noteInpt?.value;
  const service = selectedServiceCodes;
  const price = cleanedPriceString;
  // const price = priceInpt?.value;
  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    comboCode,
    comboName,
    note,
    service,
    price,
  };
  console.log(payload);
  // Call API SAVE
  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    console.log(accessToken);
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
      alert("Bạn chưa đăng nhập");
      return false;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
    const response = await axios.post("http://localhost:2003/api/admin/combo/save", payload); // Gọi API /api/service-type/save với payload và access token
    toast.success("Add Successfully!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(response); //

    if (response.status === 200) {
      console.log("API call successful");
      window.location.href = "/combo";
      return true;
    } else {
      console.log("API call failed");
      return false;
    }
  } catch (error) {
    if (error.response) {
      // Xử lý response lỗi
      if (error.response.status === 403) {
        alert("Bạn không có quyền truy cập vào trang này");
        window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
        return false;
      } else if (error.response.status === 400) {
        console.log(error.response);
        // alert(error.response.data.comboCode);
        toast.error(error.response.data.comboName, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.comboCode, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
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

function InputCombo() {
  const [dataService, setDataService] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedServiceCodes, setSelectedServiceCodes] = useState([]);
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { code } = router.query; // Lấy thông tin từ URL qua router.query

  function formatCurrency(price) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get(`http://localhost:2003/api/admin/service/getAll`); // Thay đổi URL API của bạn tại đây
        console.log(response.data);
        setDataService(response.data);
      } catch (error) {
        if (error.response) {
          // Xử lý response lỗi
          if (error.response.status === 403) {
            alert("Bạn không có quyền truy cập vào trang này");
            window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
          } else {
            alert("Có lỗi xảy ra trong quá trình gọi API");
          }
        } else {
          console.log("Không thể kết nối đến API");
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevState) => ({ ...prevState, [name]: checked }));
    if (checked) {
      setSelectedServiceCodes((prevSelectedCodes) => [...prevSelectedCodes, name]);
    } else {
      setSelectedServiceCodes((prevSelectedCodes) =>
        prevSelectedCodes.filter((code) => code !== name)
      );
    }
  };
  return (
    <div className={cx("wrapper")}>
      <h1>Thêm Combo Dịch Vụ</h1>
      <div className=" form-floating mb-3">
        <input className="form-control" type="text" name="comboCode" disabled value={code} />
        <label htmlFor="floatingInput">Mã Combo dịch vụ</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="comboName"
        />
        <label htmlFor="floatingPassword">Tên Combo dịch vụ</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="note"
        />
        <label htmlFor="floatingPassword">Mô tả</label>
      </div>
      <br />
      <p
        style={{
          marginLeft: 10,
        }}
      >
        Dịch vụ
      </p>
      <FormGroup>
        {dataService.map((service) => (
          <FormControlLabel
            key={service.id}
            control={
              <Checkbox
                checked={checkedItems[service.id] || false}
                onChange={handleChange}
                name={service.id}
              />
            }
            label={service.serviceName + " - " + formatCurrency(service.price) + " VND"} // Hiển thị tên dịch vụ và giá với định dạng tiền tệ
          />
        ))}
      </FormGroup>

      <br />
      <p
        style={{
          marginLeft: 10,
        }}
      >
        Đơn giá
      </p>
      <CurrencyInput
        className="form-control"
        id="input-example"
        name="price"
        placeholder="Please enter a number"
        defaultValue={0}
        decimalsLimit={2}
      />
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
              const isSubmitSuccess = await handleSubmit(event, selectedServiceCodes);
              if (isSubmitSuccess) {
                Swal.fire("Add!", "Your data has been Add.", "success");
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

InputCombo.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputCombo;
